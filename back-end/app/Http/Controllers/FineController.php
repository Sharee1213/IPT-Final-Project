<?php

namespace App\Http\Controllers;

use App\Models\Fine;
use App\Models\User;
use Illuminate\Http\Request;

class FineController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        if ($user->isAdmin()) {
            $query = Fine::with(['user', 'event']);

            if ($request->has('status')) {
                $query->where('status', $request->status);
            }

            if ($request->has('search')) {
                $query->whereHas('user', function ($q) {
                    $q->where('name', 'like', '%' . request('search') . '%');
                });
            }

            $fines = $query->paginate(15);
        } else {
            $fines = Fine::where('user_id', $user->id)
                ->with('event')
                ->paginate(10);
        }

        return response()->json($fines);
    }

    public function store(Request $request)
    {
        if (!$request->user()->isAdmin()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'user_id' => 'required|integer|exists:users,id',
            'reason' => 'required|string',
            'amount' => 'required|numeric|min:0',
            'event_id' => 'sometimes|integer|exists:events,id',
            'notes' => 'sometimes|string',
        ]);

        $fine = Fine::create($validated);

        return response()->json([
            'message' => 'Fine created successfully',
            'fine' => $fine->load(['user', 'event']),
        ], 201);
    }

    public function show($id)
    {
        $fine = Fine::with(['user', 'event'])->findOrFail($id);

        return response()->json($fine);
    }

    public function update(Request $request, $id)
    {
        if (!$request->user()->isAdmin()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $fine = Fine::findOrFail($id);

        $validated = $request->validate([
            'reason' => 'sometimes|string',
            'amount' => 'sometimes|numeric|min:0',
            'status' => 'sometimes|in:unpaid,paid,cancelled',
            'notes' => 'sometimes|string',
        ]);

        if ($request->has('status') && $request->status === 'paid' && $fine->status !== 'paid') {
            $validated['paid_at'] = now();
        }

        $fine->update($validated);

        return response()->json([
            'message' => 'Fine updated successfully',
            'fine' => $fine,
        ]);
    }

    public function destroy(Request $request, $id)
    {
        if (!$request->user()->isAdmin()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        Fine::findOrFail($id)->delete();

        return response()->json(['message' => 'Fine deleted successfully']);
    }

    public function userFines($userId)
    {
        $user = User::findOrFail($userId);

        $fines = Fine::where('user_id', $userId)->get();

        $totalUnpaid = $fines->where('status', 'unpaid')->sum('amount');

        return response()->json([
            'user' => $user,
            'fines' => $fines,
            'total_unpaid' => $totalUnpaid,
        ]);
    }
}
