"use client"

import * as React from "react"
import { FieldSelect } from "@/components/field-select"
import { RefillTable } from "@/components/refill-table"
import { refillData } from "@/lib/refill-data"

export function HomeContent() {
  const [selectedMachine, setSelectedMachine] = React.useState("")

  const items = selectedMachine ? refillData[selectedMachine] ?? [] : []

  return (
    <div className="flex flex-col gap-6">
      <FieldSelect value={selectedMachine} onChange={setSelectedMachine} />
      {selectedMachine && items.length > 0 && (
        <RefillTable machineId={selectedMachine} items={items} />
      )}
    </div>
  )
}
