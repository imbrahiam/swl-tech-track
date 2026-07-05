"use client"

import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

type Client = { id: string; name: string; cedula: string; phone: string }

export function ClientSearch() {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<Client[]>([])
  const [selected, setSelected] = useState<Client | null>(null)

  useEffect(() => {
    if (query.length < 2 || selected) return
    const timer = setTimeout(async () => {
      const response = await fetch(
        `/api/clients/search?q=${encodeURIComponent(query)}`
      )
      if (response.ok) setResults(await response.json())
    }, 300)
    return () => clearTimeout(timer)
  }, [query, selected])

  if (selected)
    return (
      <div className="rounded-md border p-3">
        <input type="hidden" name="clientId" value={selected.id} />
        <p className="font-medium">{selected.name}</p>
        <p className="text-sm text-muted-foreground">
          {selected.cedula} · {selected.phone}
        </p>
        <Button
          type="button"
          variant="link"
          className="h-auto p-0"
          onClick={() => {
            setSelected(null)
            setQuery("")
          }}
        >
          Elegir otro cliente
        </Button>
      </div>
    )

  return (
    <div className="space-y-3">
      <Input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Buscar por nombre, cédula o teléfono"
      />
      {results.length > 0 && query.length >= 2 && (
        <div className="divide-y rounded-md border">
          {results.map((client) => (
            <button
              key={client.id}
              type="button"
              className="block w-full p-3 text-left hover:bg-muted"
              onClick={() => setSelected(client)}
            >
              <span className="block font-medium">{client.name}</span>
              <span className="text-sm text-muted-foreground">
                {client.cedula} · {client.phone}
              </span>
            </button>
          ))}
        </div>
      )}
      <p className="text-sm font-medium">O registra un cliente nuevo</p>
      <div className="grid gap-3 md:grid-cols-3">
        <Input
          name="name"
          placeholder="Nombre completo"
          minLength={3}
          disabled={!!selected}
        />
        <Input
          name="cedula"
          placeholder="001-0000000-0"
          pattern="[0-9]{3}-?[0-9]{7}-?[0-9]"
          disabled={!!selected}
        />
        <Input name="phone" placeholder="809-000-0000" disabled={!!selected} />
      </div>
    </div>
  )
}
