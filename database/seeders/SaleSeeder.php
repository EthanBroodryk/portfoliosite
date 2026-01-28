<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Sale;
use App\Models\SaleItem;
use App\Models\Product;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class SaleSeeder extends Seeder
{
    public function run()
    {
        // Disable foreign key checks temporarily
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');

        // Clear old data in correct order
        SaleItem::truncate();
        Sale::truncate();

        // Re-enable foreign key checks
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        // Get users and products
        $users = User::all();
        $products = Product::all();

        if ($users->isEmpty() || $products->isEmpty()) {
            $this->command->info("No users or products found. Seeder skipped.");
            return;
        }

        for ($i = 1; $i <= 10000; $i++) {
            $user = $users->random();

            $subtotal = rand(5000, 200000) / 100;
            $tax = round($subtotal * 0.15, 2);
            $discount = rand(0, 20000) / 100;
            $total = $subtotal + $tax - $discount;

            $sale = Sale::create([
                'invoice_number' => 'INV-' . str_pad($i, 6, '0', STR_PAD_LEFT),
                'user_id' => $user->id,
                'customer_id' => null,
                'subtotal' => $subtotal,
                'tax' => $tax,
                'discount' => $discount,
                'total' => $total,
                'amount_received' => $total,
                'change_due' => 0,
                'payment_method' => ['cash','card','eft'][array_rand(['cash','card','eft'])],
                'status' => ['completed','pending','cancelled'][array_rand(['completed','pending','cancelled'])],
                'note' => "Auto-generated sale $i",
            ]);

            $itemsCount = rand(1,5);
            for ($j = 0; $j < $itemsCount; $j++) {
                $product = $products->random();
                $quantity = rand(1,10);
                $unitPrice = $product->sell_price;
                $totalPrice = round($unitPrice * $quantity, 2);

                SaleItem::create([
                    'sale_id' => $sale->id,
                    'product_id' => $product->id,
                    'quantity' => $quantity,
                    'unit_price' => $unitPrice,
                    'total' => $totalPrice,
                ]);
            }

            if ($i % 500 == 0) {
                $this->command->info("Created $i sales...");
            }
        }

        $this->command->info("10,000 sales seeded successfully!");
    }
}
