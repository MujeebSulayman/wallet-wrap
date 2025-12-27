import axios from 'axios';
import { Transaction, TokenTransfer, Chain } from '@/types';
import { SUPPORTED_CHAINS, getEnabledChains } from './chains';

const API_KEY =
	process.env.ETHERSCAN_API_KEY ||
	process.env.ALCHEMY_API_KEY ||
	'YourApiKeyToken';

interface EtherscanResponse<T> {
	status: string;
	message: string;
	result: T;
}

function delay(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchChainData<T>(
	chain: Chain,
	params: Record<string, string>
): Promise<T> {
	const queryParams = new URLSearchParams({
		...params,
		apikey: API_KEY,
	});

	if (chain.chainId) {
		queryParams.set('chainid', chain.chainId);
	}

	try {
		const url = `${chain.explorerApiUrl}?${queryParams.toString()}`;
		console.log(
			`Fetching from ${chain.name}: ${url.replace(API_KEY, 'API_KEY_HIDDEN')}`
		);

		const response = await axios.get<EtherscanResponse<T>>(url, {
			timeout: 15000,
		});

		console.log(`${chain.name} Response:`, {
			status: response.data.status,
			message: response.data.message,
			resultType: Array.isArray(response.data.result)
				? 'array'
				: typeof response.data.result,
			resultLength: Array.isArray(response.data.result)
				? response.data.result.length
				: 'N/A',
		});

		if (response.data.status === '0' || response.data.message === 'NOTOK') {
			const message = response.data.message || '';
			const result = response.data.result;

			if (typeof result === 'string') {
				if (result.includes('Free API access is not supported')) {
					console.log(`${chain.name}: Requires paid API plan, skipping`);
					return [] as T;
				}

				if (result.includes('Invalid API Key')) {
					return [] as T;
				}
			}

			if (
				message === 'No transactions found' ||
				message === 'No record found' ||
				(typeof result === 'string' && result.includes('No transactions'))
			) {
				return [] as T;
			}

			if (message || result) {
				console.warn(`${chain.name} API message: ${message || result}`);
			}

			return [] as T;
		}

		const result = response.data.result;
		if (Array.isArray(result)) {
			return result as T;
		}

		return [] as T;
	} catch (error: any) {
		console.error(`Error fetching from ${chain.name}:`, error.message || error);
		return [] as T;
	}
}

export async function fetchMultiChainWalletData(
	address: string,
	chainIds: string[] = []
): Promise<{
	transactions: Transaction[];
	tokenTransfers: TokenTransfer[];
	chains: string[];
}> {
	const chainsToFetch =
		chainIds.length > 0
			? (chainIds
					.map((id) => SUPPORTED_CHAINS.find((c) => c.id === id))
					.filter(Boolean) as Chain[])
			: getEnabledChains();

	const allTransactions: Transaction[] = [];
	const allTokenTransfers: TokenTransfer[] = [];
	const successfulChains: string[] = [];

	const BATCH_SIZE = 2;
	const DELAY_BETWEEN_BATCHES = 500;

	for (let i = 0; i < chainsToFetch.length; i += BATCH_SIZE) {
		const batch = chainsToFetch.slice(i, i + BATCH_SIZE);

		const batchPromises = batch.map(async (chain) => {
			try {
				const transactions = await fetchChainData<Transaction[]>(chain, {
					module: 'account',
					action: 'txlist',
					address,
					startblock: '0',
					endblock: '99999999',
					page: '1',
					offset: '10000',
					sort: 'asc',
				});

				await delay(400);

				const tokenTransfers = await fetchChainData<TokenTransfer[]>(chain, {
					module: 'account',
					action: 'tokentx',
					address,
					startblock: '0',
					endblock: '99999999',
					page: '1',
					offset: '10000',
					sort: 'asc',
				});

				const transactionsWithChain = (
					Array.isArray(transactions) ? transactions : []
				)
					.filter((tx) => {
						return tx && tx.hash;
					})
					.map((tx) => ({ ...tx, chain: chain.name }));

				const tokenTransfersWithChain = (
					Array.isArray(tokenTransfers) ? tokenTransfers : []
				)
					.filter((tx) => {
						return tx && tx.hash;
					})
					.map((tx) => ({ ...tx, chain: chain.name }));

				if (transactions.length > 0 || tokenTransfers.length > 0) {
					console.log(
						`${chain.name}: Found ${transactions.length} transactions, ${tokenTransfers.length} token transfers`
					);
					console.log(
						`${chain.name}: Processed ${transactionsWithChain.length} transactions, ${tokenTransfersWithChain.length} token transfers`
					);
				}

				if (
					transactionsWithChain.length > 0 ||
					tokenTransfersWithChain.length > 0
				) {
					successfulChains.push(chain.name);
				}

				return {
					transactions: transactionsWithChain,
					tokenTransfers: tokenTransfersWithChain,
				};
			} catch (error) {
				console.error(`Error fetching data for ${chain.name}:`, error);
				return {
					transactions: [],
					tokenTransfers: [],
				};
			}
		});

		const batchResults = await Promise.all(batchPromises);

		batchResults.forEach((result) => {
			allTransactions.push(...result.transactions);
			allTokenTransfers.push(...result.tokenTransfers);
		});

		if (i + BATCH_SIZE < chainsToFetch.length) {
			await delay(DELAY_BETWEEN_BATCHES);
		}
	}

	allTransactions.sort((a, b) => parseInt(a.timeStamp) - parseInt(b.timeStamp));
	allTokenTransfers.sort(
		(a, b) => parseInt(a.timeStamp) - parseInt(b.timeStamp)
	);

	console.log(
		`Total aggregated: ${allTransactions.length} transactions, ${allTokenTransfers.length} token transfers from ${successfulChains.length} chains`
	);

	return {
		transactions: allTransactions,
		tokenTransfers: allTokenTransfers,
		chains: successfulChains,
	};
}
