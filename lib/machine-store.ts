export interface Machine {
  value: string
  label: string
}

export const DEFAULT_MACHINES: Machine[] = [
  { value: "M0031", label: "M0031 — Lobby A" },
  { value: "M0032", label: "M0032 — Lobby B" },
  { value: "M0045", label: "M0045 — Floor 3" },
  { value: "M0060", label: "M0060 — Cafeteria" },
]

export async function getMachines(): Promise<Machine[]> {
  try {
    const response = await fetch("/api/machines", { cache: "no-store" })
    if (!response.ok) throw new Error("Failed to fetch machines")
    return response.json()
  } catch (error) {
    console.error("Error fetching machines:", error)
    return DEFAULT_MACHINES
  }
}

export async function saveMachines(machines: Machine[]): Promise<void> {
  try {
    for (const machine of machines) {
      await fetch("/api/machines", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(machine),
      })
    }
  } catch (error) {
    console.error("Error saving machines:", error)
  }
}
