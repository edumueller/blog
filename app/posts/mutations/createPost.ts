import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

const CreatePost = z.object({
  text: z.string(),
})

export default resolver.pipe(resolver.zod(CreatePost), resolver.authorize(), async (input) => {
  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  const post = await db.post.create({ data: input })

  return post
})

export const createPostSchema = CreatePost
