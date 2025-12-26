import { Transaction, TokenTransfer, WalletStats } from '@/types';
import { format, parseISO } from 'date-fns';

interface RawWalletData {
	transactions: Transaction[];
	tokenTransfers: TokenTransfer[];
}

export function analyzeWalletData(
	data: RawWalletData,
	walletAddress: string
): WalletStats {
	const { transactions, tokenTransfers } = data;
	const walletAddressLower = walletAddress.toLowerCase();

	// Basic transaction stats
	const totalTransactions = transactions.length;
	const successfulTransactions = transactions.filter(
		(tx) => tx.isError === '0'
	).length;
	const failedTransactions = totalTransactions - successfulTransactions;

	// Value calculations (in Wei, convert to ETH)
	const totalValueSent = transactions
		.filter((tx) => tx.from.toLowerCase() === walletAddressLower)
		.reduce((sum, tx) => sum + BigInt(tx.value || '0'), BigInt(0))
		.toString();

	const totalValueReceived = transactions
		.filter((tx) => tx.to.toLowerCase() === walletAddressLower)
		.reduce((sum, tx) => sum + BigInt(tx.value || '0'), BigInt(0))
		.toString();

	// Gas calculations
	const totalGasSpent = transactions
		.reduce(
			(sum, tx) => sum + BigInt(tx.gasUsed || '0') * BigInt(tx.gasPrice || '0'),
			BigInt(0)
		)
		.toString();

	const averageGasPrice =
		transactions.length > 0
			? (
					transactions.reduce(
						(sum, tx) => sum + BigInt(tx.gasPrice || '0'),
						BigInt(0)
					) / BigInt(transactions.length)
			  ).toString()
			: '0';

	// Token stats
	const uniqueTokens = new Set(
		tokenTransfers.map((tt) => tt.contractAddress.toLowerCase())
	);
	const uniqueContracts = new Set(
		transactions.map((tx) => tx.to.toLowerCase())
	);

	// Date analysis
	const transactionsByDate = new Map<string, number>();
	const transactionsByMonth = new Map<string, number>();
	const activeDays = new Set<string>();

	transactions.forEach((tx) => {
		try {
			const date = new Date(parseInt(tx.timeStamp) * 1000);
			const dateStr = format(date, 'yyyy-MM-dd');
			const monthStr = format(date, 'MMMM yyyy');

			transactionsByDate.set(
				dateStr,
				(transactionsByDate.get(dateStr) || 0) + 1
			);
			transactionsByMonth.set(
				monthStr,
				(transactionsByMonth.get(monthStr) || 0) + 1
			);
			activeDays.add(dateStr);
		} catch (e) {
			// Skip invalid dates
		}
	});

	// Most active day
	let mostActiveDay = '';
	let maxDayCount = 0;
	transactionsByDate.forEach((count, date) => {
		if (count > maxDayCount) {
			maxDayCount = count;
			mostActiveDay = date;
		}
	});

	// Most active month
	let mostActiveMonth = '';
	let maxMonthCount = 0;
	transactionsByMonth.forEach((count, month) => {
		if (count > maxMonthCount) {
			maxMonthCount = count;
			mostActiveMonth = month;
		}
	});

	// Transactions by month for chart
	const transactionsByMonthArray = Array.from(transactionsByMonth.entries())
		.map(([month, count]) => ({ month, count }))
		.sort((a, b) => {
			const dateA = new Date(a.month);
			const dateB = new Date(b.month);
			return dateA.getTime() - dateB.getTime();
		});

	// Top tokens
	const tokenCounts = new Map<
		string,
		{ count: number; value: bigint; symbol: string }
	>();
	tokenTransfers.forEach((tt) => {
		const key = tt.contractAddress.toLowerCase();
		const existing = tokenCounts.get(key) || {
			count: 0,
			value: BigInt(0),
			symbol: tt.tokenSymbol,
		};
		tokenCounts.set(key, {
			count: existing.count + 1,
			value: existing.value + BigInt(tt.value || '0'),
			symbol: tt.tokenSymbol,
		});
	});

	const topTokens = Array.from(tokenCounts.entries())
		.map(([_, data]) => ({
			symbol: data.symbol,
			count: data.count,
			value: data.value.toString(),
		}))
		.sort((a, b) => b.count - a.count)
		.slice(0, 10);

	// Top contracts
	const contractCounts = new Map<string, number>();
	transactions.forEach((tx) => {
		const key = tx.to.toLowerCase();
		contractCounts.set(key, (contractCounts.get(key) || 0) + 1);
	});

	const topContracts = Array.from(contractCounts.entries())
		.map(([address, count]) => ({ address, count }))
		.sort((a, b) => b.count - a.count)
		.slice(0, 10);

	// Token value calculations
	const tokenValueReceived = tokenTransfers
		.filter((tt) => tt.to.toLowerCase() === walletAddressLower)
		.reduce((sum, tt) => {
			try {
				const decimals = parseInt(tt.tokenDecimal || '18');
				const value = BigInt(tt.value || '0');
				// Convert to standard 18 decimals for comparison (approximate)
				return sum + value;
			} catch {
				return sum;
			}
		}, BigInt(0))
		.toString();

	const tokenValueSent = tokenTransfers
		.filter((tt) => tt.from.toLowerCase() === walletAddressLower)
		.reduce((sum, tt) => {
			try {
				const value = BigInt(tt.value || '0');
				return sum + value;
			} catch {
				return sum;
			}
		}, BigInt(0))
		.toString();

	// Detect airdrops (token transfers received where from is null/zero address or no corresponding send)
	const zeroAddress = '0x0000000000000000000000000000000000000000';
	const airdropMap = new Map<
		string,
		{ value: bigint; count: number; symbol: string }
	>();

	tokenTransfers
		.filter((tt) => {
			const toMatch = tt.to.toLowerCase() === walletAddressLower;
			const fromZero = tt.from.toLowerCase() === zeroAddress;
			// Check if there's no corresponding send from this wallet
			const hasNoSend = !tokenTransfers.some(
				(send) =>
					send.from.toLowerCase() === walletAddressLower &&
					send.contractAddress.toLowerCase() ===
						tt.contractAddress.toLowerCase() &&
					send.hash !== tt.hash
			);
			return toMatch && (fromZero || hasNoSend);
		})
		.forEach((tt) => {
			const key = tt.contractAddress.toLowerCase();
			const existing = airdropMap.get(key) || {
				value: BigInt(0),
				count: 0,
				symbol: tt.tokenSymbol,
			};
			airdropMap.set(key, {
				value: existing.value + BigInt(tt.value || '0'),
				count: existing.count + 1,
				symbol: tt.tokenSymbol,
			});
		});

	const airdrops = Array.from(airdropMap.entries())
		.map(([_, data]) => ({
			symbol: data.symbol,
			value: data.value.toString(),
			count: data.count,
		}))
		.sort((a, b) => {
			const valA = BigInt(a.value);
			const valB = BigInt(b.value);
			return valA > valB ? -1 : valA < valB ? 1 : 0;
		})
		.slice(0, 10);

	// Contract interactions (transactions to contracts, not simple transfers)
	const contractInteractions = transactions.filter((tx) => {
		const to = tx.to.toLowerCase();
		// Exclude simple ETH transfers (no methodId or functionName)
		return tx.methodId && tx.methodId !== '0x' && tx.methodId !== '';
	}).length;

	// Largest transaction
	let largestTransaction: {
		value: string;
		type: 'in' | 'out';
		hash: string;
	} | null = null;
	let largestValue = BigInt(0);

	transactions.forEach((tx) => {
		const value = BigInt(tx.value || '0');
		if (value > largestValue) {
			largestValue = value;
			const isIn = tx.to.toLowerCase() === walletAddressLower;
			largestTransaction = {
				value: value.toString(),
				type: isIn ? 'in' : 'out',
				hash: tx.hash,
			};
		}
	});

	// Net flow (received - sent) - only native ETH, not tokens
	// Token values have different decimals and shouldn't be mixed with ETH
	const netFlow = (
		BigInt(totalValueReceived) - BigInt(totalValueSent)
	).toString();

	return {
		totalTransactions,
		successfulTransactions,
		failedTransactions,
		totalValueSent,
		totalValueReceived,
		totalGasSpent,
		uniqueTokensInteracted: uniqueTokens.size,
		uniqueContractsInteracted: uniqueContracts.size,
		mostActiveDay: mostActiveDay
			? format(parseISO(mostActiveDay), 'MMMM d, yyyy')
			: 'N/A',
		mostActiveMonth: mostActiveMonth || 'N/A',
		transactionsByMonth: transactionsByMonthArray,
		topTokens,
		topContracts,
		averageGasPrice,
		totalDaysActive: activeDays.size,
		totalTokenValueReceived: tokenValueReceived,
		totalTokenValueSent: tokenValueSent,
		airdrops,
		contractInteractions,
		largestTransaction,
		netFlow,
	};
}
