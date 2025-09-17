import { useEffect, useRef } from 'react'

interface GoogleSignInProps {
  onClick?: () => void
  theme?: 'outline' | 'filled_blue' | 'filled_black'
  size?: 'large' | 'medium' | 'small'
}

export default function GoogleSignIn({ onClick, theme = 'filled_blue', size = 'large' }: GoogleSignInProps) {
  const btnRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const google = (window as any).google?.accounts?.id
    const clientId = (document.querySelector('meta[name="google-signin-client_id"]') as HTMLMetaElement | null)?.content
    if (!google || !clientId || !btnRef.current) return

    google.initialize({ client_id: clientId, callback: onClick || (() => {}), ux_mode: 'popup' })
    google.renderButton(btnRef.current, { theme, size, type: 'standard', shape: 'pill', logo_alignment: 'left' })
  }, [onClick, theme, size])

  return <div ref={btnRef} />
}


