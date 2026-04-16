"use client";

import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { router } from "@inertiajs/react";

export default function SignaturePad({
  jobId,
  existingSignature,
  isCompleted = false,
}: {
  jobId: number;
  existingSignature?: string;
  isCompleted?: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDrawing = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });

  const [isSigning, setIsSigning] = useState(false);

  // =============================
  // LOAD EXISTING SIGNATURE (VIEW MODE ONLY)
  // =============================
  useEffect(() => {
    if (!existingSignature) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.src = `/storage/${existingSignature}`;

    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    };
  }, [existingSignature]);

  // =============================
  // START DRAW (ONLY WHEN SIGNING ENABLED)
  // =============================
  const startDraw = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isSigning) return;

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

  const endDraw = () => {
    isDrawing.current = false;
  };

  const draw = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isSigning || !isDrawing.current) return;

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
  // SAVE
  // =============================
const saveSignature = () => {
  const canvas = canvasRef.current;
  if (!canvas) return;

  // 🚫 BLOCK EMPTY SIGNATURE
  if (isCanvasEmpty(canvas)) {
    alert("Please provide a signature before saving.");
    return;
  }

  const signature = canvas.toDataURL("image/png");

  router.post(`/job-cards/${jobId}/sign`, {
    signature,
  }, {
    onSuccess: () => {
      setIsSigning(false);
      router.reload({ only: ["job"] });
    },
  });
};

const isCanvasEmpty = (canvas: HTMLCanvasElement) => {
  const ctx = canvas.getContext("2d");
  if (!ctx) return true;

  const pixelBuffer = new Uint32Array(
    ctx.getImageData(0, 0, canvas.width, canvas.height).data.buffer
  );

  return !pixelBuffer.some((color) => color !== 0);
};



  return (
    <div className="p-4 border rounded-lg space-y-3">

      <h3 className="font-semibold">Client Signature</h3>

      {/* STATUS TEXT */}
      <p className="text-xs text-muted-foreground">
        {isSigning ? "Signing enabled" : "Signature locked"}
      </p>

      {/* CANVAS */}
      <canvas
        ref={canvasRef}
        width={900}
        height={250}
        className={`border w-full touch-none bg-white rounded-md ${
          isSigning ? "cursor-crosshair" : "cursor-not-allowed"
        }`}
        onPointerDown={startDraw}
        onPointerMove={draw}
        onPointerUp={endDraw}
        onPointerCancel={endDraw}
      />

      {/* BUTTONS */}
   {/* BUTTONS */}
    <div className="flex gap-2 mt-3">

      {/* ✅ IF COMPLETED → SHOW LOCK MESSAGE */}
      {isCompleted ? (
        <p className="text-green-600 font-semibold text-sm">
          ✓ Job Completed (Signature Locked)
        </p>
      ) : !isSigning ? (
        <Button onClick={() => setIsSigning(true)}>
          ✍️ Sign
        </Button>
      ) : (
        <>
          <Button onClick={saveSignature}>
            Save Signature
          </Button>

          <Button variant="outline" onClick={() => setIsSigning(false)}>
            Cancel
          </Button>

          <Button variant="outline" onClick={clearCanvas}>
            Clear
          </Button>
        </>
      )}

    </div>
    </div>
  );
}