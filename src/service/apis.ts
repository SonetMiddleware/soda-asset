import { httpRequest } from '@soda/soda-util'

const BACKEND_HOST = process.env.API_HOST

export const getOrderByTokenId = async (tokenId: string, status?: number) => {
  const url = `${BACKEND_HOST}/orders`
  const params = { token_id: tokenId, status }
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
