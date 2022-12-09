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

export default withApiAuth<Database>(async (req, res, supabase) => {
  const { data: {user} } = await supabase.auth.getUser()
  switch (req.method) {
    // case 'GET':
    //   let { data, error } = await supa
    //     .from('favorites')
    //     .select('name, type') 
    //     .eq('user_id', user!.id) 
    //   if (error) return res.writeHead(500, String(error))
    //   data = data || []
    //   return res.json(data)

    case 'POST':
      const {name} = JSON.parse(req.body)
      if (!name) return res.writeHead(422, "Missing 'name'").end()
      const favorites = supabase.from('favorites')
      const {data} = await favorites.select('*')
        .eq('user_id', user!.id)
        .eq('name', name)
      if (data?.length) {
        await favorites.delete()
          .eq('user_id', user!.id)
          .eq('name', name)
      } else {
        await favorites.insert({
          'user_id': user!.id,
          'name': name
        })
      }
      return res.status(201).end()

    default:
      res.writeHead(500, 'Unimplemented').end()
  }
})