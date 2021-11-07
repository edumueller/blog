import { Suspense } from "react"
import { Head, Link, useRouter, useQuery, useParam, BlitzPage, useMutation, Routes } from "blitz"
import Layout from "app/core/layouts/Layout"
import getPost from "app/posts/queries/getPost"
import deletePost from "app/posts/mutations/deletePost"
import createComment from "app/comments/mutations/createComment"
import deleteComment from "app/comments/mutations/deleteComment"
import { CommentForm, FORM_ERROR } from "app/comments/components/CommentForm"

export const Post = () => {
  const router = useRouter()
  const postId = useParam("postId", "number")
  const [createCommentMutation] = useMutation(createComment)
  const [deletePostMutation] = useMutation(deletePost)
  const [deleteCommentMutation] = useMutation(deleteComment)
  const [post, { refetch }] = useQuery(getPost, { id: postId })

  return (
    <>
      <Head>
        <title>Post {post.id}</title>
      </Head>

      <div>
        <h1>{post.text}</h1>

        <Link href={Routes.EditPostPage({ postId: post.id })}>
          <a>Edit</a>
        </Link>

        <button
          type="button"
          onClick={async () => {
            if (window.confirm("This will be deleted")) {
              await deletePostMutation({ id: post.id })
              router.push(Routes.PostsPage())
            }
          }}
          style={{ marginLeft: "0.5rem" }}
        >
          Delete
        </button>

        <h3>Comments</h3>
        <ul>
          {post.comments.map((comment) => (
            <li key={comment.id}>
              {comment.text} - {comment.votes} votes
              <span style={{ marginLeft: "1rem" }}>
                <Link href={Routes.EditCommentPage({ commentId: comment.id })}>
                  <a>Edit</a>
                </Link>
                <button
                  type="button"
                  onClick={async () => {
                    if (window.confirm("This will be deleted")) {
                      await deleteCommentMutation({ id: comment.id })
                      router.push(Routes.ShowPostPage({ postId: post.id }))
                    }
                  }}
                  style={{ marginLeft: "0.5rem" }}
                >
                  Delete
                </button>
              </span>
            </li>
          ))}
        </ul>
        <CommentForm
          submitText="Add Comment"
          onSubmit={async (values) => {
            try {
              await createCommentMutation({
                ...values,
                postId: post.id,
              })
              refetch()
              values.text = ""
            } catch (error: any) {
              console.error(error)
              return {
                [FORM_ERROR]: error.toString(),
              }
            }
          }}
        />
      </div>
    </>
  )
}

const ShowPostPage: BlitzPage = () => {
  return (
    <div>
      <p>
        <Link href={Routes.PostsPage()}>
          <a>Posts</a>
        </Link>
      </p>

      <Suspense fallback={<div>Loading...</div>}>
        <Post />
      </Suspense>
    </div>
  )
}

ShowPostPage.authenticate = true
ShowPostPage.getLayout = (page) => <Layout>{page}</Layout>

export default ShowPostPage
