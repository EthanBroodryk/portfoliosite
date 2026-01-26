<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Laravel\Fortify\Features;
use Illuminate\Http\Request;
use App\Http\Controllers\ReportBuilderController;
use App\Http\Controllers\DataController;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Mail;
use App\Mail\ContactFormMail;
use App\Http\Controllers\ContactFormController;
use App\Http\Controllers\ReportManagerController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\PosController;
use App\Events\BarcodeScanned;

// ---------------------------
// Contact Form
// ---------------------------
Route::post('/contact', [ContactFormController::class, 'send']);

// ---------------------------
// Data Routes
// ---------------------------
Route::prefix('data')->group(function () {
    Route::get('/', [DataController::class, 'importData'])->name('data.index');
    Route::post('/import-data/upload', [DataController::class, 'upload'])->name('data.store');
    Route::get('/import-data/data/{filename}', [DataController::class, 'getData']);
    Route::post('/import-data/save-mapping', [DataController::class, 'saveMapping']);
});

Route::get('/api/reports', [DataController::class, 'getfiles']);

// ---------------------------
// Report Builder Routes
// ---------------------------
Route::prefix('report-builder')->name('report.')->group(function () {
    Route::get('/', [ReportBuilderController::class, 'index'])->name('builder');
    Route::post('/upload', [ReportBuilderController::class, 'upload'])->name('builder.upload');
    Route::get('/files/{filename}', [ReportBuilderController::class, 'show'])->name('builder.show');
});

// ---------------------------
// Home
// ---------------------------
Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

// ---------------------------
// Authenticated Routes
// ---------------------------
Route::middleware(['auth', 'verified'])->group(function () {

    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    // Manage Reports
    Route::get('/manage-reports', [ReportManagerController::class, 'index'])->name('manage.reports');
    Route::put('/updates-report-name', [ReportManagerController::class, 'updateReportName']);
    Route::delete('/delete-report', [ReportManagerController::class, 'deleteReport']);
    Route::post('/save-report', [ReportBuilderController::class, 'saveReport']);

    // Inventory / Products
    Route::prefix('products')->group(function () {
        Route::get('/', [ProductController::class, 'index'])->name('products.index');
        Route::get('/create', [ProductController::class, 'create'])->name('products.create');
        Route::post('/', [ProductController::class, 'store'])->name('products.store');
        Route::get('/{product}/edit', [ProductController::class, 'edit'])->name('products.edit');
        Route::put('/{product}', [ProductController::class, 'update'])->name('products.update');
        Route::delete('/{product}', [ProductController::class, 'destroy'])->name('products.destroy');
    });

    // ---------------------------
    // POS Routes
    // ---------------------------
    Route::prefix('pos')->group(function () {
        Route::get('/create', [PosController::class, 'create'])->name('pos.create');
        Route::post('/sale', [PosController::class, 'store'])->name('pos.store');

        // Scan / Remove product (broadcast style for polling)
        Route::post('/scan', [PosController::class, 'scanBarcode'])->name('pos.scan'); // POST /pos/scan
        Route::post('/remove', [PosController::class, 'removeFromCart'])->name('pos.remove'); // POST /pos/remove
        Route::post('/increase', [PosController::class, 'increaseQty']);//increase individual quantity
        Route::post('/decrease', [PosController::class, 'decreaseQty']); //decrease individual quantity
        Route::get('/latest-cart', [PosController::class, 'getCart'])->name('pos.latest'); // GET /pos/latest-cart for polling
    });
});

require __DIR__ . '/settings.php';
