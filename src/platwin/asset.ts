import {
  sendMessage,
  registerMessage,
  isMetamaskConnected,
  getChainId
} from '@soda/soda-util'
import * as Platwin from './service/platwin'
import { TokenCache, AssetType, NFT, Function } from '../asset'

const MessageTypes = {
  InvokeERC721Contract: 'InvokeERC721Contract',
  Mint_Token: 'Mint_Token',
  Get_Owner: 'Get_Owner',
  Get_Minter: 'Get_Minter'
}

const DEFAULT_CHAINID = 80001
const DEFAULT_CONTRACT = '0x0daB724e3deC31e5EB0a000Aa8FfC42F1EC917C5'

export const getAssetInfo = async (
  meta: TokenCache,
  paymentMeta?: any
): Promise<NFT> => {
  const { chainId: cid, contract: c, tokenId, source: src } = meta
  // hard code
  const chainId = cid ? Number(cid) : Number(DEFAULT_CHAINID)
  // if (!actions[chainId] || !actions[chainId].includes(Function.getAssetInfo))
  //   throw new Error('Invalid action getAssetInfo from chainId: ' + chainId)
  const contract = c ? c : DEFAULT_CONTRACT
  const token: NFT = {
    type: AssetType.NFT,
    chainId,
    contract,
    tokenId,
    meta: {
      type: 'image',
      storage: 'ipfs'
    }
  }
  if (src) {
    //v1
    token.source = src
    return token
  }

  const res: any = await invokeERC721({
    contract: contract,
    method: 'tokenURI',
    readOnly: true,
    args: [tokenId]
  })
  if (res.error) {
    // throw new Error('Error fetch token info: ' + res)
  } else {
    token.source = res.result
  }
  return token
}

export const getBalance = async (meta: {
  cache: TokenCache
  address: string
}): Promise<number> => {
  const { cache, address } = meta
  const chainId = cache.chainId
  // if (!actions[chainId] || !actions[chainId].includes(Function.getBalance))
  //   throw new Error('Invalid action getBalance for chainId: ' + chainId)
  const res: any = await invokeERC721({
    contract: cache.contract,
    method: 'balanceOf',
    readOnly: true,
    args: [address]
  })
  if (res.error) throw new Error('Error fetch token balance: ' + res)
  const balance = res.result
  return Number(balance)
}

const invokeERC721 = async (request: any) => {
  const response: any = {}
  try {
    const res: any = await sendMessage({
      type: MessageTypes.InvokeERC721Contract,
      request
    })
    return res
  } catch (e) {
    console.error(e)
    response.error = (e as any).message || e
  }
  return response
}
async function ERC721MessageHandler(request: any) {
  const response: any = {}
  if (!isMetamaskConnected()) {
    response.error = 'Metamask not connected'
    return JSON.stringify(response)
  }
  try {
    const { contract, method, readOnly, args } = request
    const res = await Platwin.invokeERC721(contract, method, readOnly, args)
    response.result = res
  } catch (e) {
    console.error(e)
    response.error = (e as any).message || e
  }
  return response
}

export const mint = async (
  cache: TokenCache,
  paymentMeta?: any
): Promise<NFT> => {
  const { chainId, contract, source } = cache
  const cid = chainId ? chainId : await getChainId()
  // if (!actions[cid] || !actions[cid].includes(Function.mint))
  //   throw new Error('Invalid action mint for chainId: ' + cid)
  const c = contract ? contract : DEFAULT_CONTRACT
  const res: any = await sendMessage({
    type: MessageTypes.Mint_Token,
    request: {
      chainId: cid,
      contract: c,
      hash: source
    }
  })
  if (res.error) throw new Error('Error to mint token: ' + res)
  return res.result
}

async function mintTokenMessageHandler(request: any) {
  const response: any = {}
  if (!isMetamaskConnected()) {
    response.error = 'Metamask not connected'
    return JSON.stringify(response)
  }
  try {
    const { chainId, contract, hash } = request
    // TODO: apply to fit for chains and contracts
    const res = await Platwin.mintToken(hash)
    response.result = {
      type: AssetType.NFT,
      chainId: DEFAULT_CHAINID,
      contract: DEFAULT_CONTRACT,
      tokenId: res.tokenId,
      minter: res.account,
      owner: res.account,
      source: hash,
      meta: {
        type: 'image',
        storage: 'ipfs'
      }
    }
  } catch (e) {
    console.error(e)
    response.error = (e as any).message || e
  }
  return response
}

const getOwner = async (token: NFT) => {
  const res: any = await sendMessage({
    type: MessageTypes.Get_Owner,
    request: {
      token
    }
  })
  // if (res.error) throw new Error('Error to get token owner: ' + res)
  const owner = res.error ? '' : res.result
  return owner
}

async function getOwnerMessageHandler(request: any) {
  const response: any = {}
  if (!isMetamaskConnected()) {
    response.error = 'Metamask not connected'
    return JSON.stringify(response)
  }
  try {
    const { token } = request
    // TODO: apply to fit for chains and contracts
    const owner = await Platwin.getOwner(token.tokenId)
    response.result = owner
  } catch (e) {
    console.error(e)
    response.error = (e as any).message || e
  }
  return response
}

const getMinter = async (token: NFT) => {
  const res: any = await sendMessage({
    type: MessageTypes.Get_Minter,
    request: {
      token
    }
  })
  // if (res.error) throw new Error('Error to get token minter: ' + res)
  const minter = res.error ? '' : res.result
  return minter
}

async function getMinterMessageHandler(request: any) {
  const response: any = {}
  if (!isMetamaskConnected()) {
    response.error = 'Metamask not connected'
    return JSON.stringify(response)
  }
  try {
    const { token } = request
    // TODO: apply to fit for chains and contracts
    const minter = await Platwin.getMinter(token.tokenId)
    response.result = minter
  } catch (e) {
    console.error(e)
    response.error = (e as any).message || e
  }
  return response
}

export const getRole = async (
  token: NFT,
  paymentMeta?: any
): Promise<{ owner?: string; minter?: string }> => {
  const chainId = token.chainId
  // if (!actions[chainId] || !actions[chainId].includes(Function.getRole))
  //   throw new Error('Invalid action getRole for chainId: ' + chainId)
  const owner = await getOwner(token)
  const minter = await getMinter(token)
  return { owner, minter }
}

export const bgInit = () => {
  registerMessage({
    message: MessageTypes.InvokeERC721Contract,
    handleFunc: ERC721MessageHandler
  })
  registerMessage({
    message: MessageTypes.Mint_Token,
    handleFunc: mintTokenMessageHandler
  })
  registerMessage({
    message: MessageTypes.Get_Owner,
    handleFunc: getOwnerMessageHandler
  })
  registerMessage({
    message: MessageTypes.Get_Minter,
    handleFunc: getMinterMessageHandler
  })
}
