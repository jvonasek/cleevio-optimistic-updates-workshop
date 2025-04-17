import { Post } from '@/app/rq-optimistic/page'
import { sleep } from '@/lib/utils'

const POSTS_CACHE: Map<number, Post> = new Map()

export async function createPost(title: string): Promise<Post> {
  await sleep(1500)
  const res = await fetch('https://jsonplaceholder.typicode.com/posts', {
    method: 'POST',
    body: JSON.stringify({
      title,
      body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      userId: 1,
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (title.includes('error')) {
    throw new Error('Network response was not ok')
  }

  const post = (await res.json()) as unknown as Post
  const newPost = {
    ...post,
    id: post.id + POSTS_CACHE.size,
  }
  POSTS_CACHE.set(newPost.id, newPost)
  return newPost
}

export async function removePost(id: number): Promise<void> {
  await sleep(1000)
  // Simulate a network error if the ID is less than or equal to 100
  if (id <= 100) {
    throw new Error('Network response was not ok')
  }
  POSTS_CACHE.delete(id)
}

export async function fetchPosts() {
  const res = await fetch('https://jsonplaceholder.typicode.com/posts')
  if (!res.ok) {
    throw new Error('Network response was not ok')
  }
  const posts = (await res.json()) as unknown as Post[]
  const cachedPosts = Array.from(POSTS_CACHE.values())
  return [
    ...cachedPosts.sort((a, b) => b.id - a.id),
    ...posts.slice().reverse(),
  ]
}
