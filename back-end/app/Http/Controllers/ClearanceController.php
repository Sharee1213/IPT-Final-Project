<?php

namespace App\Http\Controllers;

use App\Models\Clearance;
use App\Models\User;
use Illuminate\Http\Request;

class ClearanceController extends Controller
{
    public function index(Request $request)
    {
        if (!$request->user()->isAdmin()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $query = Clearance::with(['user', 'signedBy']);

        if ($request->has('status')) {
            if ($request->status === 'signed') {
                $query->where('is_signed', true);
            } else {
                $query->where('is_signed', false);
            }
        }

        $clearances = $query->paginate(15);

        return response()->json($clearances);
    }

    public function show($id)
    {
        $clearance = Clearance::with(['user', 'signedBy'])->findOrFail($id);

        return response()->json($clearance);
    }

    public function userClearance(Request $request)
    {
        $user = $request->user();

        $clearance = $user->clearance()->with('signedBy')->first();

        if (!$clearance) {
            $clearance = $user->clearance()->create();
        }

        return response()->json($clearance);
    }

    public function update(Request $request, $id)
    {
        if (!$request->user()->isAdmin()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $clearance = Clearance::findOrFail($id);

        $validated = $request->validate([
            'finance_cleared' => 'sometimes|boolean',
            'attendance_cleared' => 'sometimes|boolean',
            'products_cleared' => 'sometimes|boolean',
            'is_signed' => 'sometimes|boolean',
            'notes' => 'sometimes|string',
        ]);

        if ($request->has('is_signed') && $request->is_signed && !$clearance->is_signed) {
            $validated['signed_by'] = $request->user()->id;
            $validated['signed_at'] = now();
        }

        $clearance->update($validated);

        return response()->json([
            'message' => 'Clearance updated successfully',
            'clearance' => $clearance->load('signedBy'),
        ]);
    }

    public function toggleSignature(Request $request, $id)
    {
        if (!$request->user()->isAdmin()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $clearance = Clearance::findOrFail($id);

        $clearance->update([
            'is_signed' => !$clearance->is_signed,
            'signed_by' => $request->user()->id,
            'signed_at' => now(),
        ]);

        return response()->json([
            'message' => 'Clearance signature toggled',
            'clearance' => $clearance->load('signedBy'),
        ]);
    }
}
