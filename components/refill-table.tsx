"use client"

import * as React from "react"
import { ImageLightbox } from "@/components/image-lightbox"
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
  prefilledStockIn?: Record<string, number>
}

const inputCls =
  "w-16 rounded-md border bg-background px-1.5 py-1 text-center text-xs tabular-nums focus:outline-none focus:ring-1 focus:ring-ring"

export function RefillTable({ machineId, items, prefilledStockIn }: RefillTableProps) {
  const itemMap = React.useMemo(
    () => Object.fromEntries(items.map((i) => [i.slot, i])),
    [items]
  )

  const calcOverflow = (slot: string, stockIn: number) => {
    const item = itemMap[slot]
    if (!item) return 0
    const available = item.maxCapacity - item.currentInventory
    return Math.max(0, stockIn - available)
  }

  const [values, setValues] = React.useState<Record<string, RowValues>>(
    () =>
      Object.fromEntries(
        items.map((item) => {
          const stockIn = prefilledStockIn?.[item.slot] ?? item.stockIn
          const available = item.maxCapacity - item.currentInventory
          const overflow = prefilledStockIn?.[item.slot] != null
            ? Math.max(0, stockIn - available)
            : item.overflow
          return [item.slot, { stockIn, overflow, stockOut: item.stockOut }]
        })
      )
  )

  function handleChange(slot: string, field: keyof RowValues, raw: string) {
    const num = raw === "" ? 0 : Math.max(0, parseInt(raw) || 0)
    setValues((prev) => {
      const updated = { ...prev[slot], [field]: num }
      if (field === "stockIn") {
        updated.overflow = calcOverflow(slot, num)
      }
      return { ...prev, [slot]: updated }
    })
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
                    className={`${inputCls} ${prefilledStockIn?.[item.slot] ? "border-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 ring-1 ring-emerald-300" : ""}`}
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
                  <div className="h-8 w-8 mx-auto rounded-md overflow-hidden border bg-muted">
                    {item.image ? (
                      <ImageLightbox src={item.image} alt={item.productName}>
                        <img
                          src={item.image}
                          alt={item.productName}
                          className="h-full w-full object-cover"
                        />
                      </ImageLightbox>
                    ) : null}
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
