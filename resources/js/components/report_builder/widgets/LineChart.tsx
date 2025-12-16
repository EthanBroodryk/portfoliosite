"use client"

import React, { useEffect, useRef, useState, useMemo } from "react"
import Chart from "chart.js/auto"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

interface LineChartProps {
  data?: {
    excelData: Record<string, any>[]
    categoryColumn: string
    valueColumns: string[]
  }
  title?: string
  description?: string
}

export default function LineChart({
  data,
  title = "Line Chart",
  description = "Interactive chart showing series data",
}: LineChartProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const chartRef = useRef<Chart | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)

  // ✅ Guard
  if (!data?.excelData?.length)
    return <div className="flex items-center justify-center w-full h-full">No data</div>

  const { excelData, categoryColumn, valueColumns } = data

  // ✅ X-axis labels
  const labels = excelData.map(row => row[categoryColumn])

  // ✅ Detect numeric value columns only
  const numericColumns = valueColumns.filter(col =>
    excelData.some(row => !isNaN(Number(row[col])))
  )

  // ✅ All series active by default
  const [activeSeries, setActiveSeries] = useState<string[]>(numericColumns)

  const toggleSeries = (name: string) =>
    setActiveSeries(prev =>
      prev.includes(name)
        ? prev.filter(s => s !== name)
        : [...prev, name]
    )

  // ✅ Build datasets
  const datasets = useMemo(() => {
    return numericColumns.map((col, i) => {
      const hue = (i * 360) / numericColumns.length
      return {
        label: col,
        data: excelData.map(row => Number(row[col] ?? 0)),
        borderColor: `hsl(${hue}, 70%, 50%)`,
        backgroundColor: `hsl(${hue}, 70%, 50%, 0.25)`,
        tension: 0.3,
        fill: false,
        pointRadius: 0,
      }
    }).filter(ds => activeSeries.includes(ds.label))
  }, [excelData, numericColumns, activeSeries])

  // ✅ Totals for toggle buttons
  const totals = useMemo(() => {
    const result: Record<string, number> = {}
    numericColumns.forEach(col => {
      result[col] = excelData.reduce(
        (sum, row) => sum + Number(row[col] ?? 0),
        0
      )
    })
    return result
  }, [excelData, numericColumns])

  // ✅ Render chart
  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return

    const canvas = canvasRef.current
    const container = containerRef.current
    const rect = container.getBoundingClientRect()
    const pixelRatio = window.devicePixelRatio || 1

    canvas.width = rect.width * pixelRatio
    canvas.height = rect.height * pixelRatio
    canvas.style.width = `${rect.width}px`
    canvas.style.height = `${rect.height}px`

    if (chartRef.current) chartRef.current.destroy()

    chartRef.current = new Chart(canvas, {
      type: "line",
      data: { labels, datasets },
      options: {
        responsive: false,
        maintainAspectRatio: false,
        plugins: {
          tooltip: { mode: "index", intersect: false },
          legend: { display: false },
        },
        scales: {
          x: { ticks: { maxRotation: 45 } },
          y: { beginAtZero: true },
        },
      },
    })

    return () => chartRef.current?.destroy()
  }, [labels, datasets])

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="flex flex-col sm:flex-row items-stretch border-b !p-0">
        <div className="flex flex-1 flex-col justify-center gap-0.5 px-2 py-1">
          <CardTitle className="text-xs font-semibold">{title}</CardTitle>
          <CardDescription className="text-[10px] leading-tight">
            {description}
          </CardDescription>
        </div>

        <div className="flex flex-wrap gap-1 px-2 py-1">
          {numericColumns.map(col => (
            <button
              key={col}
              onClick={() => toggleSeries(col)}
              className={`text-[9px] px-1.5 py-0.5 border rounded-sm ${
                activeSeries.includes(col)
                  ? "bg-muted/50 border-muted"
                  : "bg-transparent border-gray-300"
              }`}
            >
              {col}: {totals[col].toLocaleString()}
            </button>
          ))}
        </div>
      </CardHeader>

      <CardContent className="flex-1 p-0">
        <div ref={containerRef} className="w-full h-full relative">
          <canvas ref={canvasRef} />
        </div>
      </CardContent>
    </Card>
  )
}
