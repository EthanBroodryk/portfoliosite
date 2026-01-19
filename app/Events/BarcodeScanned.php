<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class BarcodeScanned implements ShouldBroadcast
{
    use Dispatchable, SerializesModels;

    public string $barcode;

    public function __construct(string $barcode)
    {
        $this->barcode = $barcode;
    }

    public function broadcastOn(): Channel
    {
        return new Channel('pos-channel');
    }

    public function broadcastAs(): string
    {
        return 'barcode-scanned';
    }
}
