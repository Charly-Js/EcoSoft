"use client"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function RecentSales() {
  // En un caso real, estos datos vendrían de una API
  const sales = [
    {
      customer: "Juan Pérez",
      email: "juan@example.com",
      amount: "$250.00",
      date: "Hace 2 horas",
    },
    {
      customer: "María López",
      email: "maria@example.com",
      amount: "$150.00",
      date: "Hace 3 horas",
    },
    {
      customer: "Carlos Rodríguez",
      email: "carlos@example.com",
      amount: "$350.00",
      date: "Hace 5 horas",
    },
    {
      customer: "Ana Martínez",
      email: "ana@example.com",
      amount: "$450.00",
      date: "Hace 6 horas",
    },
    {
      customer: "Pedro Sánchez",
      email: "pedro@example.com",
      amount: "$550.00",
      date: "Hace 8 horas",
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ventas recientes</CardTitle>
        <CardDescription>Se han realizado 5 ventas hoy</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {sales.map((sale, index) => (
            <div key={index} className="flex items-center">
              <Avatar className="h-9 w-9">
                <AvatarFallback>
                  {sale.customer
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="ml-4 space-y-1">
                <p className="text-sm font-medium leading-none">{sale.customer}</p>
                <p className="text-sm text-muted-foreground">{sale.email}</p>
              </div>
              <div className="ml-auto font-medium">{sale.amount}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

