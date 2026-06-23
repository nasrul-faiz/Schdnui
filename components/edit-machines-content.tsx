"use client"

import * as React from "react"
import {
  PlusIcon,
  PencilIcon,
  Trash2Icon,
  CheckIcon,
  XIcon,
} from "lucide-react"
import {
  getMachines,
  createMachine,
  updateMachine,
  deleteMachine,
  type Machine,
} from "@/lib/machine-store"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"

const inputCls =
  "w-full rounded-md border bg-background px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-ring"

interface MachineEditRowProps {
  machine: Machine
  onSave: (updated: Machine) => void
  onCancel: () => void
}

function MachineEditRow({ machine, onSave, onCancel }: MachineEditRowProps) {
  const [draft, setDraft] = React.useState(machine)
  return (
    <TableRow className="bg-accent/20">
      <TableCell className="py-1.5 px-4">
        <input
          className={inputCls}
          value={draft.value}
          onChange={(e) =>
            setDraft((p) => ({ ...p, value: e.target.value.toUpperCase() }))
          }
          placeholder="M0001"
        />
      </TableCell>
      <TableCell className="py-1.5 px-4">
        <input
          className={inputCls}
          value={draft.label}
          onChange={(e) =>
            setDraft((p) => ({ ...p, label: e.target.value }))
          }
          placeholder="M0001 — Location name"
        />
      </TableCell>
      <TableCell className="py-1.5 px-4">
        <div className="flex justify-center gap-1">
          <button
            onClick={() => onSave(draft)}
            className="rounded p-1 hover:bg-emerald-100 dark:hover:bg-emerald-900 text-emerald-600"
          >
            <CheckIcon className="size-3.5" />
          </button>
          <button
            onClick={onCancel}
            className="rounded p-1 hover:bg-muted text-muted-foreground"
          >
            <XIcon className="size-3.5" />
          </button>
        </div>
      </TableCell>
    </TableRow>
  )
}

export function EditMachinesContent() {
  const [machines, setMachines] = React.useState<Machine[]>([])
  const [loading, setLoading] = React.useState(true)
  const [editingId, setEditingId] = React.useState<number | null>(null)
  const [adding, setAdding] = React.useState(false)
  const [newMachine, setNewMachine] = React.useState<Machine>({
    value: "",
    label: "",
  })

  React.useEffect(() => {
    getMachines().then((m) => {
      setMachines(m)
      setLoading(false)
    })
  }, [])

  async function handleAdd(draft: Machine) {
    const value = draft.value.trim().toUpperCase()
    if (!value) return
    if (machines.some((m) => m.value === value)) return
    const created = await createMachine({
      value,
      label: draft.label.trim() || value,
    })
    if (created) setMachines((prev) => [...prev, created])
    setAdding(false)
    setNewMachine({ value: "", label: "" })
  }

  async function handleSave(draft: Machine) {
    const value = draft.value.trim().toUpperCase()
    if (!value || !draft.id) return
    if (machines.some((m) => m.value === value && m.id !== draft.id)) return
    const updated = await updateMachine({
      ...draft,
      value,
      label: draft.label.trim() || value,
    })
    if (updated) {
      setMachines((prev) =>
        prev.map((m) => (m.id === draft.id ? { ...updated, id: draft.id } : m))
      )
    }
    setEditingId(null)
  }

  async function handleDelete(machine: Machine) {
    if (!machine.id) return
    const ok = await deleteMachine(machine.id)
    if (ok) setMachines((prev) => prev.filter((m) => m.id !== machine.id))
  }

  if (loading) {
    return (
      <div className="py-10 text-center text-sm text-muted-foreground">
        Loading…
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {machines.length} machine{machines.length !== 1 && "s"}
        </p>
        <Button
          size="sm"
          className="gap-1.5"
          onClick={() => {
            setAdding(true)
            setEditingId(null)
          }}
        >
          <PlusIcon className="size-3.5" />
          Add Machine
        </Button>
      </div>

      <div className="rounded-xl border bg-card overflow-hidden text-xs">
        <div className="overflow-x-auto">
          <Table className="text-xs min-w-[500px]">
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                {["Machine ID", "Label / Location", "Actions"].map((h) => (
                  <TableHead
                    key={h}
                    className="text-[11px] font-semibold tracking-wide py-2 px-4"
                  >
                    {h}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {adding && (
                <MachineEditRow
                  machine={newMachine}
                  onSave={handleAdd}
                  onCancel={() => setAdding(false)}
                />
              )}
              {machines.map((machine) => {
                if (editingId === machine.id) {
                  return (
                    <MachineEditRow
                      key={machine.id}
                      machine={machine}
                      onSave={handleSave}
                      onCancel={() => setEditingId(null)}
                    />
                  )
                }
                return (
                  <TableRow key={machine.id ?? machine.value} className="h-10">
                    <TableCell className="py-1.5 px-4">
                      <span className="font-mono font-bold tracking-wider">
                        {machine.value}
                      </span>
                    </TableCell>
                    <TableCell className="py-1.5 px-4 text-muted-foreground">
                      {machine.label}
                    </TableCell>
                    <TableCell className="py-1.5 px-4">
                      <div className="flex gap-1">
                        <button
                          onClick={() => setEditingId(machine.id ?? null)}
                          className="rounded p-1 hover:bg-muted text-muted-foreground hover:text-foreground"
                        >
                          <PencilIcon className="size-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(machine)}
                          className="rounded p-1 hover:bg-red-100 dark:hover:bg-red-900/40 text-muted-foreground hover:text-red-500"
                        >
                          <Trash2Icon className="size-3.5" />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
              {machines.length === 0 && !adding && (
                <TableRow>
                  <TableCell
                    colSpan={3}
                    className="py-10 text-center text-muted-foreground"
                  >
                    No machines yet. Add one to get started.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}
