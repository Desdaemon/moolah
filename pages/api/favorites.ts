import { withApiAuth } from "@supabase/auth-helpers-nextjs"
import { Database } from "../../utils/database.types";

export const enum FavoriteType {
  stock,
  crypto
}

export type Favorites = {
  name: string,
  type: FavoriteType | null
}[]

export default withApiAuth<Database, 'public', Favorites>(async (req, res, supa) => {
  const { data: {user} } = await supa.auth.getUser()
  switch (req.method) {
    case 'GET':
      let { data, error } = await supa
        .from('favorites')
        .select('name, type') 
        .eq('user_id', user!.id) 
      if (error) return res.writeHead(500, String(error))
      data = data || []
      return res.json(data)

    case 'POST':
      console.log({ body: req.body })
      return res.status(201).end()

    default:
      res.writeHead(500, 'Unimplemented').end()
  }
})