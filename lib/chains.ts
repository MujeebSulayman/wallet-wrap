import { Chain } from '@/types';

export const SUPPORTED_CHAINS: Chain[] = [
	{
		id: 'eth',
		name: 'Ethereum',
		rpcUrl: 'https://eth-mainnet.g.alchemy.com/v2',
		explorerApiUrl: 'https://api.etherscan.io/v2/api',
		nativeCurrency: 'ETH',
		enabled: true,
		chainId: '1',
	},
	{
		id: 'polygon',
		name: 'Polygon',
		rpcUrl: 'https://polygon-mainnet.g.alchemy.com/v2',
		explorerApiUrl: 'https://api.etherscan.io/v2/api',
		nativeCurrency: 'MATIC',
		enabled: true,
		chainId: '137',
	},
	{
		id: 'arbitrum',
		name: 'Arbitrum',
		rpcUrl: 'https://arb-mainnet.g.alchemy.com/v2',
		explorerApiUrl: 'https://api.etherscan.io/v2/api',
		nativeCurrency: 'ETH',
		enabled: true,
		chainId: '42161',
	},
	{
		id: 'optimism',
		name: 'Optimism',
		rpcUrl: 'https://opt-mainnet.g.alchemy.com/v2',
		explorerApiUrl: 'https://api.etherscan.io/v2/api',
		nativeCurrency: 'ETH',
		enabled: true,
		chainId: '10',
	},
	{
		id: 'base',
		name: 'Base',
		rpcUrl: 'https://base-mainnet.g.alchemy.com/v2',
		explorerApiUrl: 'https://api.etherscan.io/v2/api',
		nativeCurrency: 'ETH',
		enabled: true,
		chainId: '8453',
	},
	{
		id: 'zksync',
		name: 'zkSync Era',
		rpcUrl: 'https://mainnet.era.zksync.io',
		explorerApiUrl: 'https://api.etherscan.io/v2/api',
		nativeCurrency: 'ETH',
		enabled: true,
		chainId: '324',
	},
	{
		id: 'linea',
		name: 'Linea',
		rpcUrl: 'https://linea-mainnet.infura.io/v3',
		explorerApiUrl: 'https://api.etherscan.io/v2/api',
		nativeCurrency: 'ETH',
		enabled: true,
		chainId: '59144',
	},
	{
		id: 'scroll',
		name: 'Scroll',
		rpcUrl: 'https://rpc.scroll.io',
		explorerApiUrl: 'https://api.etherscan.io/v2/api',
		nativeCurrency: 'ETH',
		enabled: true,
		chainId: '534352',
	},
	{
		id: 'avalanche',
		name: 'Avalanche',
		rpcUrl: 'https://api.avax.network/ext/bc/C/rpc',
		explorerApiUrl: 'https://api.etherscan.io/v2/api',
		nativeCurrency: 'AVAX',
		enabled: true,
		chainId: '43114',
	},
	{
		id: 'bsc',
		name: 'BNB Chain',
		rpcUrl: 'https://bsc-dataseed.binance.org',
		explorerApiUrl: 'https://api.etherscan.io/v2/api',
		nativeCurrency: 'BNB',
		enabled: true,
		chainId: '56',
	},
];

export function getChainById(id: string): Chain | undefined {
	return SUPPORTED_CHAINS.find((chain) => chain.id === id);
}

export function getEnabledChains(): Chain[] {
	return SUPPORTED_CHAINS.filter((chain) => chain.enabled);
}
