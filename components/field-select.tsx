"use client"

import * as React from "react"
import { ChevronsUpDownIcon } from "lucide-react"
import {
  Field,
  FieldDescription,
  FieldLabel,
} from "@/components/ui/field"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

const departments = [
  { value: "engineering", label: "Engineering" },
  { value: "design", label: "Design" },
  { value: "marketing", label: "Marketing" },
  { value: "sales", label: "Sales" },
  { value: "support", label: "Customer Support" },
  { value: "hr", label: "Human Resources" },
  { value: "finance", label: "Finance" },
  { value: "operations", label: "Operations" },
] as const

export function FieldSelect() {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState("")

  const selectedDepartment = departments.find((item) => item.value === value)

  return (
    <div className="w-full max-w-sm">
      <Field>
        <FieldLabel>Machines</FieldLabel>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="h-8 w-full justify-between rounded-lg px-2.5 font-normal"
            >
              {selectedDepartment?.label ?? "Choose machines"}
              <ChevronsUpDownIcon className="ml-2 size-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent
            side="bottom"
            align="start"
            avoidCollisions={false}
            className="w-[var(--radix-popover-trigger-width)] p-0"
          >
            <Command>
              <CommandInput placeholder="Type to search department..." />
              <CommandList>
                <CommandEmpty>No department found.</CommandEmpty>
                <CommandGroup>
                  {departments.map((department) => (
                    <CommandItem
                      key={department.value}
                      value={department.label}
                      onSelect={() => {
                        setValue(department.value)
                        setOpen(false)
                      }}
                    >
                      {department.label}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
        <FieldDescription>
          Select your machines to refill.
        </FieldDescription>
      </Field>
    </div>
  )
}
