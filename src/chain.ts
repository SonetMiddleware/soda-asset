import { registerChain } from './asset'
import { httpRequest, invokeWeb3Api } from '@soda/soda-util'

const estimateBlockByTime = async (
  timeMilliseconds: number[],
  scanHost: string,
  apikey?: string
) => {
  const blockRes: any = await invokeWeb3Api({
    module: 'eth',
    method: 'getBlockNumber'
  })
  const { result: currentBlockHeight } = blockRes
  let now = Math.floor(Date.now() / 1000)
  const url = `https://${scanHost}/api`
  const params = {
    module: 'block',
    action: 'getblockcountdown',
    blockno: currentBlockHeight + 100,
    apikey
  }
  const resp = await httpRequest({ url, params })
  const timePerBlock =
    Number(resp.result.EstimateTimeInSec) / Number(resp.result.RemainingBlock)

  const res = []
  for (const time of timeMilliseconds) {
    // FIXME: shall call api to get direct block height in the past
    const estBlock =
      currentBlockHeight +
      Math.ceil((Math.floor(time / 1000) - now) / timePerBlock)
    res.push(estBlock)
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
        estimateBlockByTime: async (params: { timeMilliseconds: number[] }) =>
          estimateBlockByTime(
            params.timeMilliseconds,
            'api.etherscan.io',
            'XQC3E447KF4EHSXC1IMC2M6IN4B947JA4I'
          )
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
        estimateBlockByTime: async (params: { timeMilliseconds: number[] }) =>
          estimateBlockByTime(
            params.timeMilliseconds,
            'api-rinkeby.etherscan.io'
          )
      }
    }
  })
  registerChain({
    name: 'polygon',
    meta: {
      chainId: 137,
      rpc: 'https://polygon-rpc.com',
      symbol: 'MATIC',
      explorer: 'https://polygonscan.com/',
      api: {
        estimateBlockByTime: async (params: { timeMilliseconds: number[] }) =>
          estimateBlockByTime(
            params.timeMilliseconds,
            'api-testnet.polygonscan.com',
            '588TW5DBXGV5DXNR1S4YXK1RV6F88SWYPS'
          )
      }
    }
  })
  registerChain({
    name: 'polygon-mumbai',
    meta: {
      chainId: 80001,
      rpc: 'https://rpc-mumbai.matic.today',
      symbol: 'MATIC',
      explorer: 'https://mumbai.polygonscan.com/',
      api: {
        estimateBlockByTime: async (params: { timeMilliseconds: number[] }) =>
          estimateBlockByTime(
            params.timeMilliseconds,
            'api-testnet.polygonscan.com'
          )
      }
    }
  })
}

export default init
