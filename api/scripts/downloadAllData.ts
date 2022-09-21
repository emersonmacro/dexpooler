import axios from 'axios'
import * as dotenv from 'dotenv'
import { writeFileSync } from 'fs'

dotenv.config()

const API = 'https://api.covalenthq.com/v1/'
const API_KEY = process.env.COVALENT_API_KEY

interface Networks {
  [key: string]: {
    chainId: string
    dexes: string[]
  }
}

const networks: Networks = {
  'ethereum': {
    chainId: '1',
    dexes: ['uniswap_v2', 'sushiswap'],
  },
  'polygon': {
    chainId: '137',
    dexes: ['sushiswap', 'quickswap'],
  },
  'avalanche': {
    chainId: '43114',
    dexes: ['sushiswap', 'pangolin', 'traderjoe'],
  },
  'bsc': {
    chainId: '56',
    dexes: ['sushiswap', 'pancakeswap_v2', 'apeswap_v2'],
  },
  'fantom': {
    chainId: '250',
    dexes: ['sushiswap', 'spiritswap', 'spookyswap'],
  },
}

async function downloadAllData() {
  for (const key of Object.keys(networks)) {
    const network = networks[key]
    for (const dex of network.dexes) {
      // https://api.covalenthq.com/v1/1/xy=k/uniswap_v2/pools/?quote-currency=USD&format=JSON&page-number=2&page-size=20&key=ckey_f2d3fd74f77c48b4aa6a9eaa44e
      const pageSize = 100
      let pageNumber = 0
      let hasMore = true
      while (hasMore) {
        try {
          const query = `?key=${ API_KEY }&quote-currency=USD&format=JSON&page-number=${ pageNumber }&page-size=${ pageSize }`
          const url = `${ API }${ network.chainId }/xy=k/${ dex }/pools/${ query }`
          const res = await axios.get(url)
          console.log(`Retrieved data for ${ dex } on ${ key }...`)
          const filepath = `data/${ key }_${ dex }_${ pageNumber }.json`
          writeFileSync(filepath, JSON.stringify(res.data))
          console.log(`Data saved to ${ filepath }`)
          console.log(`Has more data: ${res.data.data.pagination.has_more  }`)
          if (res.data.data.pagination.has_more) {
            pageNumber++
          } else {
            hasMore = false
          }
          await sleep(0.5)
        } catch (err) {
          console.log(`Error retrieving data for ${ dex } on ${ key }:`)
          console.log(err)
          hasMore = false
          await sleep(0.5)
        }
      }
    }
  }
  console.log('DONE!')
}

downloadAllData()

function sleep(seconds: number) {
  return new Promise(resolve => setTimeout(resolve, seconds * 1000))
}

// 3971902777179486792773
// ----876543210987654321

// async function main() {
//   // const CHAIN_ID = '137' // Polygon
//   // const DEX = 'quickswap'
//   const CHAIN_ID = '1'
//   // const DEX = 'sushiswap'
//   const DEX = 'uniswap_v2'
//   const res = await axios.get(`${ API }${ CHAIN_ID }/xy=k/${ DEX }/pools/?${ KEY }`)
//   console.log(`RES: ${ res.status } ${ res.statusText }`)
//   console.log('DATA:')
//   console.log(res.data)
//   console.log('EXAMPLE:')
//   console.log(res.data.data.items[2])
// }
