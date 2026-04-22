"use client";

import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { router } from "@inertiajs/react";

export default function SignaturePad({
  jobId,
  existingSignature,
  isCompleted = false,
  onChange,
  disableSignature = false,
}: {
  jobId: number;
  existingSignature?: string;
  isCompleted?: boolean;
  onChange?: (hasSignature: boolean) => void;
  disableSignature?: boolean; 
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDrawing = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });

  const [isSigning, setIsSigning] = useState(false);

  // =============================
  // LOAD SIGNATURE (REUSABLE)
  // =============================
  const loadSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (!existingSignature) {
      onChange?.(false);
      return;
    }

    const img = new Image();
    img.src = `/storage/${existingSignature}`;

    img.onload = () => {
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      onChange?.(true);
    };
  };

  // =============================
  // INITIAL LOAD
  // =============================
  useEffect(() => {
    loadSignature();
  }, [existingSignature]);

  // =============================
  // DRAWING
  // =============================
  const startDraw = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (disableSignature) return;
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

    if (disableSignature) return; 
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

    onChange?.(true);
  };

  // =============================
  // CLEAR
  // =============================
  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");

    if (ctx && canvas) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      onChange?.(false);
    }
  };

  // =============================
  // CANCEL (🔥 FIXED)
  // =============================
  const handleCancel = () => {
    setIsSigning(false);
    loadSignature(); // 🔥 restore original
  };

  // =============================
  // CHECK EMPTY
  // =============================
  const isCanvasEmpty = (canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext("2d");
    if (!ctx) return true;

    const pixelBuffer = new Uint32Array(
      ctx.getImageData(0, 0, canvas.width, canvas.height).data.buffer
    );

    return !pixelBuffer.some((color) => color !== 0);
  };

  // =============================
  // SAVE
  // =============================
  const saveSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

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
        onChange?.(true);
        router.reload({ only: ["job"] });
      },
    });
  };

  return (
    <div className="p-4 border rounded-lg space-y-3">
      <h3 className="font-semibold">Client Signature</h3>

      <p className="text-xs text-muted-foreground">
        {isSigning ? "Signing enabled" : "Signature locked"}
      </p>

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

      <div className="flex gap-2 mt-3">
        {!isCompleted ? (
           !isSigning ? (
            !disableSignature && (   // 👈 hide button completely
             <Button onClick={() => setIsSigning(true)}>
                ✍️ Sign
             </Button>
             )
        ) : (
            <>
              <Button onClick={saveSignature}>Save Signature</Button>
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button variant="outline" onClick={clearCanvas}>
                Clear
              </Button>
            </>
          )
        ) : (
          <p className="text-green-600 font-semibold text-sm">
            ✓ Job Completed (Signature Locked)
          </p>
        )}
      </div>
    </div>
  );
}