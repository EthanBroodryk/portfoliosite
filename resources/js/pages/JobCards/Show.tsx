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
  const isDrawing = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });

  // =============================
  // START DRAW
  // =============================
  const startDraw = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    isDrawing.current = true;

    const rect = canvas.getBoundingClientRect();

    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    lastPos.current = {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  // =============================
  // STOP DRAW
  // =============================
  const endDraw = () => {
    isDrawing.current = false;
  };

  // =============================
  // DRAW (SMOOTH + SCALED)
  // =============================
  const draw = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const rect = canvas.getBoundingClientRect();

    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const currentPos = {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };

    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "#000";

    ctx.beginPath();
    ctx.moveTo(lastPos.current.x, lastPos.current.y);
    ctx.lineTo(currentPos.x, currentPos.y);
    ctx.stroke();

    lastPos.current = currentPos;
  };

  // =============================
  // CLEAR
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
    <AppLayout
      breadcrumbs={[
        { title: "Job Cards", href: "/job-cards" },
        { title: job.job_number, href: "#" },
      ]}
    >
      <Head title={`Job ${job.job_number}`} />

      <div className="p-6 space-y-6">

        {/* ================= JOB INFO ================= */}
        <div className="p-4 border rounded-lg">
          <h2 className="text-xl font-bold mb-2">
            {job.job_number}
          </h2>

          <p><strong>Technician:</strong> {job.technician}</p>
          <p><strong>Status:</strong> {job.status}</p>
          <p><strong>Description:</strong> {job.description}</p>
        </div>

        {/* ================= SIGNATURE PAD ================= */}
        <div className="p-4 border rounded-lg">
          <h3 className="font-semibold mb-3">
            Client Signature
          </h3>

          <canvas
            ref={canvasRef}
            width={900}
            height={250}
            className="border w-full touch-none bg-white rounded-md"
            onPointerDown={startDraw}
            onPointerMove={draw}
            onPointerUp={endDraw}
            onPointerCancel={endDraw}
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

        {/* ================= SAVED SIGNATURE ================= */}
        {job.signature && (
          <div className="p-4 border rounded-lg">
            <h3 className="font-semibold mb-2">
              Saved Signature
            </h3>

            <img
              src={job.signature}
              className="border w-full rounded-md"
            />
          </div>
        )}
      </div>
    </AppLayout>
  );
}