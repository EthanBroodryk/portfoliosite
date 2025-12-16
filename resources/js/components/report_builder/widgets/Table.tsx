"use client"

import * as React from "react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"

interface TableData {
  excelData: Record<string, any>[]
  categoryColumn: string
  valueColumns: string[]
}

interface Props {
  data?: TableData
  width?: number
  height?: number
}

export default function Table({ data, width = 300, height = 200 }: Props) {
  if (!data?.excelData?.length)
    return (
      <div style={{ width, height }} className="flex items-center justify-center">
        No data
      </div>
    )

  const { excelData, categoryColumn, valueColumns } = data

  // ✅ Headers from object keys
  const headers = Object.keys(excelData[0])

  // ✅ Numeric columns only
  const numericColumns = valueColumns.filter(col =>
    excelData.some(row => !isNaN(Number(row[col])))
  )

  // ✅ Row identifiers (use category column)
  const rowNames = excelData.map(row => String(row[categoryColumn]))

  const [activeRows, setActiveRows] = React.useState<string[]>([...rowNames])

  const toggleRow = (name: string) => {
    setActiveRows(prev =>
      prev.includes(name)
        ? prev.filter(r => r !== name)
        : [...prev, name]
    )
  }

  // ✅ Row totals (numeric columns only)
  const rowTotals = React.useMemo(() => {
    const result: Record<string, number> = {}

    excelData.forEach((row, i) => {
      const name = rowNames[i]
      result[name] = numericColumns.reduce(
        (sum, col) => sum + Number(row[col] ?? 0),
        0
      )
    })

    return result
  }, [excelData, numericColumns, rowNames])

  // ✅ Column totals (numeric columns only, active rows only)
  const columnTotals = React.useMemo(() => {
    return headers.map(header => {
      if (!numericColumns.includes(header)) return ""

      return excelData.reduce((sum, row, i) => {
        const name = rowNames[i]
        if (!activeRows.includes(name)) return sum
        return sum + Number(row[header] ?? 0)
      }, 0)
    })
  }, [excelData, headers, numericColumns, rowNames, activeRows])

  return (
    <Card className="w-full overflow-auto">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <CardTitle>Data Table</CardTitle>
          <CardDescription>
            Showing active rows and totals
          </CardDescription>
        </div>

        {/* Row toggles */}
        <div className="flex flex-wrap gap-2 mt-2 sm:mt-0">
          {rowNames.map(name => (
            <button
              key={name}
              onClick={() => toggleRow(name)}
              className={`px-3 py-1 text-sm rounded border ${
                activeRows.includes(name)
                  ? "bg-muted text-muted-foreground border-muted"
                  : "bg-transparent text-gray-700 border-gray-300"
              }`}
            >
              {name}: {rowTotals[name].toLocaleString()}
            </button>
          ))}
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="min-w-full overflow-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <caption className="sr-only">A summary of your dataset.</caption>

            <thead className="bg-gray-50">
              <tr>
                {headers.map(header => (
                  <th
                    key={header}
                    className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {excelData.map((row, i) => {
                const name = rowNames[i]
                if (!activeRows.includes(name)) return null

                return (
                  <tr
                    key={i}
                    className={i % 2 === 0 ? "bg-gray-50" : "bg-white"}
                  >
                    {headers.map(header => (
                      <td
                        key={header}
                        className="px-4 py-2 whitespace-nowrap text-sm text-gray-900"
                      >
                        {row[header] ?? ""}
                      </td>
                    ))}
                  </tr>
                )
              })}
            </tbody>

            <tfoot className="bg-gray-100">
              <tr>
                {columnTotals.map((total, idx) => (
                  <td
                    key={idx}
                    className="px-4 py-2 whitespace-nowrap text-sm font-semibold text-gray-900"
                  >
                    {typeof total === "number" ? total.toLocaleString() : ""}
                  </td>
                ))}
              </tr>
            </tfoot>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
