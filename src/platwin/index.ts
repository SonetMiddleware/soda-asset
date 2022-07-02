import { bgInit } from './asset'
export { bgInit }

import { Function, registerAssetService } from '../asset'
import { getAssetInfo, getBalance, mint, getRole } from './asset'
import { getOwnedTokens } from './assetList'
import { getCollectionList, getCollectionTokenList } from './collection'

const actions = {
  1: [
    Function.getAssetInfo,
    Function.getBalance,
    Function.getRole,
    Function.getOwnedTokens,
    Function.getCollectionList,
    Function.getCollectionTokenList
  ],
  4: [
    Function.getAssetInfo,
    Function.getBalance,
    Function.getRole,
    Function.getOwnedTokens,
    Function.getCollectionList,
    Function.getCollectionTokenList
  ],
  137: [
    Function.getAssetInfo,
    Function.getBalance,
    Function.getRole,
    Function.getOwnedTokens,
    Function.getCollectionList,
    Function.getCollectionTokenList
  ],
  80001: [
    Function.getAssetInfo,
    Function.getBalance,
    Function.mint,
    Function.getRole,
    Function.getOwnedTokens,
    Function.getCollectionList,
    Function.getCollectionTokenList
  ]
}

const getCapability = () => {
  return actions
}

const init = () => {
  const serviceName = 'platwin'
  registerAssetService({
    name: serviceName,
    meta: {
      getCapability,
      getAssetInfo,
      getBalance,
      mint,
      getRole,
      getOwnedTokens,
      getCollectionList,
      getCollectionTokenList
    }
  })
}

export default init
