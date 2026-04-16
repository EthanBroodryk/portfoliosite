"use client"

import * as React from "react"
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from "recharts"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"

type DataItem = {
  name: string
  value: number
  color: string
}

export function DummyPieChart({ data }: { data: DataItem[] }) {
  return (
    <Card className="flex flex-col w-full h-full">
      <CardHeader>
        <CardTitle>Job Cards Per Technician</CardTitle>
        <CardDescription>Hover to see technician</CardDescription>
      </CardHeader>

      <CardContent className="flex justify-center items-center w-full h-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>

            {/* ✅ TOOLTIP (THIS SHOWS NAME ON HOVER) */}
            <Tooltip
              formatter={(value: number, name: string) => [
                `${value} jobs`,
                name,
              ]}
            />

            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius="80%"
              innerRadius="40%"
            >
              {data.map((entry, index) => (
                <Cell key={index} fill={entry.color} />
              ))}
            </Pie>

          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}