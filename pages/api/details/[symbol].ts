// import type { NextApiHandler } from 'next'
// import { symbolData } from '../../../utils/server'
// import { queryOr } from '../../../utils/common'


// export interface Details extends Record<DatapointKeys, number[]> {
//   Date: string[]
// }
// const _: NextApiHandler<Details> = async (req, res) => {
//   if (req.method !== 'GET') {
//     return res.writeHead(400, 'Non-GET request.').end()
//   }
//   const symbol = queryOr(req.query.symbol)
//   if (!symbol) {
//     return res.writeHead(401, 'Symbol is required.').end()
//   }
//   const data = await symbolData(symbol)
//   return res.json(data.toObject() as any)
// }

// export default _