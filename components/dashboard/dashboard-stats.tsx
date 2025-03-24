"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Package, ShoppingCart, DollarSign } from "lucide-react"

export function DashboardStats() {
  // En un caso real, estos datos vendrían de una API
  const stats = [
    {
      title: "Ventas totales",
      value: "$12,345",
      icon: DollarSign,
      description: "↗︎ 12% desde el mes pasado",
    },
    {
      title: "Productos",
      value: "120",
      icon: Package,
      description: "↗︎ 5 nuevos productos",
    },
    {
      title: "Clientes",
      value: "573",
      icon: Users,
      description: "↗︎ 7% desde el mes pasado",
    },
    {
      title: "Ventas pendientes",
      value: "9",
      icon: ShoppingCart,
      description: "↘︎ 3% desde ayer",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <Card key={index} className="border-l-4 border-l-ecosoft-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

