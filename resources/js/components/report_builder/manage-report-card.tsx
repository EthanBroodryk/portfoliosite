import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface Report {
  title: string;
  href: string;
  icon: string;
}

const ITEMS_PER_PAGE = 5;

export default function ManageReportCard() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch reports on mount
  useEffect(() => {
    fetchReports();
  }, []);

  async function fetchReports() {
    setLoading(true);
    try {
      const response = await axios.get("/api/reports");
      setReports(response.data);
    } catch (err) {
      console.error("Error fetching reports:", err);
    } finally {
      setLoading(false);
    }
  }

  const totalPages = Math.ceil(reports.length / ITEMS_PER_PAGE);

  const currentReports = reports.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Delete a report
  async function deleteReport(index: number) {
    const report = currentReports[index];
    try {
      await axios.delete(report.href);
      setReports((prev) =>
        prev.filter((r) => r.href !== report.href)
      );
    } catch (err) {
      console.error("Error deleting report:", err);
    }
  }

  // Update title locally
  function updateReportTitle(index: number, newTitle: string) {
    const globalIndex = (currentPage - 1) * ITEMS_PER_PAGE + index;
    setReports((prev) =>
      prev.map((r, i) => (i === globalIndex ? { ...r, title: newTitle } : r))
    );
  }

  // Save title to server
  async function saveReportTitle(index: number) {
    const globalIndex = (currentPage - 1) * ITEMS_PER_PAGE + index;
    const report = reports[globalIndex];
    try {
      await axios.put(report.href, { title: report.title });
      alert("Report title updated!");
    } catch (err) {
      console.error("Error updating report title:", err);
    }
  }

  if (loading) return <p>Loading reports...</p>;

  return (
    <Card className="w-full max-w-md mx-auto mt-8">
      <CardHeader>
        <CardTitle>Manage Reports</CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col gap-4">
        {currentReports.length === 0 && <p>No reports available.</p>}

        {currentReports.map((report, index) => (
          <div key={index} className="flex items-center gap-2">
            <Input
              value={report.title}
              onChange={(e) => updateReportTitle(index, e.target.value)}
            />
            <Button
              onClick={() => saveReportTitle(index)}
              className="bg-green-500 hover:bg-green-600"
            >
              Save
            </Button>
            <Button
              onClick={() => deleteReport(index)}
              variant="outline"
              className="bg-red-500 text-white hover:bg-red-600"
            >
              Delete
            </Button>
          </div>
        ))}
      </CardContent>

      {/* Pagination */}
      <div className="flex justify-center gap-2 p-4">
        <Button
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          disabled={currentPage === 1}
        >
          Previous
        </Button>
        <span className="flex items-center px-2">
          Page {currentPage} of {totalPages}
        </span>
        <Button
          onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          disabled={currentPage === totalPages}
        >
          Next
        </Button>
      </div>
    </Card>
  );
}
