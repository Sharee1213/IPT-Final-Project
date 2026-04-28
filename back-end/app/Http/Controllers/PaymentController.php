<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use App\Models\Fine;
use Illuminate\Http\Request;

class PaymentController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        if ($user->isAdmin()) {
            $query = Payment::with(['user', 'fine']);

            if ($request->has('status')) {
                $query->where('status', $request->status);
            }

            $payments = $query->paginate(15);
        } else {
            $payments = Payment::where('user_id', $user->id)
                ->with('fine')
                ->paginate(10);
        }

        return response()->json($payments);
    }

    public function store(Request $request)
    {
        if (!$request->user()->isAdmin()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'user_id' => 'required|integer|exists:users,id',
            'fine_id' => 'sometimes|integer|exists:fines,id',
            'payable_type' => 'required|string|in:fine,shirt,booklet,other',
            'amount' => 'required|numeric|min:0',
            'reference_code' => 'sometimes|string',
        ]);

        $payment = Payment::create([
            ...$validated,
            'status' => 'completed',
            'paid_at' => now(),
        ]);

        // Mark fine as paid if applicable
        if ($request->has('fine_id')) {
            Fine::find($validated['fine_id'])->update(['status' => 'paid']);
        }

        return response()->json([
            'message' => 'Payment recorded successfully',
            'payment' => $payment->load(['user', 'fine']),
        ], 201);
    }

    public function show($id)
    {
        $payment = Payment::with(['user', 'fine'])->findOrFail($id);

        return response()->json($payment);
    }

    public function userPayments($userId)
    {
        $payments = Payment::where('user_id', $userId)
            ->with('fine')
            ->paginate(10);

        return response()->json($payments);
    }

    public function summary(Request $request)
    {
        $user = $request->user();

        if (!$user->isAdmin()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $totalRevenue = Payment::where('status', 'completed')->sum('amount');
        $totalPending = Payment::where('status', 'pending')->sum('amount');

        $paymentsByType = Payment::where('status', 'completed')
            ->groupBy('payable_type')
            ->selectRaw('payable_type, SUM(amount) as total')
            ->get();

        return response()->json([
            'total_revenue' => $totalRevenue,
            'total_pending' => $totalPending,
            'by_type' => $paymentsByType,
        ]);
    }
}
