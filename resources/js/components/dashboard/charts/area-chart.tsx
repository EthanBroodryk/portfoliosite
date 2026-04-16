"use client"

import * as React from "react"
import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

type JobDateData = {
  date: string
  pending: number
  completed: number
}

export function ChartAreaInteractive({ data }: { data: JobDateData[] }) {
  const [timeRange, setTimeRange] = React.useState("90d")

  const filteredData = React.useMemo(() => {
    const referenceDate = new Date()

    let daysToSubtract = 90
    if (timeRange === "30d") daysToSubtract = 30
    if (timeRange === "7d") daysToSubtract = 7

    const startDate = new Date(referenceDate)
    startDate.setDate(startDate.getDate() - daysToSubtract)

    return data.filter((item) => new Date(item.date) >= startDate)
  }, [data, timeRange])

  return (
    <Card className="pt-0">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1">
          <CardTitle>Job Cards Over Time</CardTitle>
          <CardDescription>
            Pending vs Completed job cards
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={filteredData}>

              <CartesianGrid vertical={false} />

              <XAxis
                dataKey="date"
                tickFormatter={(value) =>
                  new Date(value).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })
                }
              />

              <Tooltip
                labelFormatter={(value) =>
                  new Date(value).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })
                }
              />

              <Legend />

              {/* ✅ PENDING */}
              <Area
                type="monotone"
                dataKey="pending"
                stroke="#f59e0b"
                fill="#fbbf24"
                name="Pending"
              />

              {/* ✅ COMPLETED */}
              <Area
                type="monotone"
                dataKey="completed"
                stroke="#10b981"
                fill="#34d399"
                name="Completed"
              />

            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}