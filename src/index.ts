const _assetServices = {}

export type NFTInfo = {
  chainId?: number
  contract?: string
  tokenId: string
  source?: string
}

const getAssetServices = (svcs: string[]) => {
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
const registerAssetService = (svc: ServiceType) => {
  _assetServices[svc.name] = svc.meta
}

export { getAssetServices, registerAssetService }
export default getAssetServices

import PlatwinAssetInit from './platwin'
export { PlatwinAssetInit }
