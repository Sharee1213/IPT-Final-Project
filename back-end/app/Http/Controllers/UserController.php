<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    // Admin: list all non-admin users
    public function index()
    {
        $users = User::where('role', '!=', 'admin')->get();
        return response()->json($users);
    }

    // Admin: deactivate a user
    public function deactivate($id)
    {
        $user = User::findOrFail($id);

        if ($user->role === 'admin') {
            return response()->json(['message' => 'Cannot deactivate an admin.'], 403);
        }

        $user->is_active = false;
        $user->save();

        return response()->json(['message' => 'User deactivated successfully.']);
    }

    // Admin: activate a user
    public function activate($id)
    {
        $user = User::findOrFail($id);
        $user->is_active = true;
        $user->save();

        return response()->json(['message' => 'User activated successfully.']);
    }

    // Admin: delete a user
    public function destroy($id)
    {
        $user = User::findOrFail($id);

        if ($user->role === 'admin') {
            return response()->json(['message' => 'Cannot delete an admin.'], 403);
        }

        $user->delete();
        return response()->json(['message' => 'User deleted successfully.']);
    }
}