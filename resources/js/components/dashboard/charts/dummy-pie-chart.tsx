"use client"

import * as React from "react"
import { ResponsiveContainer, PieChart, Pie, Cell, Label } from "recharts"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"

const dummyData = [
  { name: "January", value: 186, color: "#6366F1" },
  { name: "February", value: 305, color: "#EC4899" },
  { name: "March", value: 237, color: "#F59E0B" },
  { name: "April", value: 173, color: "#10B981" },
  { name: "May", value: 209, color: "#3B82F6" },
]



export function DummyPieChart() {
  return (
    <Card className="flex flex-col w-full h-full">
      <CardHeader>
        <CardTitle>Branch Sales</CardTitle>
        <CardDescription>Sales for each branch</CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center items-center w-full h-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={dummyData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius="80%"
              innerRadius="40%"
              label
            >
              {dummyData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
