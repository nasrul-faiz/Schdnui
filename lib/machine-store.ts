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

export function getMachines(): Machine[] {
  if (typeof window === "undefined") return DEFAULT_MACHINES
  try {
    const raw = localStorage.getItem("machines")
    return raw ? JSON.parse(raw) : DEFAULT_MACHINES
  } catch {
    return DEFAULT_MACHINES
  }
}

export function saveMachines(machines: Machine[]): void {
  localStorage.setItem("machines", JSON.stringify(machines))
}
