import { registerAssetService, NFTInfo } from './index'
import { MessageTypes, sendMessage } from '@soda/soda-core'
const retrieveCollections = () => {}

const retrieveAssets = () => {}

const getNFT = async (metaData: NFTInfo) => {
  const DEFAULT_CHAINID = 80001
  const DEFAULT_CONTRACT = '0x0daB724e3deC31e5EB0a000Aa8FfC42F1EC917C5'
  if (metaData.source) {
    //v1
    return {
      ...metaData,
      chainId: Number(DEFAULT_CHAINID),
      contract: DEFAULT_CONTRACT,
      type: 'image',
      storage: 'ipfs'
    }
  }
  const req = {
    type: MessageTypes.InvokeERC721Contract,
    request: {
      contract: metaData.contract,
      method: 'tokenURI',
      readOnly: true,
      args: [metaData.tokenId]
    }
  }
  const res: any = await sendMessage(req)
  console.log('InvokeERC721Contract: ', res)
  let source = res.result
  return {
    chainId: Number(metaData.chainId),
    contract: metaData.contract,
    tokenId: metaData.tokenId,
    source,
    type: 'image',
    storage: 'ipfs'
  }
}

const init = () => {
  registerAssetService({
    name: 'platwin',
    meta: {
      retrieveAssets,
      retrieveCollections,
      getNFTFunc: getNFT
    }
  })
}

export default init
