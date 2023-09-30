'use client'

import { useState } from 'react'
import { Message } from './actions'
import { configureAbly, useChannel, usePresence } from '@ably-labs/react-hooks'

configureAbly({
  authUrl: `${process.env.NEXT_PUBLIC_HOSTNAME}/api/createTokenRequest`,
})

interface ChatInterfaceProps {
  messages: Message[]
}

export const ChatInterface = ({
  messages: initialMessages = [],
}: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [presenceData] = usePresence('messages')
  console.log('presenceData', presenceData)

  const [, ably] = useChannel('messages', (message) => {
    console.log('message', message)
    setMessages((state) => [...state, message.data])
  })

  const presenceList = presenceData.map((member, index) => {
    const isMe = member.clientId === ably.auth.clientId

    return {
      key: index,
      clientId: member.clientId,
      isMe,
    }
  })

  console.log('messages', messages)
  return (
    <>
      <div className="chatBox">
        {messages?.map((msg) => <p key={msg.id}>{msg.content}</p>)}
      </div>

      <div>
        {presenceList.map((member) => (
          <li key={member.key}>
            <span>{member.clientId}</span>
            <span>{member.isMe ? '(me)' : ''}</span>
          </li>
        ))}
      </div>
    </>
  )
}
