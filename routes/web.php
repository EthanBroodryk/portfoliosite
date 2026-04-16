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
use App\Http\Controllers\SalesController;
use App\Http\Controllers\StockController;
use App\Http\Controllers\SuppliersController;
use App\Http\Controllers\ReceivingController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\BranchesController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\QuoteController;
use App\Http\Controllers\JobCardController;
use App\Models\JobCardPhoto;
use App\Models\JobCard;

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
// Route::get('/', function () {
//     return Inertia::render('welcome', [
//         'canRegister' => Features::enabled(Features::registration()),
//     ]);
// })->name('home');
Route::get('/', function () {
    return redirect()->route('login');
})->name('home');

// ---------------------------
// Authenticated Routes
// ---------------------------
Route::middleware(['auth', 'verified'])->group(function () {

    // ---------------------------
    // Dashboard
    // ---------------------------

    Route::get('dashboard', function () {

        $jobCardsByUser = JobCard::selectRaw('technician, COUNT(*) as count')
        ->groupBy('technician')
        ->get()
        ->map(function ($row) {
            return [
                'name' => $row->technician ?? 'Unknown',
                'value' => $row->count,
                'color' => sprintf('#%06X', mt_rand(0, 0xFFFFFF)),
            ];
        });

        return Inertia::render('dashboard', [
            'jobCardCount' => JobCard::count(), // already done
            'completedJobCards' => JobCard::where('status', 'completed')->count(),
            'jobCardsByUser' => $jobCardsByUser,
        ]);
    })->name('dashboard');
    // ---------------------------
    // Job Cards
    // ---------------------------
    Route::prefix('job-cards')->name('jobcards.')->group(function () {
        Route::get('/{jobCard}/print', [JobCardController::class, 'print']);
        Route::get('/', [JobCardController::class, 'index'])->name('index');
        Route::get('/create', [JobCardController::class, 'create'])->name('create');
        Route::post('/', [JobCardController::class, 'store'])->name('store');
        Route::get('/my', [JobCardController::class, 'myJobs'])->name('my');
        Route::get('/all', [JobCardController::class, 'all'])->name('all');
        Route::get('/{jobCard}', [JobCardController::class, 'show'])->name('show');
        Route::post('/{jobCard}/sign', [JobCardController::class, 'sign']);
        Route::post('/{jobCard}/before-photos', [JobCardController::class, 'storeBeforePhotos']);
        Route::post('/{jobCard}/after-photos', [JobCardController::class, 'storeAfterPhotos']);
        Route::delete('/photos/{photo}', [JobCardController::class, 'deletePhoto']);
        Route::put('/{jobCard}', [JobCardController::class, 'update'])->name('update');
        Route::post('/{job}/complete', [JobCardController::class, 'complete'])->name('complete');
    });
// ---------------------------
    // Branches
    // ---------------------------

    Route::prefix('admin')->group(function () {
        Route::get('/branches', [BranchesController::class, 'index'])->name('admin.branches.index');
        Route::post('/branches/store', [BranchesController::class, 'store'])->name('admin.branches.store');
        Route::put('/branches/{branch}', [BranchesController::class, 'update'])->name('admin.branches.update');
    });


    // ---------------------------
    // Users
    // ---------------------------
    Route::prefix('admin/users')->name('admin.users.')->group(function () {
        Route::get('/', [UserController::class, 'index'])->name('index');
        Route::get('/create', [UserController::class, 'create'])->name('create');
        Route::post('/', [UserController::class, 'store'])->name('store');
        Route::get('/{user}/edit', [UserController::class, 'edit'])->name('edit');
        Route::put('/{user}', [UserController::class, 'update'])->name('update');
        Route::delete('/{user}', [UserController::class, 'destroy'])->name('destroy');
    });


    // ---------------------------
    // Stock
    // ---------------------------
    Route::get('/products/find-by-barcode/{barcode}', [ProductController::class, 'findByBarcode']);
    Route::get('/stock', [StockController::class, 'index']);
    Route::get('/stock/create', [StockController::class, 'create']);
    Route::post('/stock', [StockController::class, 'store']);
    Route::get('/stock/product/{id}', [StockController::class, 'productStock']);
    Route::put('/stock/{stock}', [StockController::class, 'update']);
    Route::post('/stock/transfer', [StockController::class, 'transfer']);

    // ---------------------------
    // Receiving
    // ---------------------------

    Route::get('/stock/receiving',[ReceivingController::class,'index']);
    Route::get('/products/find-by-barcode/{barcode}', [ReceivingController::class, 'findProductByBarcode']); 
    Route::post('/stock/receiving/store', [ReceivingController::class, 'store']);

    // ---------------------------
    // Suppliers
    // ---------------------------

    Route::get('/suppliers',[SuppliersController::class,'index']);
    Route::post('/suppliers',[SuppliersController::class,'store']);





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
        Route::post('/clear', [PosController::class, 'clearCart'])->name('pos.clear');//clear cart


        Route::post('/checkout', [PosController::class, 'checkout'])->name('pos.checkout');//checkout


    // ---------------------------
    // POS Sales
    // ---------------------------

    Route::get('/sales', [SalesController::class, 'Index'])->name('pos.sales');
    Route::get('/sales/{sale}/items', [SalesController::class, 'items']);//sale items

    });


    // ---------------------------
    // Customer Management
    // ---------------------------
Route::prefix('customer')->group(function () {
    Route::get('/add',[CustomerController::class,'addCustomer']);
    Route::post('/store',[CustomerController::class,'store']);
    Route::get('/search',[CustomerController::class,'search']); 
    Route::get('/quote',[QuoteController::class,'index']);
    Route::get('/searchCustomer',[QuoteController::class,'searchCustomer']); 
    Route::get('/searchProduct',[QuoteController::class,'searchProduct']); 
});




});

require __DIR__ . '/settings.php';
