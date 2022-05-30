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
  getRole: 'getRole'
}

export type Token = {
  type: AssetType
  chainId: number
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
export const cacheToNFT = (cache: TokenCache): NFT => {
  const { chainId, contract, tokenId, source } = cache
  return {
    type: AssetType.NFT,
    chainId,
    contract,
    balance: 1,
    tokenId,
    source
  }
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
export const getAssetServiceActions = (
  service: string,
  chainId: number
): string[] => {
  if (!_assetServices[service]) {
    throw new Error('Service not found.')
  }
  return _assetServices[service].getActions()
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
