import { registerChain } from './asset'
import { httpRequest } from '@soda/soda-util'

const estimateBlockByTime = async (
  timeMilliseconds: number[],
  scanHost: string
) => {
  let now = Math.floor(Date.now() / 1000)
  const url1 = `https://${scanHost}/api?module=block&action=getblocknobytime&timestamp=${now}&closest=before`
  const res1 = await httpRequest({ url: url1 })
  const block = Number(res1.result)
  const url2 = `https://${scanHost}/api?module=block&action=getblockcountdown&blockno=${
    block + 100
  }`
  const res2 = await httpRequest({ url: url2 })
  const timePerBlock =
    Number(res2.result.EstimateTimeInSec) / Number(res2.result.RemainingBlock)

  const res = []
  for (const time of timeMilliseconds) {
    // FIXME: shall call api to get direct block height in the past
    const estBlock =
      block + Math.ceil((Math.floor(time / 1000) - now) / timePerBlock)
    res.push[estBlock]
  }
  return res
}

const init = () => {
  registerChain({
    name: 'eth-mainnet',
    meta: {
      chainId: 1,
      rpc: 'https://mainnet.infura.io/v3/',
      symbol: 'ETH',
      explorer: 'https://etherscan.io',
      api: {
        estimateBlockByTime: async (params: { timeMilliseconds: number[] }) => {
          estimateBlockByTime(params.timeMilliseconds, 'api.etherscan.io')
        }
      }
    }
  })
  registerChain({
    name: 'eth-rinkeby',
    meta: {
      chainId: 4,
      rpc: 'https://rinkeby.infura.io/v3/',
      symbol: 'ETH',
      explorer: 'https://rinkeby.etherscan.io',
      api: {
        estimateBlockByTime: async (params: { timeMilliseconds: number[] }) => {
          estimateBlockByTime(
            params.timeMilliseconds,
            'api-rinkeby.etherscan.io'
          )
        }
      }
    }
  })
  registerChain({
    name: 'polygon-mumbai',
    meta: {
      chainId: 80001,
      rpc: 'https://rpc-mumbai.matic.today',
      symbol: 'MATIC',
      explorer: 'https://polygonscan.com/',
      api: {
        estimateBlockByTime: async (params: { timeMilliseconds: number[] }) => {
          estimateBlockByTime(
            params.timeMilliseconds,
            'api-testnet.polygonscan.com'
          )
        }
      }
    }
  })
}

export default init
