<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\ReportData;
use Illuminate\Support\Facades\Storage;

class ReportManagerController extends Controller
{
    public function index(Request $request)
    {
        return Inertia::render('manageReports');
    }

    public function updateReportName(Request $request)
    {
        $request->validate([
            'old_name' => 'required|string',
            'new_title' => 'required|string',
        ]);

        $oldName = $request->old_name;                  
        $newTitle = $request->new_title;                

        $extension = pathinfo($oldName, PATHINFO_EXTENSION);
        $newFileName = $newTitle . '.' . $extension;

        $report = ReportData::where('report_name', $oldName)->first();

        if (!$report) {
            return response()->json(['error' => 'Report not found'], 404);
        }

     
        $report->report_name = $newFileName;
        $report->save();

        return response()->json(['message' => 'Report name updated!']);
    }

    /**
     * DELETE A REPORT
     */
    public function deleteReport(Request $request)
    {
        $request->validate([
            'file_name' => 'required|string',
        ]);

        $fileName = $request->file_name;

        // Find DB entry
        $report = ReportData::where('report_name', $fileName)->first();

        if (!$report) {
            return response()->json(['error' => 'Report not found'], 404);
        }


        $filePath = "public/reports/" . $fileName;

        if (Storage::exists($filePath)) {
            Storage::delete($filePath);
        }

        
        $report->delete();

        return response()->json(['message' => 'Report deleted successfully']);
    }
}
