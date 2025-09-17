import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { useAuth } from '../contexts/AuthContext'
import { SignIn } from './auth/SignIn'
import { SignUp } from './auth/SignUp'

export function Profile() {
  const { isAuthenticated, user, signOut } = useAuth()
  const [showSignUp, setShowSignUp] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [location, setLocation] = useState('')

  const handleSave = () => {
    // In a real app, persist to backend or local storage
    // For now, just log to console
    // eslint-disable-next-line no-console
    console.log({ name, email, location })
  }

  if (!isAuthenticated) {
    return (
      <div className="   inset-0 z-50  bg-black/50 flex items-start justify-end p-2">
        {showSignUp ? (
          <SignUp onSwitch={() => setShowSignUp(false)} />
        ) : (
          <SignIn onSwitch={() => setShowSignUp(true)} />
        )}
      </div>
    )
  }

  return (
    <div className="max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>User Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Name</label>
            <Input value={name || user?.name || ''} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <Input type="email" value={email || user?.email || ''} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Location</label>
            <Input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="City, Country" />
          </div>
          <div className="pt-2 flex gap-2">
            <Button onClick={handleSave}>Save</Button>
            <Button variant="outline" onClick={signOut}>Sign out</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}


