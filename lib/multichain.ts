import axios from 'axios';
import { Transaction, TokenTransfer, Chain } from '@/types';
import { SUPPORTED_CHAINS } from './chains';

const API_KEY =
	process.env.ETHERSCAN_API_KEY ||
	process.env.ALCHEMY_API_KEY ||
	'YourApiKeyToken';

// No date filtering - fetch all transactions

interface EtherscanResponse<T> {
	status: string;
	message: string;
	result: T;
}

async function fetchChainData<T>(
	chain: Chain,
	params: Record<string, string>
): Promise<T> {
	const queryParams = new URLSearchParams({
		...params,
		apikey: API_KEY,
	});

	try {
		const response = await axios.get<EtherscanResponse<T>>(
			`${chain.explorerApiUrl}?${queryParams.toString()}`,
			{ timeout: 15000 }
		);

		// Handle different response formats
		if (response.data.status === '0') {
			// Check for specific error messages
			const message = response.data.message || '';

			if (
				message.includes('rate limit') ||
				message.includes('Invalid API Key') ||
				message.includes('Max rate limit')
			) {
				console.warn(`${chain.name}: ${message}`);
				return [] as T;
			}

			// "No transactions found" is a valid response
			if (
				message === 'No transactions found' ||
				message === 'No record found'
			) {
				return [] as T;
			}

			// Log other errors but don't fail
			if (message) {
				console.warn(`${chain.name} API message: ${message}`);
			}

			return [] as T;
		}

		// Check if result is an array
		const result = response.data.result;
		if (Array.isArray(result)) {
			return result as T;
		}

		return [] as T;
	} catch (error: any) {
		console.error(`Error fetching from ${chain.name}:`, error.message || error);
		// Return empty array on error to allow other chains to continue
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
	// For now, only fetch from Base
	const chainsToFetch = SUPPORTED_CHAINS.filter((c) => c.id === 'base');

	const allTransactions: Transaction[] = [];
	const allTokenTransfers: TokenTransfer[] = [];
	const successfulChains: string[] = [];

	// Fetch data from all chains in parallel
	const fetchPromises = chainsToFetch.map(async (chain) => {
		try {
			// Fetch normal transactions
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

			// Fetch token transfers
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

			// Add chain info to all transactions - no filtering
			const transactionsWithChain = (
				Array.isArray(transactions) ? transactions : []
			)
				.filter((tx) => {
					// Only filter out completely invalid/null transactions
					return tx && tx.hash;
				})
				.map((tx) => ({ ...tx, chain: chain.name }));

			const tokenTransfersWithChain = (
				Array.isArray(tokenTransfers) ? tokenTransfers : []
			)
				.filter((tx) => {
					// Only filter out completely invalid/null transactions
					return tx && tx.hash;
				})
				.map((tx) => ({ ...tx, chain: chain.name }));

			// Log for debugging
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

	const results = await Promise.all(fetchPromises);

	// Aggregate all results
	results.forEach((result) => {
		allTransactions.push(...result.transactions);
		allTokenTransfers.push(...result.tokenTransfers);
	});

	// Sort by timestamp
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
