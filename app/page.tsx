import Link from 'next/link'

export default function Home() {
  return (
    <div>
      <h1 className="mb-6 font-semibold text-xl">
        Cleevio Optimistic Update Workshop
      </h1>
      <div className="flex gap-4">
        <Link
          className="rounded-full border border-solid font-medium py-4 px-6"
          href="/use-optimistic"
        >
          Optimistic Update with useOptimistic
        </Link>
        <Link
          className="rounded-full border border-solid font-medium p-4 px-6"
          href="/rq-optimistic"
        >
          Optimistic Update with @tanstack/react-query
        </Link>
      </div>
    </div>
  )
}
