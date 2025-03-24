"use client"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { FolderPlus, Upload, Filter, SortAsc, Grid, List } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function FileActions() {
  const { toast } = useToast()

  const handleAction = (action: string) => {
    toast({
      title: `Acción: ${action}`,
      description: `Has seleccionado la acción: ${action}`,
    })
  }

  return (
    <div className="flex items-center space-x-2">
      <Button variant="outline" size="sm" className="flex items-center" onClick={() => handleAction("Nueva carpeta")}>
        <FolderPlus className="h-4 w-4 mr-2" />
        Nueva carpeta
      </Button>

      <Button variant="outline" size="sm" className="flex items-center" onClick={() => handleAction("Subir archivo")}>
        <Upload className="h-4 w-4 mr-2" />
        Subir
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => handleAction("Filtrar por documentos")}>Documentos</DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleAction("Filtrar por imágenes")}>Imágenes</DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleAction("Filtrar por PDFs")}>PDFs</DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleAction("Filtrar por archivos comprimidos")}>
            Archivos comprimidos
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon">
            <SortAsc className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => handleAction("Ordenar por nombre (A-Z)")}>Nombre (A-Z)</DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleAction("Ordenar por nombre (Z-A)")}>Nombre (Z-A)</DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleAction("Ordenar por fecha (más reciente)")}>
            Fecha (más reciente)
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleAction("Ordenar por fecha (más antiguo)")}>
            Fecha (más antiguo)
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleAction("Ordenar por tamaño (mayor)")}>Tamaño (mayor)</DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleAction("Ordenar por tamaño (menor)")}>Tamaño (menor)</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Button variant="outline" size="icon" onClick={() => handleAction("Vista de cuadrícula")}>
        <Grid className="h-4 w-4" />
      </Button>

      <Button variant="outline" size="icon" onClick={() => handleAction("Vista de lista")}>
        <List className="h-4 w-4" />
      </Button>
    </div>
  )
}

