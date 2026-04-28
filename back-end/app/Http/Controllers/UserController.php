<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function profile(Request $request)
    {
        return response()->json($request->user()->load([
            'clearance',
            'fines',
            'payments',
            'attendance.event',
            'notifications',
        ]));
    }

    public function update(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|string|email|unique:users,email,' . $user->id,
            'phone' => 'sometimes|string',
            'password' => 'sometimes|string|min:8|current_password',
            'new_password' => 'sometimes|string|min:8',
        ]);

        if (!empty($validated['new_password'])) {
            unset($validated['new_password']);
            $validated['password'] = Hash::make($request->new_password);
        }

        $user->update($validated);

        return response()->json([
            'message' => 'Profile updated successfully',
            'user' => $user,
        ]);
    }

    public function index(Request $request)
    {
        if (!$request->user()->isAdmin()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $students = User::where('role', 'student')->paginate(15);

        return response()->json($students);
    }

    public function show($id)
    {
        $user = User::with([
            'clearance',
            'fines',
            'payments',
            'attendance.event',
        ])->findOrFail($id);

        return response()->json($user);
    }

    public function toggleActive(Request $request, $id)
    {
        if (!$request->user()->isAdmin()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $user = User::findOrFail($id);
        $user->update(['is_active' => !$user->is_active]);

        return response()->json([
            'message' => 'User status updated',
            'user' => $user,
        ]);
    }
}
