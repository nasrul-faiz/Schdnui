import type { RefillItem } from "@/components/refill-table"
import { refillData as defaultRefillData } from "@/lib/refill-data"

export const REFILL_DATA_STORAGE_KEY = "refill_data"

export type RefillDataMap = Record<string, RefillItem[]>

function cloneDefaultData(): RefillDataMap {
  return JSON.parse(JSON.stringify(defaultRefillData)) as RefillDataMap
}

export async function getRefillData(): Promise<RefillDataMap> {
  try {
    const response = await fetch("/api/refill", { cache: "no-store" })
    if (!response.ok) throw new Error("Failed to fetch refill data")

    const items: Array<RefillItem & { machine_id: string }> = await response.json()

    // Transform flat array into nested object by machine_id
    const dataMap: RefillDataMap = {}
    for (const item of items) {
      const machineId = item.machine_id
      if (!dataMap[machineId]) {
        dataMap[machineId] = []
      }
      dataMap[machineId].push(item)
    }

    return Object.keys(dataMap).length > 0 ? dataMap : cloneDefaultData()
  } catch (error) {
    console.error("Error fetching refill data:", error)
    return cloneDefaultData()
  }
}

export async function saveRefillData(data: RefillDataMap): Promise<void> {
  try {
    // Flatten the nested object into a single array
    const items: Array<RefillItem & { machine_id: string }> = []
    for (const [machineId, machineItems] of Object.entries(data)) {
      for (const item of machineItems) {
        items.push({ ...item, machine_id: machineId })
      }
    }

    const response = await fetch("/api/refill", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(items),
    })

    if (!response.ok) throw new Error("Failed to save refill data")
  } catch (error) {
    console.error("Error saving refill data:", error)
  }
}