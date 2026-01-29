<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class ProductFactory extends Factory
{
    public function definition(): array
    {
        static $skuCounter = 1;

        // SKU format: SKU-00001
        $sku = 'SKU-' . str_pad($skuCounter++, 5, '0', STR_PAD_LEFT);

        // Realistic product names
        $productNames = [
            'Blue Pen', 'Red Marker', 'Notebook A5', 'USB Cable', 'HDMI Cable',
            'Bluetooth Speaker', 'Wireless Mouse', 'Laptop Bag', 'LED Bulb',
            'Water Bottle', 'Steel Hammer', 'Shampoo 500ml', 'Soccer Ball',
            'Coffee Mug', 'Phone Charger', 'Extension Cord', 'Toothpaste 100ml',
            'Running Shoes', 'Desk Lamp', 'T-shirt Large'
        ];

        $cost = fake()->randomFloat(2, 5, 200);

        return [
            'sku'            => $sku,
            'name'           => fake()->randomElement($productNames),
            'description'    => fake()->sentence(),
            'category_id'    => fake()->numberBetween(1, 20), // RANDOM CATEGORY ID
            'barcode'        => fake()->numerify('#############'), // 13 random digits
            'unit'           => fake()->randomElement(['Each', 'Pack', 'Box']),
            'reorder_level'  => fake()->numberBetween(5, 50),
            'cost_price'     => $cost,
            'sell_price'     => fake()->randomFloat(2, $cost * 1.1, $cost * 1.8),
            'is_active'      => 1,
        ];
    }
}
