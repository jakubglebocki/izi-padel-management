'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        toast.error('Błąd logowania', {
          description: error.message,
        })
        return
      }

      if (data.user) {
        toast.success('Zalogowano pomyślnie!')
        router.push('/dashboard')
        router.refresh()
      }
    } catch (error) {
      toast.error('Wystąpił nieoczekiwany błąd')
    } finally {
      setLoading(false)
    }
  }

  const handleDemoLogin = async () => {
    setLoading(true)
    
    // Demo credentials dla trenera/admina
    const demoEmail = 'demo@izipadel.pl'
    const demoPassword = 'DemoTrener2024!'

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: demoEmail,
        password: demoPassword,
      })

      if (error) {
        toast.error('Błąd logowania Demo', {
          description: 'Konto demo nie jest jeszcze skonfigurowane. Użyj: ' + demoEmail,
        })
        return
      }

      if (data.user) {
        toast.success('Zalogowano jako Demo Trener! 🎾')
        router.push('/dashboard')
        router.refresh()
      }
    } catch (error) {
      toast.error('Wystąpił nieoczekiwany błąd')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
      <Card className="w-full max-w-md bg-slate-800/50 border-slate-700 backdrop-blur">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-4">
            <div className="text-4xl">🎾</div>
          </div>
          <CardTitle className="text-2xl text-center text-white">
            IZI Padel Management
          </CardTitle>
          <CardDescription className="text-center text-slate-400">
            Zaloguj się do swojego konta
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-200">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="twoj@email.pl"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-slate-200">
                  Hasło
                </Label>
                <Link
                  href="/reset-password"
                  className="text-sm text-blue-400 hover:text-blue-300"
                >
                  Zapomniałeś hasła?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-slate-700/50 border-slate-600 text-white"
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? 'Logowanie...' : 'Zaloguj się'}
            </Button>
            
            <div className="relative w-full">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-slate-600" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-slate-800/50 px-2 text-slate-400">
                  Lub
                </span>
              </div>
            </div>

            <Button
              type="button"
              onClick={handleDemoLogin}
              variant="outline"
              className="w-full border-emerald-600/50 bg-emerald-950/30 text-emerald-400 hover:bg-emerald-900/50 hover:text-emerald-300"
              disabled={loading}
            >
              🎾 Demo - Zaloguj jako Trener
            </Button>

            <p className="text-sm text-center text-slate-400">
              Nie masz konta?{' '}
              <Link
                href="/register"
                className="text-blue-400 hover:text-blue-300 font-medium"
              >
                Zarejestruj się
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

