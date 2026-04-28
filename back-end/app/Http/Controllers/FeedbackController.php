<?php

namespace App\Http\Controllers;

use App\Models\Feedback;
use Illuminate\Http\Request;

class FeedbackController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        if ($user->isAdmin()) {
            $query = Feedback::with(['user', 'responder']);

            if ($request->has('status')) {
                $query->where('status', $request->status);
            }

            if ($request->has('type')) {
                $query->where('type', $request->type);
            }

            $feedback = $query->orderBy('created_at', 'desc')->paginate(15);
        } else {
            $feedback = Feedback::where('user_id', $user->id)
                ->orderBy('created_at', 'desc')
                ->paginate(10);
        }

        return response()->json($feedback);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'subject' => 'required|string|max:255',
            'message' => 'required|string',
            'type' => 'required|in:feedback,complaint,inquiry',
        ]);

        $feedback = Feedback::create([
            ...$validated,
            'user_id' => $request->user()->id,
        ]);

        return response()->json([
            'message' => 'Feedback submitted successfully',
            'feedback' => $feedback->load('user'),
        ], 201);
    }

    public function show($id)
    {
        $feedback = Feedback::with(['user', 'responder'])->findOrFail($id);

        return response()->json($feedback);
    }

    public function respond(Request $request, $id)
    {
        if (!$request->user()->isAdmin()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $feedback = Feedback::findOrFail($id);

        $validated = $request->validate([
            'response' => 'required|string',
        ]);

        $feedback->update([
            ...$validated,
            'responded_by' => $request->user()->id,
            'responded_at' => now(),
            'status' => 'in_progress',
        ]);

        return response()->json([
            'message' => 'Response sent successfully',
            'feedback' => $feedback->load('responder'),
        ]);
    }

    public function resolve(Request $request, $id)
    {
        if (!$request->user()->isAdmin()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $feedback = Feedback::findOrFail($id);

        $feedback->update([
            'status' => 'resolved',
            'responded_by' => $request->user()->id,
        ]);

        return response()->json([
            'message' => 'Feedback marked as resolved',
            'feedback' => $feedback,
        ]);
    }

    public function destroy(Request $request, $id)
    {
        if (!$request->user()->isAdmin()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        Feedback::findOrFail($id)->delete();

        return response()->json(['message' => 'Feedback deleted successfully']);
    }
}
