'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useServices } from '@/hooks/useServices'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Plus, MoreVertical, Edit, Trash2, Copy, Briefcase } from 'lucide-react'
import type { ServiceType } from '@/types'

const serviceTypeLabels: Record<ServiceType, string> = {
  single: 'Jednorazowy',
  package: 'Pakiet',
  camp: 'Camp',
}

const serviceTypeColors: Record<ServiceType, string> = {
  single: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  package: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  camp: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
}

export default function ServicesPage() {
  const { services, loading, deleteService } = useServices()
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    if (!confirm('Czy na pewno chcesz usunąć tę usługę?')) return
    
    setDeletingId(id)
    try {
      await deleteService(id)
    } finally {
      setDeletingId(null)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-slate-400">Ładowanie usług...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Usługi</h1>
          <p className="text-slate-400 mt-1">
            Zarządzaj swoimi usługami, treningami i pakietami
          </p>
        </div>
        <Button asChild className="bg-blue-600 hover:bg-blue-700">
          <Link href="/services/new">
            <Plus className="mr-2 h-4 w-4" />
            Nowa usługa
          </Link>
        </Button>
      </div>

      {/* Services List */}
      {services.length === 0 ? (
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Briefcase className="h-16 w-16 text-slate-600 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              Brak usług
            </h3>
            <p className="text-slate-400 text-center mb-6 max-w-md">
              Dodaj swoją pierwszą usługę, aby móc zarządzać treningami i rezerwacjami
            </p>
            <Button asChild className="bg-blue-600 hover:bg-blue-700">
              <Link href="/services/new">
                <Plus className="mr-2 h-4 w-4" />
                Utwórz pierwszą usługę
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white">Wszystkie usługi</CardTitle>
            <CardDescription className="text-slate-400">
              Lista wszystkich Twoich usług i pakietów
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-slate-800 hover:bg-slate-800/50">
                  <TableHead className="text-slate-400">Nazwa</TableHead>
                  <TableHead className="text-slate-400">Typ</TableHead>
                  <TableHead className="text-slate-400">Czas trwania</TableHead>
                  <TableHead className="text-slate-400">Uczestnicy</TableHead>
                  <TableHead className="text-slate-400">Cena</TableHead>
                  <TableHead className="text-slate-400">Status</TableHead>
                  <TableHead className="text-slate-400 text-right">Akcje</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {services.map((service) => (
                  <TableRow
                    key={service.id}
                    className="border-slate-800 hover:bg-slate-800/50"
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: service.color || '#3b82f6' }}
                        />
                        <div>
                          <div className="font-medium text-white">{service.name}</div>
                          {service.description && (
                            <div className="text-sm text-slate-500 line-clamp-1">
                              {service.description}
                            </div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={serviceTypeColors[service.type]}
                      >
                        {serviceTypeLabels[service.type]}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-slate-300">
                      {service.duration_hours ? `${service.duration_hours}h` : '-'}
                    </TableCell>
                    <TableCell className="text-slate-300">
                      {service.min_participants && service.max_participants
                        ? `${service.min_participants}-${service.max_participants}`
                        : '-'}
                    </TableCell>
                    <TableCell className="text-slate-300">
                      {service.price_per_person
                        ? `${service.price_per_person} zł`
                        : '-'}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          service.is_active
                            ? 'bg-green-500/10 text-green-400 border-green-500/20'
                            : 'bg-slate-500/10 text-slate-400 border-slate-500/20'
                        }
                      >
                        {service.is_active ? 'Aktywna' : 'Nieaktywna'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-slate-400 hover:text-white hover:bg-slate-800"
                            disabled={deletingId === service.id}
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="bg-slate-800 border-slate-700"
                        >
                          <DropdownMenuLabel className="text-white">
                            Akcje
                          </DropdownMenuLabel>
                          <DropdownMenuSeparator className="bg-slate-700" />
                          <DropdownMenuItem
                            asChild
                            className="text-slate-300 focus:bg-slate-700 focus:text-white cursor-pointer"
                          >
                            <Link href={`/services/${service.id}/edit`}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edytuj
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-slate-300 focus:bg-slate-700 focus:text-white cursor-pointer"
                            onClick={() => {
                              // TODO: Implement duplicate
                              console.log('Duplicate', service.id)
                            }}
                          >
                            <Copy className="mr-2 h-4 w-4" />
                            Duplikuj
                          </DropdownMenuItem>
                          <DropdownMenuSeparator className="bg-slate-700" />
                          <DropdownMenuItem
                            className="text-red-400 focus:bg-slate-700 focus:text-red-300 cursor-pointer"
                            onClick={() => handleDelete(service.id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Usuń
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

