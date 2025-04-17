'use client'
import { createPost, fetchPosts } from '@/app/rq-optimistic/actions'
import { PostsTable } from '@/app/rq-optimistic/components/PostsTable'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  QueryKey,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import { useRef } from 'react'
import { toast } from 'sonner'

export type Post = {
  userId: number
  id: number
  title: string
  body: string
}

export type Message = {
  id: string
  text: string
  sending: boolean
}

const QUERY_KEYS: Record<string, QueryKey> = {
  posts: ['posts'],
}

export default function Page() {
  const queryClient = useQueryClient()
  const formRef = useRef<HTMLFormElement>(null)

  const { data: posts = [] } = useQuery({
    queryKey: ['posts'],
    queryFn: fetchPosts,
  })

  const { mutate: create, isPending } = useMutation({
    mutationFn: createPost,

    onMutate: (title) => {
      // cancel any outgoing refetches to avoid race conditions
      queryClient.cancelQueries({ queryKey: QUERY_KEYS.posts })

      // Snapshot the previous posts
      const previousPosts =
        queryClient.getQueryData<Post[]>(QUERY_KEYS.posts) || []

      // Create our optimistic post with random ID
      const optimisticPost: Post = {
        userId: 1,
        id: previousPosts.length + Math.floor(Math.random() * 99) + 1,
        title: title,
        body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      }

      // Optimistically update the query cache with the new post
      queryClient.setQueryData<Post[]>(QUERY_KEYS.posts, (previousPosts) => {
        return [optimisticPost, ...(previousPosts ?? [])]
      })

      // Return a context object with the snapshotted value
      return { previousPosts }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.posts })
    },
    onError: (_error, title, context) => {
      // Revert back to previous value in case of error
      queryClient.setQueryData<Post[]>(
        QUERY_KEYS.posts,
        context?.previousPosts ?? []
      )

      toast(<p className="text-red-500">Error creating post: {title}</p>)
    },
  })

  async function formAction(formData: FormData) {
    const message = formData.get('message')?.toString() ?? ''
    create(message)
  }

  return (
    <>
      <h1 className="mb-6 font-semibold text-xl">
        Optimistic Update with @tanstack/react-query
      </h1>
      <div className="grid grid-cols-2 gap-8">
        <form action={formAction} ref={formRef} className="space-y-2 w-full">
          <Input
            name="message"
            autoComplete="off"
            placeholder="Type title..."
          />
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? 'Sending...' : 'Send'}
          </Button>
          <p className="text-slate-600 text-xs">
            Hint: prefixing message with{' '}
            <span className="font-bold">error</span> will simulate request error
          </p>
        </form>
        <PostsTable posts={posts} />
      </div>
    </>
  )
}
