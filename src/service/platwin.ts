import { createWeb3, getUserAccount } from '@soda/soda-util'
import Contracts from './config/contracts'
import RpcRouterAbi from './config/abis/RPCRouter.json'
import Meme2Abi from './config/abis/PlatwinMEME2.json'
import ERC20abi from './config/abis/ERC20.json'
import ERC721abi from './config/abis/ERC721.json'
import { AbiItem } from 'web3-utils'
import { getOrderByTokenId } from './apis'
import { serviceRequestAccounts } from '@soda/soda-util'

export const invokeERC721 = async (
  contract: string,
  method: string,
  readOnly: boolean,
  args: any[]
) => {
  try {
    const web3 = createWeb3()
    const erc721 = new web3.eth.Contract(ERC721abi.abi as AbiItem[], contract)
    if (readOnly) {
      const res = await erc721.methods[method](...args).call()
      return res
    } else {
      const account = await getUserAccount()
      return new Promise((resolve, reject) => {
        erc721.methods[method](...args)
          .send({ from: account })
          .on('receipt', function (receipt: any) {
            resolve(receipt)
          })
          .on('error', function (error: Error) {
            reject(error)
          })
      })
    }
  } catch (e) {
    console.error(e)
    return e
  }
}

export const mintToken = async (
  hash: string
): Promise<{ tokenId: string; account: string }> => {
  const web3 = createWeb3()
  const { accounts } = await serviceRequestAccounts()
  const account = accounts[0]
  const CHAIN_ID = await web3.eth.getChainId()
  const cashContract = new web3.eth.Contract(
    ERC20abi.abi as AbiItem[],
    Contracts.MockRPC[CHAIN_ID]
  )
  const meme2Contract = new web3.eth.Contract(
    Meme2Abi.abi as AbiItem[],
    Contracts.PlatwinMEME2WithoutRPC[CHAIN_ID]
  )
  const rpcRouter = new web3.eth.Contract(
    RpcRouterAbi.abi as AbiItem[],
    Contracts.RPCRouter[CHAIN_ID]
  )
  console.log('account ', account)
  // mint
  return new Promise((resolve, reject) => {
    meme2Contract.methods
      .mint(account, hash)
      .send({ from: account })
      .on('receipt', function (receipt: any) {
        let transferEvt = receipt.events.Transfer
        if (
          transferEvt.address === Contracts.PlatwinMEME2WithoutRPC[CHAIN_ID]
        ) {
          const tokenId = transferEvt.returnValues.tokenId
          console.log('++++++++++++++++++++', tokenId)
          resolve({ tokenId, account })
        }
      })
      .on('error', function (error: Error) {
        console.log('MintService error:', error)
        reject(error)
      })
  })
}

export const getOwner = async (tokenId: string) => {
  try {
    const web3 = createWeb3()
    const CHAIN_ID = await web3.eth.getChainId()
    const meme2Contract = new web3.eth.Contract(
      Meme2Abi.abi as AbiItem[],
      Contracts.PlatwinMEME2WithoutRPC[CHAIN_ID]
    )
    let owner = await meme2Contract.methods.ownerOf(tokenId).call()
    // on market
    if (owner === Contracts.MarketProxyWithoutRPC[CHAIN_ID]) {
      //TODO get order with tokenId, the seller is the owner
      const order = await getOrderByTokenId(tokenId)
      console.log('order: ', order)
      owner = order.seller
    }
    return owner
  } catch (e) {
    console.error(e)
    return ''
  }
}

export const getMinter = async (tokenId: string) => {
  try {
    const web3 = createWeb3()
    const CHAIN_ID = await web3.eth.getChainId()
    const meme2Contract = new web3.eth.Contract(
      Meme2Abi.abi as AbiItem[],
      Contracts.PlatwinMEME2WithoutRPC[CHAIN_ID]
    )
    const minter = await meme2Contract.methods.minter(tokenId).call()
    return minter
  } catch (e) {
    console.error(e)
    return ''
  }
}
