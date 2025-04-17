'use client'

import { MessageTable } from '@/app/use-optimistic/components/MessageTable'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { sleep } from '@/lib/utils'
import { useOptimistic, useRef, useState } from 'react'
import { useFormStatus } from 'react-dom'
import { v4 as uuid } from 'uuid'

export type Message = {
  id: string
  text: string
  sending: boolean
}

// Example of useFormStatus hook in React 19
const SubmitButton = () => {
  const status = useFormStatus()
  return (
    <Button type="submit" className="w-full" disabled={status.pending}>
      {status.pending ? 'Sending...' : 'Send'}
    </Button>
  )
}

export default function Page() {
  const formRef = useRef<HTMLFormElement>(null)

  const [messages, setMessages] = useState<Message[]>([
    { text: 'Hello there!', sending: false, id: uuid() },
  ])

  const [optimisticMessages, addOptimisticMessage] = useOptimistic(
    messages,
    (state, message: string) => [
      // This is where we create are optimistic message and assign random ID as placeholder in UI
      {
        text: message,
        sending: true,
        id: uuid(),
      },
      ...state,
    ]
  )

  async function formAction(formData: FormData) {
    const message = formData.get('message')?.toString() ?? ''
    formRef.current?.reset()

    // add optimistic message to the optimisticMessages before any API request
    addOptimisticMessage(message)

    // perform the API request
    const newMessage = await apiRequest(message)
    // set new state based on API response
    setMessages((prev) => [newMessage, ...prev])
  }

  return (
    <>
      <h1 className="mb-6 font-semibold text-xl">
        Optimistic Update with useOptimistic
      </h1>
      <div className="grid grid-cols-2 gap-8">
        <form action={formAction} ref={formRef} className="space-y-2 w-full">
          <Input
            name="message"
            autoComplete="off"
            placeholder="Type message..."
          />
          <SubmitButton />
        </form>

        {/* Pass optimistic messages array */}
        <MessageTable messages={optimisticMessages} />
      </div>
    </>
  )
}

// Mock server API request
async function apiRequest(message: string): Promise<Message> {
  await sleep(1500)
  return {
    id: uuid(),
    text: message,
    sending: false,
  }
}
