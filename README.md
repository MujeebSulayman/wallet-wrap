# Multi-Chain Wallet Wrapped 2025

A beautiful Spotify Wrapped-style application that shows all activities of a wallet address across Ethereum and all major L2s for the year 2025.

## Features

-  **Multi-Chain Support**: Automatically scans Ethereum, Polygon, Arbitrum, Optimism, Base, zkSync, Linea, Scroll, Avalanche, BNB Chain
-  **Background Music**: Ambient music plays during the wrapped experience (add your own MP3 file)
-  Complete transaction analysis across all chains
-  Token transfer tracking
-  Beautiful charts and visualizations
-  Spotify Wrapped-inspired design with slide-by-slide reveal
-  Real-time data from multiple chain APIs
-  Responsive design

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn

### Installation

1. Install dependencies:
```bash
npm install
```



Note: The app will work without an API key for testing, but you'll be rate-limited. Get free API keys from:
- [Etherscan](https://etherscan.io/apis) - works for Ethereum and many L2s
- [Alchemy](https://www.alchemy.com/) - unified API for multiple chains
- Individual chain explorers (Polygonscan, Arbiscan, Base, Ethereum, etc.)

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. Enter a wallet address (0x...)
2. Select which chains you want to analyze (or leave all selected)
3. Click "Generate My Wrapped"
4. View your 2025 wallet activity summary across all selected chains with:
   - Total transactions and success rate
   - Gas spent and average gas price
   - Value sent and received
   - Most active days and months
   - Top tokens and contracts interacted with
   - Beautiful charts and visualizations

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Recharts
- Multi-chain APIs (Etherscan-compatible APIs for each chain)
- date-fns

