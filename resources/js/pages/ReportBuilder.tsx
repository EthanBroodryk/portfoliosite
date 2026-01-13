import React, { useRef } from "react";
import { usePage, Head } from "@inertiajs/react";
import ReportBuilderLayout from "@/layouts/report_builder/report-builder-layout";
import ReportBuilderCanvas from "@/components/report_builder/ReportBuilderCanvas";
import { type BreadcrumbItem } from "@/types";

// React DnD
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

// PDF / Image packages
import * as htmlToImage from "html-to-image";
import jsPDF from "jspdf";

interface ReportBuilderProps {
  fileData: {
    filename: string;
    excelData: any[];
    valueColumns: string[];
    categoryColumn: string;
  } | null;
}

export default function ReportBuilder() {
  const { fileData } = usePage().props as unknown as ReportBuilderProps;

  const canvasRef = useRef<HTMLDivElement | null>(null);

  // ✅ Export PDF function using html-to-image
  const exportPDF = async () => {
    if (!canvasRef.current) return;

    try {
      // Convert canvas to PNG
      const dataUrl = await htmlToImage.toPng(canvasRef.current, {
        cacheBust: true,
        skipFonts: true, // ⚠ ignore fonts to prevent errors
      });

      const pdf = new jsPDF("p", "mm", "a4");

      // Create image to get dimensions
      const img = new Image();
      img.src = dataUrl;
      img.onload = () => {
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (img.height * pdfWidth) / img.width;

        pdf.addImage(dataUrl, "PNG", 0, 0, pdfWidth, pdfHeight);
        pdf.save(`${fileData?.filename || "report"}.pdf`);
      };
    } catch (err) {
      console.error("PDF export failed:", err);
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <ReportBuilderLayout
        breadcrumbs={[
          { title: "Report Builder", href: "/report-builder" },
          fileData?.filename ? { title: fileData.filename } : null,
        ].filter(Boolean) as BreadcrumbItem[]}
      >
        <Head title={`Report Builder${fileData?.filename ? ` - ${fileData.filename}` : ''}`} />

        {/* Export PDF button */}
        <div className="mb-4 flex justify-end">
            <button
                onClick={exportPDF}
                className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition"
            >
                Export PDF
            </button>
        </div>


        {/* Canvas container */}
        <div
          ref={canvasRef}
          style={{
            background: "#ffffff", // plain white background
            color: "#000000",      // safe text color
            fontFamily: "Arial, sans-serif", // safe font to avoid html-to-image errors
          }}
        >
          <ReportBuilderCanvas fileData={fileData} />
        </div>
      </ReportBuilderLayout>
    </DndProvider>
  );
}
