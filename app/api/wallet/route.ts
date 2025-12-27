import { NextRequest, NextResponse } from 'next/server';
import { analyzeWalletData } from '@/lib/analyzer';
import { fetchMultiChainWalletData } from '@/lib/multichain';
import { getEnabledChains } from '@/lib/chains';

export async function GET(request: NextRequest) {
	const searchParams = request.nextUrl.searchParams;
	const address = searchParams.get('address');
	const chainsParam = searchParams.get('chains');
	
	const chains: string[] = chainsParam 
		? chainsParam.split(',').filter(Boolean) 
		: getEnabledChains().map(chain => chain.id);

	if (!address) {
		return NextResponse.json(
			{ error: 'Wallet address is required' },
			{ status: 400 }
		);
	}

	if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
		return NextResponse.json(
			{ error: 'Invalid Ethereum address format' },
			{ status: 400 }
		);
	}

	try {
		console.log(`Fetching data for address: ${address}`);
		console.log(`Chains to fetch: ${chains.join(', ')}`);
		const walletData = await fetchMultiChainWalletData(address, chains);
		
		console.log(`Total transactions found: ${walletData.transactions.length}`);
		console.log(`Total token transfers found: ${walletData.tokenTransfers.length}`);
		console.log(`Chains with data: ${walletData.chains.join(', ') || 'None'}`);
		
		const stats = analyzeWalletData(walletData, address);

		return NextResponse.json({
			address,
			stats,
			transactions: walletData.transactions,
			tokenTransfers: walletData.tokenTransfers,
			chains: walletData.chains,
		});
	} catch (error: any) {
		console.error('Error fetching wallet data:', error);
		return NextResponse.json(
			{ error: error.message || 'Failed to fetch wallet data. Please try again later.' },
			{ status: 500 }
		);
	}
}
