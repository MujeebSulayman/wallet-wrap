export function formatEther(wei: string): string {
  const weiBigInt = BigInt(wei)
  const ether = Number(weiBigInt) / 1e18
  return ether.toFixed(4)
}

export function formatGwei(wei: string): string {
  const weiBigInt = BigInt(wei)
  const gwei = Number(weiBigInt) / 1e9
  return gwei.toFixed(2)
}

export function shortenAddress(address: string, chars = 4): string {
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-US').format(num)
}

