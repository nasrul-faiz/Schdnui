export interface DOItem {
  slot: string
  productCode: string
  productName: string
  qty: number
}

export interface DeliveryOrder {
  code: string
  machineId: string
  machineLabel: string
  date: string
  items: DOItem[]
  status: "pending" | "completed"
}

export function generateDOCode(): string {
  const now = new Date()
  const date = now.toISOString().slice(2, 10).replace(/-/g, "")
  const all = getAllDOs()
  const seq = (all.length + 1).toString().padStart(3, "0")
  return `DO-${date}-${seq}`
}

export function saveDO(order: DeliveryOrder): void {
  const all = getAllDOs()
  all.push(order)
  localStorage.setItem("delivery_orders", JSON.stringify(all))
}

export function getAllDOs(): DeliveryOrder[] {
  if (typeof window === "undefined") return []
  try {
    const raw = localStorage.getItem("delivery_orders")
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function getDOByCode(code: string): DeliveryOrder | null {
  return getAllDOs().find((d) => d.code === code.toUpperCase()) ?? null
}

export function markDOComplete(code: string): void {
  const all = getAllDOs()
  const updated = all.map((d) =>
    d.code === code ? { ...d, status: "completed" as const } : d
  )
  localStorage.setItem("delivery_orders", JSON.stringify(updated))
}
