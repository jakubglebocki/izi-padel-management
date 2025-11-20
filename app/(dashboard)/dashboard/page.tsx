import { Suspense } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar, Users, TrendingUp, Briefcase } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

// Placeholder for stats - will be replaced with real data later
function DashboardStats() {
  const stats = [
    {
      title: 'Dzisiejsze zajęcia',
      value: '0',
      description: 'Rezerwacji na dzisiaj',
      icon: Calendar,
      color: 'text-blue-400',
      bgColor: 'bg-blue-400/10',
    },
    {
      title: 'Aktywni klienci',
      value: '0',
      description: 'W tym miesiącu',
      icon: Users,
      color: 'text-green-400',
      bgColor: 'bg-green-400/10',
    },
    {
      title: 'Przychód miesiąca',
      value: '0 zł',
      description: 'Total w tym miesiącu',
      icon: TrendingUp,
      color: 'text-orange-400',
      bgColor: 'bg-orange-400/10',
    },
    {
      title: 'Aktywne usługi',
      value: '0',
      description: 'Dostępnych usług',
      icon: Briefcase,
      color: 'text-purple-400',
      bgColor: 'bg-purple-400/10',
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <Card key={stat.title} className="bg-slate-900 border-slate-800">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">
                {stat.title}
              </CardTitle>
              <div className={`${stat.bgColor} p-2 rounded-lg`}>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stat.value}</div>
              <p className="text-xs text-slate-500">{stat.description}</p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

function QuickActions() {
  const actions = [
    {
      title: 'Nowa rezerwacja',
      description: 'Dodaj rezerwację klienta',
      href: '/bookings/new',
      icon: Calendar,
    },
    {
      title: 'Nowy klient',
      description: 'Dodaj klienta do bazy',
      href: '/clients/new',
      icon: Users,
    },
    {
      title: 'Nowa usługa',
      description: 'Utwórz nową usługę',
      href: '/services/new',
      icon: Briefcase,
    },
  ]

  return (
    <Card className="bg-slate-900 border-slate-800">
      <CardHeader>
        <CardTitle className="text-white">Szybkie akcje</CardTitle>
        <CardDescription className="text-slate-400">
          Najczęściej wykonywane czynności
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-3">
        {actions.map((action) => {
          const Icon = action.icon
          return (
            <Button
              key={action.title}
              asChild
              variant="outline"
              className="h-auto flex-col items-start gap-2 border-slate-700 bg-slate-800/50 hover:bg-slate-800 text-left p-4"
            >
              <Link href={action.href}>
                <Icon className="h-5 w-5 text-blue-400" />
                <div>
                  <div className="font-semibold text-white">{action.title}</div>
                  <div className="text-xs text-slate-400">{action.description}</div>
                </div>
              </Link>
            </Button>
          )
        })}
      </CardContent>
    </Card>
  )
}

function UpcomingEvents() {
  return (
    <Card className="bg-slate-900 border-slate-800">
      <CardHeader>
        <CardTitle className="text-white">Najbliższe zajęcia</CardTitle>
        <CardDescription className="text-slate-400">
          Twoje rezerwacje na dziś
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8 text-slate-500">
          <Calendar className="h-12 w-12 mx-auto mb-3 opacity-50" />
          <p>Brak zaplanowanych zajęć</p>
          <p className="text-sm mt-1">Dodaj swoją pierwszą rezerwację</p>
          <Button asChild className="mt-4 bg-blue-600 hover:bg-blue-700">
            <Link href="/calendar">Otwórz kalendarz</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

function RecentActivity() {
  return (
    <Card className="bg-slate-900 border-slate-800">
      <CardHeader>
        <CardTitle className="text-white">Ostatnia aktywność</CardTitle>
        <CardDescription className="text-slate-400">
          Twoje ostatnie akcje w systemie
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8 text-slate-500">
          <TrendingUp className="h-12 w-12 mx-auto mb-3 opacity-50" />
          <p>Brak aktywności</p>
          <p className="text-sm mt-1">Tu pojawią się Twoje ostatnie działania</p>
        </div>
      </CardContent>
    </Card>
  )
}

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <p className="text-slate-400 mt-1">
          Witaj ponownie! Oto podsumowanie Twojej działalności.
        </p>
      </div>

      {/* Stats */}
      <Suspense fallback={<div>Ładowanie statystyk...</div>}>
        <DashboardStats />
      </Suspense>

      {/* Quick Actions */}
      <QuickActions />

      {/* Two Column Layout */}
      <div className="grid gap-6 lg:grid-cols-2">
        <UpcomingEvents />
        <RecentActivity />
      </div>

      {/* Getting Started Guide */}
      <Card className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-blue-500/20">
        <CardHeader>
          <CardTitle className="text-white">🚀 Pierwsze kroki</CardTitle>
          <CardDescription className="text-slate-300">
            Skonfiguruj swoją aplikację w kilku prostych krokach
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center gap-3 text-slate-300">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-xs text-white">
                1
              </div>
              <span>Dodaj swoje korty w ustawieniach</span>
            </div>
            <div className="flex items-center gap-3 text-slate-300">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-xs text-white">
                2
              </div>
              <span>Utwórz swoje usługi i pakiety</span>
            </div>
            <div className="flex items-center gap-3 text-slate-300">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-xs text-white">
                3
              </div>
              <span>Dodaj pierwszych klientów</span>
            </div>
            <div className="flex items-center gap-3 text-slate-300">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-xs text-white">
                4
              </div>
              <span>Zaplanuj pierwsze zajęcia w kalendarzu</span>
            </div>
          </div>
          <div className="mt-4 flex gap-3">
            <Button asChild className="bg-blue-600 hover:bg-blue-700">
              <Link href="/settings">Przejdź do ustawień</Link>
            </Button>
            <Button asChild variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-800">
              <Link href="/services">Dodaj usługi</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

