"use client"

import * as React from "react"
import { Bar } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

interface BarChartData {
  excelData: Record<string, any>[]
  categoryColumn: string
  valueColumns: string[]
}

interface Props {
  data?: BarChartData
  width?: number
  height?: number
}

export default function BarChart({ data }: Props) {
  if (!data?.excelData?.length) return <p>No data</p>

  const { excelData, categoryColumn, valueColumns } = data

  // ✅ X-axis labels
  const labels = excelData.map(row => row[categoryColumn])

  // ✅ Numeric columns only
  const numericColumns = valueColumns.filter(col =>
    excelData.some(row => !isNaN(Number(row[col])))
  )

  // ✅ All series active by default
  const [activeSeries, setActiveSeries] = React.useState<string[]>(numericColumns)

  const toggleSeries = (name: string) => {
    setActiveSeries(prev =>
      prev.includes(name)
        ? prev.filter(s => s !== name)
        : [...prev, name]
    )
  }

  // ✅ Totals per column
  const totals = React.useMemo(() => {
    const result: Record<string, number> = {}
    numericColumns.forEach(col => {
      result[col] = excelData.reduce(
        (sum, row) => sum + Number(row[col] ?? 0),
        0
      )
    })
    return result
  }, [excelData, numericColumns])

  // ✅ Chart data
  const chartData = React.useMemo(() => {
    return {
      labels,
      datasets: numericColumns
        .map((col, i) => ({
          label: col,
          data: excelData.map(row => Number(row[col] ?? 0)),
          backgroundColor: `hsl(${(i * 360) / numericColumns.length}, 70%, 50%)`,
        }))
        .filter(ds => activeSeries.includes(ds.label)),
    }
  }, [labels, excelData, numericColumns, activeSeries])

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { mode: "index" as const, intersect: false },
    },
    scales: {
      x: { ticks: { maxRotation: 45, minRotation: 0 } },
      y: { beginAtZero: true },
    },
  }

  return (
    <Card className="py-0 h-full w-full flex flex-col">
      <CardHeader className="flex flex-col items-stretch border-b !p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-0.5 px-3 py-2">
          <CardTitle className="text-xs sm:text-sm">Bar Chart</CardTitle>
          <CardDescription className="text-[10px] sm:text-xs">
            Totals per series
          </CardDescription>
        </div>

        {/* Series toggles */}
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

      <CardContent className="p-1 flex-1">
        <div className="w-full h-full relative" style={{ minHeight: 40 }}>
          <Bar data={chartData} options={options} />
        </div>
      </CardContent>
    </Card>
  )
}
