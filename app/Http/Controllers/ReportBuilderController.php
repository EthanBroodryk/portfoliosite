<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;
use App\Models\ReportData;

class ReportBuilderController extends Controller
{



public function index(Request $request)
{
    $fileName = $request->query('file');

    $matchedReport = ReportData::where('report_name', 'LIKE', $fileName . '.%')->firstOrFail();

    // Already cast to array
    $report_data = $matchedReport->report_json_data;

    return Inertia::render('ReportBuilder', [
        'fileData' => [
            'filename'        => $report_data['file'],
            'excelData'       => $report_data['excelData'],
            'valueColumns'    => $report_data['valueColumns'],
            'categoryColumn'  => $report_data['categoryColumn'],
            'layout'          => $report_data['layout'], 
        ],
        'error' => null,
    ]);
}



   public function saveReport(Request $request)
{
    $validated = $request->validate([
        'filename'   => 'required|string',
        'layout'     => 'required|array',
        'fileData'   => 'required|array',
    ]);

    $reportJson = [
        'file'           => $validated['filename'],
        'layout'         => $validated['layout'],
        'excelData'      => $validated['fileData']['excelData'],
        'valueColumns'   => $validated['fileData']['valueColumns'],
        'categoryColumn' => $validated['fileData']['categoryColumn'],
    ];

    // Find the original report entry by its *report_name*
    $saved = ReportData::updateOrCreate(
        ['report_name' => $validated['filename']],
        ['report_json_data' => $reportJson] // DO NOT json_encode → casting handles it
    );

    return response()->json([
        'success' => true,
        'message' => 'Report saved successfully',
        'data'    => $saved
    ]);
}









}
