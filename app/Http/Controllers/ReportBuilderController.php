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

            // Already an array because of casting
            $report_data = $matchedReport->report_json_data;

            $file           = $report_data['file'];
            $excelData      = $report_data['excelData'];
            $valueColumns   = $report_data['valueColumns'];
            $categoryColumn = $report_data['categoryColumn'];

            return Inertia::render('ReportBuilder', [
                'fileData' => [
                    'filename'        => $file,
                    'excelData'       => $excelData,
                    'valueColumns'    => $valueColumns,
                    'categoryColumn'  => $categoryColumn,
                ],
                'error' => null,
            ]);
        }









}
