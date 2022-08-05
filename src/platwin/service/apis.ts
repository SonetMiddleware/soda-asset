import { AssetType, NFT } from '@/asset'
import {
  getChainId,
  httpRequest,
  API_HOST,
  getChainName
} from '@soda/soda-util'
// hard code for now

export const getOrderByTokenId = async (tokenId: string, status?: number) => {
  // nash market hook, backward compatible
  const url = `${API_HOST}/orders`
  const chain_name = await getChainName()
  const params = { token_id: tokenId, status, chain_name }
  try {
    const res = await httpRequest({ url, params })
    if (res.error) {
      console.error(res.error)
      return null
    }
    if (res.data && res.data.length === 1) {
      return res.data[0]
    }
  } catch (e) {
    console.error(e)
  }
  return null
}

// backward compatible
const DEFAULT_CHAINID = 80001
const DEFAULT_TOKENCONTRACT = '0x0daB724e3deC31e5EB0a000Aa8FfC42F1EC917C5'

export const toToken = (t: IOwnedNFTData, chainId?: number): NFT => {
  return {
    type: t.erc == '1155' ? AssetType.PFT : AssetType.NFT,
    balance: t.amount,
    // FIXME: shall return chainId
    chainId: chainId ? chainId : DEFAULT_CHAINID,
    contract: t.contract,
    tokenId: t.token_id,
    source: t.uri,
    owner: t.owner,
    meta: { type: 'image', storage: 'ipfs' }
  }
}

export interface IGetOwnedNFTParams {
  addr: string
  contract?: string
  token_id?: string
  page?: number
  gap?: number
  chain_name?: string
}
export interface IOwnedNFTData {
  // collection_id: ''; // collection id
  // collection_name: ''; // collection name
  contract: string // contract address
  erc: string // 1155 or 721
  token_id: string //
  amount: number //
  uri: string //
  owner: string //
  update_block: string //
}
export interface IOwnedNFTResp {
  total: number
  data: IOwnedNFTData[]
}
export const getOwnedNFT = async (
  params: IGetOwnedNFTParams
): Promise<IOwnedNFTResp> => {
  if (!params.addr) {
    return {
      total: 0,
      data: []
    }
  }
  const url = `${API_HOST}/nfts`
  const chain_name = await getChainName()
  params.chain_name = chain_name
  const res = await httpRequest({ url, params })
  console.debug('[asset-platwin] getOwnedNFT: ', params, res)
  // FIXME: handle error
  if (res.error) return { total: 0, data: [] }
  return res.data
}

export interface IGetCollectionListParams {
  addr: string
  page?: number
  gap?: number
  chain_name?: string
}
export interface ICollectionItem {
  id: string
  name: string
  img: string
  dao?: any
}
export interface IGetCollectionListResult {
  total: number
  data: ICollectionItem[]
}
export const getCollectionList = async (
  params: IGetCollectionListParams
): Promise<IGetCollectionListResult> => {
  const url = `${API_HOST}/collection-list`
  const chain_name = await getChainName()
  params.chain_name = chain_name
  const res = await httpRequest({ url, params })
  console.debug('[asset-platwin] getCollectionList: ', params, res)
  // FIXME: handle error
  if (res.error) return { total: 0, data: [] }
  return res.data
}

export interface IGetCollectionNFTListParams {
  collection_id: string
  addr?: string
  page?: number
  gap?: number
  chain_name?: string
}
export interface IGetCollectionNFTListResult {
  total: number
  collection_id: string // collection id
  collection_name: string // collection name
  collection_img: string // collection img
  data: IOwnedNFTData[]
}
export const getCollectionNFTList = async (
  params: IGetCollectionNFTListParams
): Promise<IGetCollectionNFTListResult> => {
  const url = `${API_HOST}/collection/nfts`
  const chain_name = await getChainName()
  params.chain_name = chain_name
  const res = await httpRequest({ url, params })
  console.debug('[asset-platwin] getCollectionNFTList: ', params, res)
  // FIXME: handle error
  if (res.error)
    return {
      total: 0,
      collection_id: '0x0000000000000000000000000000000000000000',
      collection_name: 'NA',
      collection_img: '',
      data: []
    }
  return res.data
}
