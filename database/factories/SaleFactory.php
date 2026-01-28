<?php

namespace Database\Factories;

use App\Models\Sale;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class SaleFactory extends Factory
{
    protected $model = Sale::class;

    public function definition()
    {
        $subtotal = $this->faker->randomFloat(2, 50, 2000);
        $tax = $subtotal * 0.15;
        $discount = $this->faker->randomFloat(2, 0, 200);
        $total = $subtotal + $tax - $discount;

        return [
            'invoice_number' => 'INV-' . $this->faker->unique()->numberBetween(1000, 999999),
            'user_id' => User::inRandomOrder()->first()->id ?? 1,
            'customer_id' => null,
            'subtotal' => $subtotal,
            'tax' => $tax,
            'discount' => $discount,
            'total' => $total,
            'amount_received' => $total,
            'change_due' => 0,
            'payment_method' => $this->faker->randomElement(['cash', 'card', 'eft']),
            'status' => $this->faker->randomElement(['completed', 'pending', 'cancelled']),
            'note' => $this->faker->sentence(),
        ];
    }
}
