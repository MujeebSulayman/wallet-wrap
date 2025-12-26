import axios from 'axios'
import { Transaction, TokenTransfer } from '@/types'

const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || 'YourApiKeyToken'
const ETHERSCAN_BASE_URL = 'https://api.etherscan.io/api'

// Get start and end timestamps for 2025
const YEAR_2025_START = Math.floor(new Date('2025-01-01').getTime() / 1000)
const YEAR_2025_END = Math.floor(new Date('2025-12-31T23:59:59').getTime() / 1000)

interface EtherscanResponse<T> {
  status: string
  message: string
  result: T
}

async function fetchEtherscanData<T>(
  params: Record<string, string>
): Promise<T> {
  const queryParams = new URLSearchParams({
    ...params,
    apikey: ETHERSCAN_API_KEY,
  })

  const response = await axios.get<EtherscanResponse<T>>(
    `${ETHERSCAN_BASE_URL}?${queryParams.toString()}`
  )

  if (response.data.status === '0' && response.data.message !== 'No transactions found') {
    throw new Error(response.data.message || 'Etherscan API error')
  }

  return response.data.result as T
}

export async function fetchWalletData(address: string) {
  try {
    // Fetch normal transactions
    const transactions = await fetchEtherscanData<Transaction[]>({
      module: 'account',
      action: 'txlist',
      address,
      startblock: '0',
      endblock: '99999999',
      page: '1',
      offset: '10000',
      sort: 'asc',
    })

    // Fetch token transfers
    const tokenTransfers = await fetchEtherscanData<TokenTransfer[]>({
      module: 'account',
      action: 'tokentx',
      address,
      startblock: '0',
      endblock: '99999999',
      page: '1',
      offset: '10000',
      sort: 'asc',
    })

    // Filter for 2025 only
    const transactions2025 = transactions.filter((tx) => {
      const timestamp = parseInt(tx.timeStamp)
      return timestamp >= YEAR_2025_START && timestamp <= YEAR_2025_END
    })

    const tokenTransfers2025 = tokenTransfers.filter((tx) => {
      const timestamp = parseInt(tx.timeStamp)
      return timestamp >= YEAR_2025_START && timestamp <= YEAR_2025_END
    })

    return {
      transactions: transactions2025,
      tokenTransfers: tokenTransfers2025,
    }
  } catch (error) {
    console.error('Error fetching from Etherscan:', error)
    throw error
  }
}

