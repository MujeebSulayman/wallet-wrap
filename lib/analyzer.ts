import { Transaction, TokenTransfer, WalletStats } from '@/types'
import { format, parseISO } from 'date-fns'

interface RawWalletData {
  transactions: Transaction[]
  tokenTransfers: TokenTransfer[]
}

export function analyzeWalletData(data: RawWalletData, walletAddress: string): WalletStats {
  const { transactions, tokenTransfers } = data
  const walletAddressLower = walletAddress.toLowerCase()

  // Basic transaction stats
  const totalTransactions = transactions.length
  const successfulTransactions = transactions.filter(
    (tx) => tx.isError === '0'
  ).length
  const failedTransactions = totalTransactions - successfulTransactions

  // Value calculations (in Wei, convert to ETH)
  const totalValueSent = transactions
    .filter((tx) => tx.from.toLowerCase() === walletAddressLower)
    .reduce((sum, tx) => sum + BigInt(tx.value || '0'), BigInt(0))
    .toString()

  const totalValueReceived = transactions
    .filter((tx) => tx.to.toLowerCase() === walletAddressLower)
    .reduce((sum, tx) => sum + BigInt(tx.value || '0'), BigInt(0))
    .toString()

  // Gas calculations
  const totalGasSpent = transactions.reduce(
    (sum, tx) => sum + BigInt(tx.gasUsed || '0') * BigInt(tx.gasPrice || '0'),
    BigInt(0)
  ).toString()

  const averageGasPrice = transactions.length > 0
    ? (transactions.reduce(
        (sum, tx) => sum + BigInt(tx.gasPrice || '0'),
        BigInt(0)
      ) / BigInt(transactions.length)).toString()
    : '0'

  // Token stats
  const uniqueTokens = new Set(
    tokenTransfers.map((tt) => tt.contractAddress.toLowerCase())
  )
  const uniqueContracts = new Set(
    transactions.map((tx) => tx.to.toLowerCase())
  )

  // Date analysis
  const transactionsByDate = new Map<string, number>()
  const transactionsByMonth = new Map<string, number>()
  const activeDays = new Set<string>()

  transactions.forEach((tx) => {
    try {
      const date = new Date(parseInt(tx.timeStamp) * 1000)
      const dateStr = format(date, 'yyyy-MM-dd')
      const monthStr = format(date, 'MMMM yyyy')
      
      transactionsByDate.set(dateStr, (transactionsByDate.get(dateStr) || 0) + 1)
      transactionsByMonth.set(monthStr, (transactionsByMonth.get(monthStr) || 0) + 1)
      activeDays.add(dateStr)
    } catch (e) {
      // Skip invalid dates
    }
  })

  // Most active day
  let mostActiveDay = ''
  let maxDayCount = 0
  transactionsByDate.forEach((count, date) => {
    if (count > maxDayCount) {
      maxDayCount = count
      mostActiveDay = date
    }
  })

  // Most active month
  let mostActiveMonth = ''
  let maxMonthCount = 0
  transactionsByMonth.forEach((count, month) => {
    if (count > maxMonthCount) {
      maxMonthCount = count
      mostActiveMonth = month
    }
  })

  // Transactions by month for chart
  const transactionsByMonthArray = Array.from(transactionsByMonth.entries())
    .map(([month, count]) => ({ month, count }))
    .sort((a, b) => {
      const dateA = new Date(a.month)
      const dateB = new Date(b.month)
      return dateA.getTime() - dateB.getTime()
    })

  // Top tokens
  const tokenCounts = new Map<string, { count: number; value: bigint; symbol: string }>()
  tokenTransfers.forEach((tt) => {
    const key = tt.contractAddress.toLowerCase()
    const existing = tokenCounts.get(key) || { count: 0, value: BigInt(0), symbol: tt.tokenSymbol }
    tokenCounts.set(key, {
      count: existing.count + 1,
      value: existing.value + BigInt(tt.value || '0'),
      symbol: tt.tokenSymbol,
    })
  })

  const topTokens = Array.from(tokenCounts.entries())
    .map(([_, data]) => ({
      symbol: data.symbol,
      count: data.count,
      value: data.value.toString(),
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10)

  // Top contracts
  const contractCounts = new Map<string, number>()
  transactions.forEach((tx) => {
    const key = tx.to.toLowerCase()
    contractCounts.set(key, (contractCounts.get(key) || 0) + 1)
  })

  const topContracts = Array.from(contractCounts.entries())
    .map(([address, count]) => ({ address, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10)

  return {
    totalTransactions,
    successfulTransactions,
    failedTransactions,
    totalValueSent,
    totalValueReceived,
    totalGasSpent,
    uniqueTokensInteracted: uniqueTokens.size,
    uniqueContractsInteracted: uniqueContracts.size,
    mostActiveDay: mostActiveDay ? format(parseISO(mostActiveDay), 'MMMM d, yyyy') : 'N/A',
    mostActiveMonth: mostActiveMonth || 'N/A',
    transactionsByMonth: transactionsByMonthArray,
    topTokens,
    topContracts,
    averageGasPrice,
    totalDaysActive: activeDays.size,
  }
}

