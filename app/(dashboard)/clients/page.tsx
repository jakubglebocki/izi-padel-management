'use client'

import { useState } from 'react'
import { useClients } from '@/hooks/useClients'
import { useGroups } from '@/hooks/useGroups'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Plus, MoreVertical, Edit, Trash2, Users, Search } from 'lucide-react'
import type { SkillLevel } from '@/types'

const skillLevelLabels: Record<SkillLevel, string> = {
  beginner: 'Początkujący',
  intermediate: 'Średniozaawansowany',
  advanced: 'Zaawansowany',
  professional: 'Profesjonalny',
}

const skillLevelColors: Record<SkillLevel, string> = {
  beginner: 'bg-green-500/10 text-green-400 border-green-500/20',
  intermediate: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  advanced: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  professional: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
}

export default function ClientsPage() {
  const { clients, loading, createClient, deleteClient } = useClients()
  const { groups, loading: groupsLoading } = useGroups()
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [formLoading, setFormLoading] = useState(false)

  // Form state
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [notes, setNotes] = useState('')
  const [skillLevel, setSkillLevel] = useState<SkillLevel | ''>('')
  const [groupId, setGroupId] = useState<string>('')

  const handleDelete = async (id: string) => {
    if (!confirm('Czy na pewno chcesz usunąć tego klienta?')) return
    
    setDeletingId(id)
    try {
      await deleteClient(id)
    } finally {
      setDeletingId(null)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormLoading(true)

    try {
      await createClient({
        first_name: firstName,
        last_name: lastName,
        email: email || null,
        phone: phone || null,
        notes: notes || null,
        tags: null,
        skill_level: skillLevel || null,
        group_id: groupId || null,
      })

      // Reset form
      setFirstName('')
      setLastName('')
      setEmail('')
      setPhone('')
      setNotes('')
      setSkillLevel('')
      setGroupId('')
      setDialogOpen(false)
    } catch (error) {
      console.error('Error creating client:', error)
    } finally {
      setFormLoading(false)
    }
  }

  // Filter clients by search query
  const filteredClients = clients.filter((client) => {
    const query = searchQuery.toLowerCase()
    return (
      client.first_name.toLowerCase().includes(query) ||
      client.last_name.toLowerCase().includes(query) ||
      client.email?.toLowerCase().includes(query) ||
      client.phone?.toLowerCase().includes(query)
    )
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-slate-400">Ładowanie klientów...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Klienci</h1>
          <p className="text-slate-400 mt-1">
            Zarządzaj bazą swoich klientów
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="mr-2 h-4 w-4" />
              Nowy klient
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-slate-900 border-slate-800 text-white">
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle className="text-white">Dodaj nowego klienta</DialogTitle>
                <DialogDescription className="text-slate-400">
                  Wprowadź dane klienta
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-slate-200">
                      Imię *
                    </Label>
                    <Input
                      id="firstName"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                      className="bg-slate-800 border-slate-700 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-slate-200">
                      Nazwisko *
                    </Label>
                    <Input
                      id="lastName"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                      className="bg-slate-800 border-slate-700 text-white"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-slate-200">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-slate-800 border-slate-700 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-slate-200">
                    Telefon
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="bg-slate-800 border-slate-700 text-white"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="skillLevel" className="text-slate-200">
                      Poziom
                    </Label>
                    <Select value={skillLevel} onValueChange={(value) => setSkillLevel(value as SkillLevel)}>
                      <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                        <SelectValue placeholder="Wybierz poziom..." />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700">
                        <SelectItem value="beginner" className="text-white focus:bg-slate-700">
                          Początkujący
                        </SelectItem>
                        <SelectItem value="intermediate" className="text-white focus:bg-slate-700">
                          Średniozaawansowany
                        </SelectItem>
                        <SelectItem value="advanced" className="text-white focus:bg-slate-700">
                          Zaawansowany
                        </SelectItem>
                        <SelectItem value="professional" className="text-white focus:bg-slate-700">
                          Profesjonalny
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="group" className="text-slate-200">
                      Grupa
                    </Label>
                    <Select value={groupId} onValueChange={setGroupId}>
                      <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                        <SelectValue placeholder="Wybierz grupę..." />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700">
                        {groupsLoading ? (
                          <SelectItem value="loading" disabled className="text-slate-500">
                            Ładowanie...
                          </SelectItem>
                        ) : groups.length === 0 ? (
                          <SelectItem value="none" disabled className="text-slate-500">
                            Brak grup
                          </SelectItem>
                        ) : (
                          groups.map((group) => (
                            <SelectItem key={group.id} value={group.id} className="text-white focus:bg-slate-700">
                              {group.name}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes" className="text-slate-200">
                    Notatki
                  </Label>
                  <Textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                    className="bg-slate-800 border-slate-700 text-white"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setDialogOpen(false)}
                  disabled={formLoading}
                  className="border-slate-700 text-slate-300 hover:bg-slate-800"
                >
                  Anuluj
                </Button>
                <Button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700"
                  disabled={formLoading}
                >
                  {formLoading ? 'Dodawanie...' : 'Dodaj klienta'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      {clients.length > 0 && (
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            type="search"
            placeholder="Szukaj klienta..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-slate-900 border-slate-800 text-white"
          />
        </div>
      )}

      {/* Clients List */}
      {clients.length === 0 ? (
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Users className="h-16 w-16 text-slate-600 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              Brak klientów
            </h3>
            <p className="text-slate-400 text-center mb-6 max-w-md">
              Dodaj swojego pierwszego klienta, aby rozpocząć zarządzanie rezerwacjami
            </p>
            <Button
              onClick={() => setDialogOpen(true)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="mr-2 h-4 w-4" />
              Dodaj pierwszego klienta
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white">
              Wszyscy klienci ({filteredClients.length})
            </CardTitle>
            <CardDescription className="text-slate-400">
              Lista wszystkich Twoich klientów
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredClients.length === 0 ? (
              <div className="text-center py-8 text-slate-500">
                Nie znaleziono klientów pasujących do wyszukiwania
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-800 hover:bg-slate-800/50">
                    <TableHead className="text-slate-400">Klient</TableHead>
                    <TableHead className="text-slate-400">Email</TableHead>
                    <TableHead className="text-slate-400">Telefon</TableHead>
                    <TableHead className="text-slate-400">Poziom</TableHead>
                    <TableHead className="text-slate-400">Grupa</TableHead>
                    <TableHead className="text-slate-400">Notatki</TableHead>
                    <TableHead className="text-slate-400 text-right">Akcje</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredClients.map((client) => (
                    <TableRow
                      key={client.id}
                      className="border-slate-800 hover:bg-slate-800/50"
                    >
                      <TableCell>
                        <div>
                          <div className="font-medium text-white">
                            {client.first_name} {client.last_name}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-slate-300">
                        {client.email || '-'}
                      </TableCell>
                      <TableCell className="text-slate-300">
                        {client.phone || '-'}
                      </TableCell>
                      <TableCell>
                        {client.skill_level ? (
                          <Badge variant="outline" className={skillLevelColors[client.skill_level]}>
                            {skillLevelLabels[client.skill_level]}
                          </Badge>
                        ) : (
                          <span className="text-slate-500">-</span>
                        )}
                      </TableCell>
                      <TableCell className="text-slate-300">
                        {client.group?.name || '-'}
                      </TableCell>
                      <TableCell className="text-slate-300">
                        {client.notes ? (
                          <span className="line-clamp-1">{client.notes}</span>
                        ) : (
                          '-'
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-slate-400 hover:text-white hover:bg-slate-800"
                              disabled={deletingId === client.id}
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
                              className="text-slate-300 focus:bg-slate-700 focus:text-white cursor-pointer"
                              onClick={() => {
                                // TODO: Implement edit
                                console.log('Edit', client.id)
                              }}
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Edytuj
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="bg-slate-700" />
                            <DropdownMenuItem
                              className="text-red-400 focus:bg-slate-700 focus:text-red-300 cursor-pointer"
                              onClick={() => handleDelete(client.id)}
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
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}

