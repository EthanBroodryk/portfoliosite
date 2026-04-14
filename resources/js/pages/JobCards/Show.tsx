"use client";

import React, { useRef } from "react";
import AppLayout from "@/layouts/app-layout";
import { Head, usePage, router } from "@inertiajs/react";
import { Button } from "@/components/ui/button";

interface JobCard {
  id: number;
  job_number: string;
  technician: string;
  description: string;
  status: string;
  created_at: string;
  signature?: string;
}

interface Props {
  job: JobCard;
  [key: string]: any;
}

export default function ShowJob() {
  const { job } = usePage<Props>().props;

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  let drawing = false;

  // =============================
  // DRAW SIGNATURE
  // =============================
  const startDraw = () => (drawing = true);
  const endDraw = () => (drawing = false);

  const draw = (e: any) => {
    if (!drawing) return;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");

    if (!ctx || !canvas) return;

    const rect = canvas.getBoundingClientRect();

    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#000";

    ctx.lineTo(
      e.clientX - rect.left,
      e.clientY - rect.top
    );
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(
      e.clientX - rect.left,
      e.clientY - rect.top
    );
  };

  // =============================
  // CLEAR SIGNATURE
  // =============================
  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");

    if (ctx && canvas) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  // =============================
  // SAVE SIGNATURE
  // =============================
  const saveSignature = () => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    const signature = canvas.toDataURL("image/png");

    router.post(`/job-cards/${job.id}/sign`, {
      signature,
    });
  };

  return (
    <AppLayout breadcrumbs={[
      { title: "Job Cards", href: "/job-cards" },
      { title: job.job_number, href: "#" },
    ]}>
      <Head title={`Job ${job.job_number}`} />

      <div className="p-6 space-y-6">

        {/* JOB INFO */}
        <div className="p-4 border rounded-lg">
          <h2 className="text-xl font-bold mb-2">
            {job.job_number}
          </h2>

          <p><strong>Technician:</strong> {job.technician}</p>
          <p><strong>Status:</strong> {job.status}</p>
          <p><strong>Description:</strong> {job.description}</p>
        </div>

        {/* SIGNATURE */}
        <div className="p-4 border rounded-lg">
          <h3 className="font-semibold mb-2">
            Client Signature
          </h3>

          <canvas
            ref={canvasRef}
            width={500}
            height={200}
            className="border w-full"
            onMouseDown={startDraw}
            onMouseUp={endDraw}
            onMouseMove={draw}
          />

          <div className="flex gap-2 mt-3">
            <Button onClick={saveSignature}>
              Save Signature
            </Button>

            <Button variant="outline" onClick={clearCanvas}>
              Clear
            </Button>
          </div>
        </div>

      </div>
    </AppLayout>
  );
}