<?php

namespace Database\Factories;

use App\Models\SaleItem;
use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;

class SaleItemFactory extends Factory
{
    protected $model = SaleItem::class;

    public function definition()
    {
        $product = Product::inRandomOrder()->first();

        return [
            'product_id' => $product->id,
            'quantity' => $this->faker->numberBetween(1, 5),
            'unit_price' => $product->sell_price,
            'total' => fn(array $attributes) => $attributes['unit_price'] * $attributes['quantity'],
        ];
    }
}
