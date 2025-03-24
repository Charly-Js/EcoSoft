"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Filter, SortAsc, Grid, List } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export function FileViewControls() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("list")
  const { toast } = useToast()

  const handleViewChange = (mode: "grid" | "list") => {
    setViewMode(mode)

    // Emitir evento para que otros componentes puedan reaccionar
    const event = new CustomEvent("viewModeChange", { detail: { mode } })
    window.dispatchEvent(event)

    toast({
      title: `Vista cambiada`,
      description: `Ahora estás viendo en modo ${mode === "grid" ? "cuadrícula" : "lista"}`,
    })
  }

  const handleFilter = (filter: string) => {
    toast({
      title: "Filtro aplicado",
      description: `Mostrando solo archivos de tipo: ${filter}`,
    })
  }

  const handleSort = (sortBy: string) => {
    toast({
      title: "Ordenamiento aplicado",
      description: `Archivos ordenados por: ${sortBy}`,
    })
  }

  return (
    <div className="flex items-center space-x-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => handleFilter("Todos")}>Todos los archivos</DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleFilter("Documentos")}>Documentos</DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleFilter("Imágenes")}>Imágenes</DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleFilter("PDFs")}>PDFs</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon">
            <SortAsc className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => handleSort("Nombre (A-Z)")}>Nombre (A-Z)</DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleSort("Nombre (Z-A)")}>Nombre (Z-A)</DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleSort("Fecha (más reciente)")}>Fecha (más reciente)</DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleSort("Fecha (más antiguo)")}>Fecha (más antiguo)</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Button
        variant={viewMode === "grid" ? "default" : "outline"}
        size="icon"
        onClick={() => handleViewChange("grid")}
      >
        <Grid className="h-4 w-4" />
      </Button>

      <Button
        variant={viewMode === "list" ? "default" : "outline"}
        size="icon"
        onClick={() => handleViewChange("list")}
      >
        <List className="h-4 w-4" />
      </Button>
    </div>
  )
}

