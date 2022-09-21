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
  const files = fs.readdirSync('./api/data')
  const allItems = []
  for (const file of files) {
    const rows = processFile(file)
    allItems.push(...rows)
  }
  fs.writeFileSync('./api/data/all_data.json', JSON.stringify(allItems))
}

function processFile(filepath: string): Row[] {
  const file = fs.readFileSync(`./api/data/${ filepath }`)
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
