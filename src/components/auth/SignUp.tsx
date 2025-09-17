import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { useAuth } from '../../contexts/AuthContext'

export function SignUp({ onSwitch }: { onSwitch?: () => void }) {
  const { signIn, signUpWithEmail } = useAuth()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  return (
    <div className="min-h-[calc(100vh-64px)]   flex items-center justify-center">
      <Card className="w-full max-w-xs">
        <CardHeader className="py-3">
          <CardTitle>Create account</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 py-3">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
          </div>
          <Button
            className="w-full"
            type="button"
            onClick={async () => {
              const res = await signUpWithEmail(name, email, password)
              if (!res.ok) alert(res.error)
            }}
          >
            Create account
          </Button>
          <div className="relative py-1">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="bg-card px-2 text-muted-foreground">or</span></div>
          </div>
          <Button type="button" variant="outline" className="w-full" onClick={signIn}>
            Continue with Google
          </Button>
          {onSwitch && (
            <p className="text-sm text-center text-muted-foreground">
              Already have an account?{' '}
              <button className="underline" onClick={onSwitch}>Sign in</button>
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}


