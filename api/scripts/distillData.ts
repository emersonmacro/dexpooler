import * as fs from 'fs'

const THRESHOLD = 1000

interface Token {
  contractAddress: string
  name: string
  symbol: string
  logoUrl: string
}

interface Row {
  network: string
  chainId: string
  dex: string
  tokenA: Token
  tokenB: Token
  volume7day: number
  liquidity: number
  exchangeAddress: string
}

distillData()

function distillData() {
  const files = fs.readdirSync('./data')
  const allItems = []
  for (const file of files) {
    const rows = processFile(file)
    allItems.push(...rows)
  }
  fs.writeFileSync('data/all_data.json', JSON.stringify(allItems))
}

function processFile(filepath: string): Row[] {
  const file = fs.readFileSync(`./data/${ filepath }`)
  const data = JSON.parse(file.toString())
  const rows: Row[] = []
  for (const item of data.data.items) {
    // filter out pools with liquidity < threshold
    if (item.total_liquidity_quote < THRESHOLD) {
      return []
    }
    const row: Row = {
      network: item['chain_name'],
      chainId: item['chain_id'],
      dex: item['dex_name'],
      tokenA: {
        contractAddress: item['token_0']['contract_address'],
        name: item['token_0']['contract_name'],
        symbol: item['token_0']['contract_ticker_symbol'],
        logoUrl: item['token_0']['logo_url'],
      },
      tokenB: {
        contractAddress: item['token_1']['contract_address'],
        name: item['token_1']['contract_name'],
        symbol: item['token_1']['contract_ticker_symbol'],
        logoUrl: item['token_1']['logo_url'],
      },
      volume7day: item['volume_7d_quote'],
      liquidity: item['total_liquidity_quote'],
      exchangeAddress: item['exchange'],
    }
    rows.push(row)
  }
  return rows
}

// const THRESHOLD = 1000

// distillData()

// function distillData() {
//   console.log('[distillData]')
//   const files = fs.readdirSync('./data')
//   // console.log(files)
//   // processFile(files[0])
//   const totalStats = {
//     total: 0,
//     liquidityBelowThreshold: 0,
//     volumeBelowThreshold: 0,
//     bothBelowThreshold: 0,
//   }
//   for (const file of files) {
//     const stats = processFile(file)
//     totalStats.total += stats.total
//     totalStats.liquidityBelowThreshold += stats.liquidityBelowThreshold
//     totalStats.volumeBelowThreshold += stats.volumeBelowThreshold
//     totalStats.bothBelowThreshold += stats.bothBelowThreshold
//   }
//   console.log('[distillData] total stats:')
//   console.log(totalStats)
// }

// function processFile(filepath: string) {
//   // console.log(`[processFile]`)
//   const file = fs.readFileSync(`./data/${ filepath }`)
//   const data = JSON.parse(file.toString())
//   // console.log(data)
//   // console.log(data.data.items[0])
//   return runStats(data)
// }

// function runStats(data: any) {
//   const stats = {
//     total: 0,
//     liquidityBelowThreshold: 0,
//     volumeBelowThreshold: 0,
//     bothBelowThreshold: 0,
//   }
//   for (const item of data.data.items) {
//     stats.total++
//     if (item.total_liquidity_quote < THRESHOLD) {
//       stats.liquidityBelowThreshold++
//     }
//     if (item.volume_7d_quote < THRESHOLD) {
//       stats.volumeBelowThreshold++
//     }
//     if (item.total_liquidity_quote < THRESHOLD && item.volume_7d_quote < THRESHOLD) {
//       stats.bothBelowThreshold++
//     }
//   }
//   return stats
// }
