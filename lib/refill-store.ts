import type { RefillItem } from "@/components/refill-table"
import { refillData as defaultRefillData } from "@/lib/refill-data"

export const REFILL_DATA_STORAGE_KEY = "refill_data"

export type RefillDataMap = Record<string, RefillItem[]>

function cloneDefaultData(): RefillDataMap {
  return JSON.parse(JSON.stringify(defaultRefillData)) as RefillDataMap
}

function isRefillItem(value: unknown): value is RefillItem {
  if (!value || typeof value !== "object") return false
  const item = value as Partial<RefillItem>
  return (
    typeof item.slot === "string" &&
    typeof item.productCode === "string" &&
    typeof item.productName === "string" &&
    typeof item.image === "string" &&
    typeof item.stockIn === "number" &&
    typeof item.overflow === "number" &&
    typeof item.stockOut === "number" &&
    typeof item.currentInventory === "number" &&
    typeof item.maxCapacity === "number"
  )
}

function isRefillDataMap(value: unknown): value is RefillDataMap {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false
  return Object.entries(value).every(
    ([machineId, items]) =>
      typeof machineId === "string" &&
      Array.isArray(items) &&
      items.every((item) => isRefillItem(item))
  )
}

export function getRefillData(): RefillDataMap {
  if (typeof window === "undefined") return cloneDefaultData()

  try {
    const raw = localStorage.getItem(REFILL_DATA_STORAGE_KEY)
    if (!raw) return cloneDefaultData()

    const parsed: unknown = JSON.parse(raw)
    if (isRefillDataMap(parsed)) {
      return parsed
    }
  } catch {
    // Ignore parse/storage errors and fall back to defaults.
  }

  return cloneDefaultData()
}

export function saveRefillData(data: RefillDataMap): void {
  if (typeof window === "undefined") return
  localStorage.setItem(REFILL_DATA_STORAGE_KEY, JSON.stringify(data))
}