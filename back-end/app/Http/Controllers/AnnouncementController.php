<?php

namespace App\Http\Controllers;

use App\Models\Announcement;
use Illuminate\Http\Request;

class AnnouncementController extends Controller
{
    public function index(Request $request)
    {
        $query = Announcement::with('creator');

        if ($request->has('sort') && $request->sort === 'pinned') {
            $query->orderBy('is_pinned', 'desc');
        }

        $announcements = $query->orderBy('created_at', 'desc')->paginate(10);

        return response()->json($announcements);
    }

    public function store(Request $request)
    {
        if (!$request->user()->isAdmin()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'is_pinned' => 'sometimes|boolean',
        ]);

        $announcement = Announcement::create([
            ...$validated,
            'created_by' => $request->user()->id,
            'published_at' => now(),
        ]);

        return response()->json([
            'message' => 'Announcement created successfully',
            'announcement' => $announcement->load('creator'),
        ], 201);
    }

    public function show($id)
    {
        $announcement = Announcement::with('creator')->findOrFail($id);

        return response()->json($announcement);
    }

    public function update(Request $request, $id)
    {
        if (!$request->user()->isAdmin()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $announcement = Announcement::findOrFail($id);

        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'content' => 'sometimes|string',
            'is_pinned' => 'sometimes|boolean',
        ]);

        $announcement->update($validated);

        return response()->json([
            'message' => 'Announcement updated successfully',
            'announcement' => $announcement,
        ]);
    }

    public function destroy(Request $request, $id)
    {
        if (!$request->user()->isAdmin()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        Announcement::findOrFail($id)->delete();

        return response()->json(['message' => 'Announcement deleted successfully']);
    }

    public function latest()
    {
        $announcements = Announcement::orderBy('created_at', 'desc')
            ->limit(3)
            ->get();

        return response()->json($announcements);
    }
}
