"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface ReportCountWidgetProps {
  count: number;
}

export default function ReportCountByUserWidget({ count }: ReportCountWidgetProps) {
  return (
    <Card className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
      <CardHeader>
        <CardTitle className="text-sm sm:text-base">Reports Created By User</CardTitle>
        <CardDescription className="text-xs sm:text-sm">
          Total reports created by each user
        </CardDescription>
      </CardHeader>
      <CardContent className="flex items-center justify-center text-3xl font-bold">
        {count}
      </CardContent>
    </Card>
  );
}
