"use client"

import * as React from "react"
import { X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

export interface Option {
  value: string
  label: string
  disable?: boolean
}

interface MultiSelectProps {
  options?: Option[]
  placeholder?: string
  value?: string[]
  onValueChange?: (values: string[]) => void
  disabled?: boolean
  className?: string
}

export function MultiSelect({
  options,
  placeholder = "Seleccionar opciones",
  value = [],
  onValueChange,
  disabled = false,
  className,
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false)

  const handleUnselect = (item: string) => {
    onValueChange?.(value.filter((i) => i !== item))
  }

  return (
    <Popover open={open && !disabled} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div
          role="combobox"
          aria-expanded={open}
          className={cn(
            "flex min-h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background",
            disabled && "cursor-not-allowed opacity-50",
            className,
          )}
          onClick={() => !disabled && setOpen(!open)}
        >
          <div className="flex flex-wrap gap-1">
            {value.length === 0 && <span className="text-muted-foreground">{placeholder}</span>}
            {value.map((item) => {
              const option = options?.find((option) => option.value === item)
              return (
                <Badge key={item} variant="secondary" className="flex items-center gap-1">
                  {option?.label || item}
                  <button
                    className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleUnselect(item)
                      }
                    }}
                    onMouseDown={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                    }}
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      handleUnselect(item)
                    }}
                  >
                    <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                  </button>
                </Badge>
              )
            })}
          </div>
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command>
          <CommandInput placeholder="Buscar..." />
          <CommandList>
            <CommandEmpty>No se encontraron resultados.</CommandEmpty>
            <CommandGroup>
              {options?.map((option) => {
                const isSelected = value.includes(option.value)
                return (
                  <CommandItem
                    key={option.value}
                    disabled={option.disable}
                    onSelect={() => {
                      if (isSelected) {
                        onValueChange?.(value.filter((v) => v !== option.value))
                      } else {
                        onValueChange?.([...value, option.value])
                      }
                    }}
                  >
                    <div
                      className={cn(
                        "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                        isSelected ? "bg-primary text-primary-foreground" : "opacity-50 [&_svg]:invisible",
                      )}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-4 w-4"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                    <span>{option.label}</span>
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

export interface MultiSelectTriggerProps extends React.ComponentPropsWithoutRef<"div"> {
  children: React.ReactNode
}

export const MultiSelectTrigger = React.forwardRef<HTMLDivElement, MultiSelectTriggerProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex min-h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  ),
)
MultiSelectTrigger.displayName = "MultiSelectTrigger"

export interface MultiSelectValueProps extends React.ComponentPropsWithoutRef<"span"> {
  placeholder?: string
}

export const MultiSelectValue = React.forwardRef<HTMLSpanElement, MultiSelectValueProps>(
  ({ className, placeholder = "Seleccionar opciones", ...props }, ref) => (
    <span ref={ref} className={cn("text-muted-foreground", className)} {...props}>
      {placeholder}
    </span>
  ),
)
MultiSelectValue.displayName = "MultiSelectValue"

export interface MultiSelectContentProps extends React.ComponentPropsWithoutRef<typeof PopoverContent> {
  children: React.ReactNode
}

export const MultiSelectContent = React.forwardRef<HTMLDivElement, MultiSelectContentProps>(
  ({ className, children, ...props }, ref) => (
    <PopoverContent ref={ref} className={cn("w-full p-0", className)} align="start" {...props}>
      {children}
    </PopoverContent>
  ),
)
MultiSelectContent.displayName = "MultiSelectContent"

export interface MultiSelectItemProps extends React.ComponentPropsWithoutRef<typeof CommandItem> {
  children: React.ReactNode
  value: string
}

export const MultiSelectItem = React.forwardRef<HTMLDivElement, MultiSelectItemProps>(
  ({ className, children, ...props }, ref) => (
    <CommandItem ref={ref} className={cn(className)} {...props}>
      {children}
    </CommandItem>
  ),
)
MultiSelectItem.displayName = "MultiSelectItem"

