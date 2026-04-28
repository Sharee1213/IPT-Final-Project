<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Clearance extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'finance_cleared',
        'attendance_cleared',
        'products_cleared',
        'is_signed',
        'signed_by',
        'signed_at',
        'notes',
    ];

    protected $casts = [
        'finance_cleared' => 'boolean',
        'attendance_cleared' => 'boolean',
        'products_cleared' => 'boolean',
        'is_signed' => 'boolean',
        'signed_at' => 'datetime',
    ];

    // Relationships
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function signedBy()
    {
        return $this->belongsTo(User::class, 'signed_by');
    }
}
