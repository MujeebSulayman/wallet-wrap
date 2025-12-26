export interface Transaction {
	hash: string;
	from: string;
	to: string;
	value: string;
	timeStamp: string;
	gasUsed: string;
	gasPrice: string;
	isError: string;
	methodId?: string;
	functionName?: string;
	chain?: string;
}

export interface TokenTransfer {
	hash: string;
	from: string;
	to: string;
	value: string;
	timeStamp: string;
	tokenName: string;
	tokenSymbol: string;
	tokenDecimal: string;
	contractAddress: string;
	chain?: string;
}

export interface WalletStats {
	totalTransactions: number;
	successfulTransactions: number;
	failedTransactions: number;
	totalValueSent: string;
	totalValueReceived: string;
	totalGasSpent: string;
	uniqueTokensInteracted: number;
	uniqueContractsInteracted: number;
	mostActiveDay: string;
	mostActiveMonth: string;
	transactionsByMonth: { month: string; count: number }[];
	topTokens: { symbol: string; count: number; value: string }[];
	topContracts: { address: string; count: number }[];
	averageGasPrice: string;
	totalDaysActive: number;
}

export interface WalletData {
	address: string;
	stats: WalletStats;
	transactions: Transaction[];
	tokenTransfers: TokenTransfer[];
	chains: string[];
}

export interface Chain {
	id: string;
	name: string;
	rpcUrl: string;
	explorerApiUrl: string;
	nativeCurrency: string;
	enabled: boolean;
}
