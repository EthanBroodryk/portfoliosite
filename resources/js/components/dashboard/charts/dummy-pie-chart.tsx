"use client"

import * as React from "react"
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  LabelList,
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
        <CardDescription>Number of job cards per technician</CardDescription>
      </CardHeader>

      <CardContent className="flex justify-center items-center w-full h-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>

            {/* Tooltip */}
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
              labelLine={true}
            >
              {/* Slice Colors */}
              {data.map((entry, index) => (
                <Cell key={index} fill={entry.color} />
              ))}

              {/* Number labels INSIDE the slice */}
              <LabelList
                dataKey="value"
                position="inside"
                fill="#ffffff"
                fontSize={14}
                fontWeight="bold"
              />

              {/* Technician names OUTSIDE the slice */}
              <LabelList
                dataKey="name"
                position="outside"
                fill="#000000"
                fontSize={12}
              />
            </Pie>

          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}