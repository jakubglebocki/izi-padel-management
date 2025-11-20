'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import { ArrowLeft } from 'lucide-react'

export default function ResetPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const supabase = createClient()

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/update-password`,
      })

      if (error) {
        toast.error('Błąd resetowania hasła', {
          description: error.message,
        })
        return
      }

      setSent(true)
      toast.success('Link resetujący został wysłany', {
        description: 'Sprawdź swoją skrzynkę email',
      })
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
            <div className="text-4xl">🔑</div>
          </div>
          <CardTitle className="text-2xl text-center text-white">
            Resetuj hasło
          </CardTitle>
          <CardDescription className="text-center text-slate-400">
            {sent
              ? 'Link resetujący został wysłany na Twój email'
              : 'Podaj swój adres email aby otrzymać link do resetowania hasła'}
          </CardDescription>
        </CardHeader>
        {!sent ? (
          <form onSubmit={handleReset}>
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
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={loading}
              >
                {loading ? 'Wysyłanie...' : 'Wyślij link resetujący'}
              </Button>
              <Link
                href="/login"
                className="flex items-center justify-center gap-2 text-sm text-slate-400 hover:text-slate-300"
              >
                <ArrowLeft className="w-4 h-4" />
                Powrót do logowania
              </Link>
            </CardFooter>
          </form>
        ) : (
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-center text-sm text-slate-300 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
              Sprawdź swoją skrzynkę email i kliknij w link, aby zresetować hasło.
            </div>
            <Link
              href="/login"
              className="flex items-center justify-center gap-2 text-sm text-slate-400 hover:text-slate-300"
            >
              <ArrowLeft className="w-4 h-4" />
              Powrót do logowania
            </Link>
          </CardFooter>
        )}
      </Card>
    </div>
  )
}

