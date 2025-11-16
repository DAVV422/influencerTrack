'use client';

import * as React from "react"
import { Check, ChevronsUpDown, X } from "lucide-react"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export type ComboboxOption = {
  value: string
  label: string
}

interface MultiSelectComboboxProps {
  options: ComboboxOption[]
  selected: string[]
  onChange: (selected: string[]) => void
  placeholder?: string
  searchPlaceholder?: string
  notFoundMessage?: string
  className?: string
}

export function MultiSelectCombobox({
  options,
  selected,
  onChange,
  placeholder = "Select options...",
  searchPlaceholder = "Search...",
  notFoundMessage = "Nothing found.",
  className,
}: MultiSelectComboboxProps) {
  const [open, setOpen] = React.useState(false)

  const handleSelect = (value: string) => {
    onChange([...selected, value])
  }

  const handleDeselect = (value: string) => {
    onChange(selected.filter((s) => s !== value))
  }

  const selectedOptions = selected
    .map((s) => options.find((o) => o.value === s))
    .filter((o): o is ComboboxOption => !!o);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild className={className}>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between h-auto"
        >
          <div className="flex gap-1 flex-wrap">
            {selectedOptions.length > 0 ? (
              selectedOptions.map((option) => (
                <Badge
                  variant="secondary"
                  key={option.value}
                  className="mr-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeselect(option.value);
                  }}
                >
                  {option.label}
                  <X className="ml-1 h-3 w-3" />
                </Badge>
              ))
            ) : (
              <span className="text-muted-foreground font-normal">{placeholder}</span>
            )}
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
        <Command>
          <CommandInput placeholder={searchPlaceholder} />
          <CommandList>
            <CommandEmpty>{notFoundMessage}</CommandEmpty>
            <CommandGroup>
              {options.map((option) => {
                const isSelected = selected.includes(option.value)
                return (
                  <CommandItem
                    key={option.value}
                    value={option.value}
                    onSelect={() => {
                      if (isSelected) {
                        handleDeselect(option.value)
                      } else {
                        handleSelect(option.value)
                      }
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        isSelected ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {option.label}
                  </CommandItem>
                )
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
