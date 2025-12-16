"use client"

import React, { useEffect, useRef, useState, useMemo } from "react"
import Chart from "chart.js/auto"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"

interface PieChartData {
  excelData: Record<string, any>[]
  categoryColumn: string
  valueColumns: string[]
}

interface PieChartProps {
  data?: PieChartData
  width?: number
  height?: number
}

export default function PieChart({
  data,
  width = 300,
  height = 300,
}: PieChartProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const chartRef = useRef<Chart | null>(null)

  if (!data?.excelData?.length)
    return (
      <div style={{ width, height }} className="flex items-center justify-center">
        No data
      </div>
    )

  const { excelData, categoryColumn, valueColumns } = data

  // ✅ Numeric columns only
  const numericColumns = valueColumns.filter(col =>
    excelData.some(row => !isNaN(Number(row[col])))
  )

  // ✅ One active column at a time (Pie best practice)
  const [activeColumn, setActiveColumn] = useState<string>(
    numericColumns[0]
  )

  // ✅ Aggregate by category (SUM)
  const aggregated = useMemo(() => {
    const map = new Map<string, number>()

    excelData.forEach(row => {
      const label = String(row[categoryColumn])
      const value = Number(row[activeColumn] ?? 0)
      map.set(label, (map.get(label) ?? 0) + value)
    })

    return {
      labels: Array.from(map.keys()),
      values: Array.from(map.values()),
    }
  }, [excelData, categoryColumn, activeColumn])

  const chartData = useMemo(
    () => ({
      labels: aggregated.labels,
      datasets: [
        {
          label: activeColumn,
          data: aggregated.values,
          backgroundColor: aggregated.labels.map(
            (_: any, i: number) => `hsla(${(i * 360) / aggregated.labels.length}, 70%, 50%, 0.8)`
          ),
        },
      ],
    }),
    [aggregated, activeColumn]
  )

  useEffect(() => {
    if (!canvasRef.current) return
    if (chartRef.current) chartRef.current.destroy()

    chartRef.current = new Chart(canvasRef.current, {
      type: "pie",
      data: chartData,
      options: {
        responsive: false,
        plugins: {
          legend: { position: "top" },
          tooltip: { callbacks: {
            label: ctx => `${ctx.label}: ${ctx.parsed.toLocaleString()}`
          }},
        },
      },
    })

    return () => chartRef.current?.destroy()
  }, [chartData])

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <CardTitle>Pie Chart</CardTitle>
          <CardDescription>
            Distribution by {categoryColumn}
          </CardDescription>
        </div>

        {/* Column selector */}
        <div className="flex flex-wrap gap-2 mt-2 sm:mt-0">
          {numericColumns.map(col => (
            <button
              key={col}
              onClick={() => setActiveColumn(col)}
              className={`px-3 py-1 text-sm rounded border ${
                activeColumn === col
                  ? "bg-muted text-muted-foreground border-muted"
                  : "bg-transparent text-gray-700 border-gray-300"
              }`}
            >
              {col}
            </button>
          ))}
        </div>
      </CardHeader>

      <CardContent className="flex justify-center items-center p-6">
        <canvas ref={canvasRef} width={width} height={height} />
      </CardContent>
    </Card>
  )
}
