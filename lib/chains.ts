import { Chain } from '@/types'

export const SUPPORTED_CHAINS: Chain[] = [
  {
    id: 'eth',
    name: 'Ethereum',
    rpcUrl: 'https://eth-mainnet.g.alchemy.com/v2',
    explorerApiUrl: 'https://api.etherscan.io/api',
    nativeCurrency: 'ETH',
    enabled: true,
  },
  {
    id: 'polygon',
    name: 'Polygon',
    rpcUrl: 'https://polygon-mainnet.g.alchemy.com/v2',
    explorerApiUrl: 'https://api.polygonscan.com/api',
    nativeCurrency: 'MATIC',
    enabled: true,
  },
  {
    id: 'arbitrum',
    name: 'Arbitrum',
    rpcUrl: 'https://arb-mainnet.g.alchemy.com/v2',
    explorerApiUrl: 'https://api.arbiscan.io/api',
    nativeCurrency: 'ETH',
    enabled: true,
  },
  {
    id: 'optimism',
    name: 'Optimism',
    rpcUrl: 'https://opt-mainnet.g.alchemy.com/v2',
    explorerApiUrl: 'https://api-optimistic.etherscan.io/api',
    nativeCurrency: 'ETH',
    enabled: true,
  },
  {
    id: 'base',
    name: 'Base',
    rpcUrl: 'https://base-mainnet.g.alchemy.com/v2',
    explorerApiUrl: 'https://api.basescan.org/api',
    nativeCurrency: 'ETH',
    enabled: true,
  },
  {
    id: 'zksync',
    name: 'zkSync Era',
    rpcUrl: 'https://mainnet.era.zksync.io',
    explorerApiUrl: 'https://api-era.zksync.network/api',
    nativeCurrency: 'ETH',
    enabled: true,
  },
  {
    id: 'linea',
    name: 'Linea',
    rpcUrl: 'https://linea-mainnet.infura.io/v3',
    explorerApiUrl: 'https://api.lineascan.build/api',
    nativeCurrency: 'ETH',
    enabled: true,
  },
  {
    id: 'scroll',
    name: 'Scroll',
    rpcUrl: 'https://rpc.scroll.io',
    explorerApiUrl: 'https://api.scrollscan.com/api',
    nativeCurrency: 'ETH',
    enabled: true,
  },
  {
    id: 'avalanche',
    name: 'Avalanche',
    rpcUrl: 'https://api.avax.network/ext/bc/C/rpc',
    explorerApiUrl: 'https://api.snowtrace.io/api',
    nativeCurrency: 'AVAX',
    enabled: true,
  },
  {
    id: 'bsc',
    name: 'BNB Chain',
    rpcUrl: 'https://bsc-dataseed.binance.org',
    explorerApiUrl: 'https://api.bscscan.com/api',
    nativeCurrency: 'BNB',
    enabled: true,
  },
]

export function getChainById(id: string): Chain | undefined {
  return SUPPORTED_CHAINS.find((chain) => chain.id === id)
}

export function getEnabledChains(): Chain[] {
  return SUPPORTED_CHAINS.filter((chain) => chain.enabled)
}

