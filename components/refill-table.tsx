"use client"

import * as React from "react"
import Image from "next/image"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export interface RefillItem {
  slot: string
  productCode: string
  productName: string
  image: string
  stockIn: number
  overflow: number
  stockOut: number
  currentInventory: number
  maxCapacity: number
}

interface RowValues {
  stockIn: number
  overflow: number
  stockOut: number
}

interface RefillTableProps {
  machineId: string
  items: RefillItem[]
}

const inputCls =
  "w-16 rounded-md border bg-background px-1.5 py-1 text-center text-xs tabular-nums focus:outline-none focus:ring-1 focus:ring-ring"

export function RefillTable({ machineId, items }: RefillTableProps) {
  const [values, setValues] = React.useState<Record<string, RowValues>>(
    () =>
      Object.fromEntries(
        items.map((item) => [
          item.slot,
          { stockIn: item.stockIn, overflow: item.overflow, stockOut: item.stockOut },
        ])
      )
  )

  function handleChange(slot: string, field: keyof RowValues, raw: string) {
    const num = raw === "" ? 0 : Math.max(0, parseInt(raw) || 0)
    setValues((prev) => ({ ...prev, [slot]: { ...prev[slot], [field]: num } }))
  }

  return (
    <div className="rounded-xl border bg-card overflow-hidden text-xs">
      {/* Header bar */}
      <div className="px-4 py-2 border-b flex items-center justify-between bg-muted/40">
        <span className="text-[11px] font-semibold tracking-widest uppercase text-muted-foreground">
          {machineId}
        </span>
        <span className="text-[11px] text-muted-foreground">{items.length} slots</span>
      </div>

      <Table className="text-xs">
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            {["Slot", "Stock In", "Overflow", "Stock Out", "Inventory", "", "Product Name", "Max"].map(
              (h, i) => (
                <TableHead
                  key={i}
                  className="text-center text-[11px] font-semibold tracking-wide py-2"
                >
                  {h}
                </TableHead>
              )
            )}
          </TableRow>
        </TableHeader>

        <TableBody>
          {items.map((item) => {
            const row = values[item.slot] ?? { stockIn: 0, overflow: 0, stockOut: 0 }
            return (
              <TableRow key={item.slot} className="h-10">
                {/* Slot */}
                <TableCell className="text-center py-1.5">
                  <span className="font-mono font-bold tracking-wider">{item.slot}</span>
                </TableCell>

                {/* Stock In */}
                <TableCell className="text-center py-1.5">
                  <input
                    type="number"
                    min={0}
                    value={row.stockIn === 0 ? "" : row.stockIn}
                    placeholder="0"
                    onChange={(e) => handleChange(item.slot, "stockIn", e.target.value)}
                    className={inputCls}
                  />
                </TableCell>

                {/* Overflow */}
                <TableCell className="text-center py-1.5">
                  <input
                    type="number"
                    min={0}
                    value={row.overflow === 0 ? "" : row.overflow}
                    placeholder="0"
                    onChange={(e) => handleChange(item.slot, "overflow", e.target.value)}
                    className={inputCls}
                  />
                </TableCell>

                {/* Stock Out */}
                <TableCell className="text-center py-1.5">
                  <input
                    type="number"
                    min={0}
                    value={row.stockOut === 0 ? "" : row.stockOut}
                    placeholder="0"
                    onChange={(e) => handleChange(item.slot, "stockOut", e.target.value)}
                    className={inputCls}
                  />
                </TableCell>

                {/* Inventory */}
                <TableCell className="text-center py-1.5 font-semibold tabular-nums">
                  {item.currentInventory}
                </TableCell>

                {/* Image */}
                <TableCell className="text-center py-1.5 px-1.5">
                  <div className="relative h-8 w-8 mx-auto rounded-md overflow-hidden border bg-muted">
                    {item.image && (
                      <Image
                        src={item.image}
                        alt={item.productName}
                        fill
                        className="object-cover"
                        sizes="32px"
                      />
                    )}
                  </div>
                </TableCell>

                {/* Product Name */}
                <TableCell className="text-center py-1.5 max-w-[180px]">
                  <p className="truncate font-medium">{item.productName}</p>
                  <p className="truncate text-[10px] text-muted-foreground">{item.productCode}</p>
                </TableCell>

                {/* Max */}
                <TableCell className="text-center py-1.5 text-muted-foreground tabular-nums">
                  {item.maxCapacity}
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
