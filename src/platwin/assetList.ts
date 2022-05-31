import { NFT } from '@/asset'
import { getChainId } from '@soda/soda-util'
import * as Api from './service/apis'

export const getOwnedTokens = async (params: {
  address: string
  chainId?: number
  contract?: string
  tokenId?: string
  offset?: number
  limit?: number
}): Promise<{
  total: number
  data: NFT[]
}> => {
  const { address, chainId: cid, contract, tokenId, offset, limit } = params
  let page: number
  if (offset && limit && limit > 0) page = Math.floor(offset / limit)
  const chainId = cid ? cid : await getChainId()
  const tokens = await Api.getOwnedNFT({
    addr: address,
    // TODO: add chain id
    contract,
    token_id: tokenId,
    page,
    gap: limit
  })
  const res = { total: tokens.total, data: [] }

  for (const t of tokens.data) {
    res.data.push(Api.toToken(t, cid))
  }
  return res
}
