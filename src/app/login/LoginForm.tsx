'use client'

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import type { Session } from '@supabase/auth-helpers-nextjs'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export default function LoginForm({ session }: { session: Session | null }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()
  const supabase = createClientComponentClient()

  const handleSignUp = async () => {
    await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${location.origin}/auth/callback`,
      },
    })
    router.refresh()
  }

  const handleSignIn = async () => {
    await supabase.auth.signInWithPassword({
      email,
      password,
    })
    router.refresh()
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.refresh()
  }

  // for the `session` to be available on first SSR render, it must be
  // fetched in a Server Component and passed down as a prop
  return session ? (
    <button onClick={handleSignOut}>Sign out</button>
  ) : (
    <>
      <Input
        name="email"
        onChange={(e) => setEmail(e.target.value)}
        value={email}
      />
      <Input
        type="password"
        name="password"
        onChange={(e) => setPassword(e.target.value)}
        value={password}
      />
      <Button onClick={handleSignUp}>Sign up</Button>
      <Button onClick={handleSignIn}>Sign in</Button>
    </>
  )
}
