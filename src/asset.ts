const _assetServices = {}

export enum AssetType {
  FT,
  PFT,
  NFT,
  Other
}

export const Function = {
  getAssetInfo: 'getAssetInfo',
  getBalance: 'getBalance',
  mint: 'mint',
  getRole: 'getRole',
  getOwnedTokens: 'getOwnedTokens',
  getCollectionList: 'getCollectionList',
  getCollectionTokenList: 'getCollectionTokenList'
}

export type Token = {
  type: AssetType
  chainId?: number
  contract: string
  balance?: number
}
export interface NFT extends Token {
  tokenId?: string
  source?: string
  owner?: string
  minter?: string
  meta?: any
}

export type TokenCache = {
  chainId?: number
  contract?: string
  tokenId?: string
  source?: string
}

export interface Collection {
  id: string
  name: string
  image?: string
}

export const getAssetServices = (svcs?: string[]) => {
  if (!svcs || svcs.length === 0) return _assetServices

  const ret = {}
  for (const key of svcs) {
    ret[key] = _assetServices[key] || null
  }

  return ret
}

export const getAssetService = (svc: string) => {
  return _assetServices[svc]
}

export type ServiceType = {
  name: string
  meta: any
}
export const registerAssetService = (svc: ServiceType) => {
  _assetServices[svc.name] = svc.meta
}

export const getAssetServiceCapability = (
  service: string,
  meta: {
    action?: string
    chainId?: number
  }
) => {
  if (!_assetServices[service]) {
    throw new Error('Service not found.')
  }
  if (!_assetServices[service].getCapability) {
    throw new Error('Function "getCapability" not found.')
  }
  const { action, chainId } = meta
  try {
    const caps = _assetServices[service].getCapability()
    if (chainId && caps[chainId])
      return action ? caps[chainId].includes(action) : caps[chainId]
    const res = []
    for (const cid of Object.keys(caps)) {
      for (const fName of caps[cid]) {
        if (!res.includes(fName)) res.push(fName)
      }
    }
    return action ? res.includes(action) : res
  } catch (e) {
    throw e
  }
}

export const invoke = async (
  service: string,
  func: string,
  meta?: any,
  paymentMeta?: any
) => {
  if (!_assetServices[service]) {
    throw new Error('Service not found.')
  }
  if (!_assetServices[service][func]) {
    throw new Error('Function not found.')
  }
  try {
    const res = await _assetServices[service][func](meta, paymentMeta)
    return res
  } catch (e) {
    throw e
  }
}

const _chains = {}

export type ChainInfo = {
  chainId: number
  rpc: string
  symbol: string
  explorer?: string
  api?: any
}

export const getChains = (cs?: string[]) => {
  if (!cs || cs.length === 0) return _chains

  const ret = {}
  for (const key of cs) {
    ret[key] = _chains[key] || null
  }

  return ret
}

export const getChain = (c: string) => {
  return _chains[c]
}

export type ChainType = {
  name: string
  meta: ChainInfo
}
export const registerChain = (c: ChainType) => {
  _chains[c.name] = c.meta
}
export const invokeChainApi = async (
  chain: string,
  func: string,
  meta?: any
) => {
  if (!_chains[chain]) {
    throw new Error('Chain not found.')
  }
  if (!_chains[chain].api || !_chains[chain].api[func]) {
    throw new Error('Api function not found.')
  }
  try {
    const res = await _chains[chain].api[func](meta)
    return res
  } catch (e) {
    throw e
  }
}
