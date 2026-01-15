import React, { useRef } from "react";
import { usePage, Head } from "@inertiajs/react";
import ReportBuilderLayout from "@/layouts/report_builder/report-builder-layout";
import ReportBuilderCanvas from "@/components/report_builder/ReportBuilderCanvas";
import { type BreadcrumbItem } from "@/types";
import axios from "axios";

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
    layout: any[];        
  } | null;
}


export default function ReportBuilder() {
  const { fileData } = usePage().props as unknown as ReportBuilderProps;

  const canvasRef = useRef<HTMLDivElement | null>(null);

  
  const exportPDF = async () => {
    if (!canvasRef.current) return;

    try {
  
      const dataUrl = await htmlToImage.toPng(canvasRef.current, {
        cacheBust: true,
        skipFonts: true, 
      });

      const pdf = new jsPDF("p", "mm", "a4");

      
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




const saveReport = async () => {
  if (!canvasRef.current) return;

  if (!fileData) {
    alert("No report data to save!");
    return;
  }

 
  const storageKey = fileData.filename
    ? `report_builder_layout_v1_${fileData.filename}`
    : "report_builder_layout_v1";

  const rawLayout = localStorage.getItem(storageKey);

  if (!rawLayout) {
    alert("Nothing to save! Make sure you've added widgets.");
    return;
  }

  let layout: any[] = [];

  try {
    layout = JSON.parse(rawLayout);
    if (!Array.isArray(layout)) layout = [];
  } catch (err) {
    console.error("Failed to parse layout:", err);
    alert("Layout data is invalid!");
    return;
  }

  try {
    await axios.post("/save-report", {
      filename: fileData.filename,
      layout: layout,               
      fileData: {
        excelData: fileData.excelData,
        valueColumns: fileData.valueColumns,
        categoryColumn: fileData.categoryColumn,
        file: fileData.filename, 
      },
    });

    alert("Report saved successfully!");
  } catch (err: any) {
    console.error("Failed to save report:", err);

    const msg = err?.response?.data?.message || "Failed to save report.";
    alert(msg);
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

        {/* Buttons container */}
            <div className="mb-4 flex justify-end gap-2">
              {/* Export PDF */}
              <button
                onClick={exportPDF}
                className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition"
              >
                Export PDF
              </button>

              {/* Save button */}
              <button
                onClick={saveReport}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500 transition"
              >
                Save
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
          <ReportBuilderCanvas
            fileData={fileData}
            layout={fileData?.layout || []}
          />


        </div>
      </ReportBuilderLayout>
    </DndProvider>
  );
}
