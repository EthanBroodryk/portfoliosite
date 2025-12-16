"use client"

import * as React from "react"

export type ChartConfig = Record<string, { label: string; color?: string }>

export function ChartContainer({
  children,
  config,
  className,
  id,
}: {
  children: React.ReactNode
  config: ChartConfig
  className?: string
  id?: string
}) {
  return <div id={id} className={className}>{children}</div>
}

export function ChartStyle({
  id,
  config,
}: {
  id: string
  config: ChartConfig
}) {
  return null
}

export function ChartTooltip({
  content,
  cursor,
}: {
  content: React.ReactNode
  cursor?: boolean
}) {
  return <>{content}</>
}

export function ChartTooltipContent({
  hideLabel,
}: {
  hideLabel?: boolean
}) {
  return <>{hideLabel ? null : "Tooltip"}</>
}

export function ChartLegend({ content }: { content: React.ReactNode }) {
  return <>{content}</>
}

export function ChartLegendContent() {
  return <>Legend</>
}
