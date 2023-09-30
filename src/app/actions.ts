'use server'

import Ably from 'ably/promises'
import { getClient } from '@/lib/redis'
import { z } from 'zod'
// import { supabase } from '@/lib/supabase'
import { Database } from '@/lib/database.types'
import { createServerActionClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { currentUser } from '@clerk/nextjs'
import type { User } from '@clerk/nextjs/api'
import { PrismaClient } from '@prisma/client'

const ably = new Ably.Rest(process.env.ABLY_SERVER_API_KEY)
const channel = ably.channels.get('messages')

const prisma = new PrismaClient()

export const getPolls = async () => {
  const user: User | null = await currentUser()
  console.log('userId', user)

  const data = await prisma.polls.findMany({
    include: {
      _count: {
        select: { questions: true },
      },
    },
  })

  return data || []
}

export type Message = Database['public']['Tables']['messages']['Row']

export const getMessages = async () => {
  const supabase = createServerActionClient<Database>({ cookies })
  const session = await supabase.auth.getSession()
  // console.log('supabase', supabase)
  console.log('session', session.data.session?.user)

  const { data, error } = await supabase
    .from('messages')
    .select('id, content, created_at')

  console.log('data', data)
  console.log('error', error)

  return data || []
}

const formSchema = z.object({
  message: z.string(),
})

export const myAction = async (formData: FormData): Promise<void> => {
  const parsed = formSchema.parse({
    message: formData.get('message'),
  })
  const supabase = createServerActionClient<Database>({ cookies })
  const {
    data: { session },
  } = await supabase.auth.getSession()

  const { data, error } = await supabase
    .from('messages')
    .insert([{ content: parsed.message, created_by: session?.user.id }])
    .select()

  console.log('error', error)

  if (data) {
    channel.publish('new-message', data[0])
  }
}

const validateRequest = (req) => {
  // Validation logic here
  const isValid = true

  return isValid
}

export const sendMessage = async (messageDetails) => {
  if (!validateRequest(messageDetails)) {
    throw new Error('Invalid request data')
  }

  const client = await getClient()
  const messagesCollection = client.db('chatDB').collection('messages')
  await messagesCollection.insertOne(messageDetails)
  // Inform other users via WebSocket or similar
}

export const receiveMessage = async () => {
  // Logic to receive a message in real-time
  // Return the message details
}

export const getRecentMessages = async (chatId: string) => {
  // Logic to fetch recent messages for the user
  // Retrieve messages from the database
  const client = await getClient()
  const data = await client.get(`chat:${chatId}`)

  if (!data) {
    return []
  }

  const messages = JSON.parse(data) as Record<string, Message>

  return Object.values(messages)
}
