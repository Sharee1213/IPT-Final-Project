<?php

namespace App\Http\Controllers;

use App\Models\Attendance;
use App\Models\Event;
use App\Models\Fine;
use Illuminate\Http\Request;

class AttendanceController extends Controller
{
    public function index(Request $request)
    {
        if (!$request->user()->isAdmin()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $query = Attendance::with(['user', 'event']);

        if ($request->has('event_id')) {
            $query->where('event_id', $request->event_id);
        }

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        $attendance = $query->paginate(15);

        return response()->json($attendance);
    }

    public function mark(Request $request)
    {
        if (!$request->user()->isAdmin()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'student_id' => 'required|string',
            'event_id' => 'required|integer|exists:events,id',
            'status' => 'required|in:present,absent,excused',
        ]);

        $user = \App\Models\User::where('student_id', $validated['student_id'])->firstOrFail();
        $event = Event::findOrFail($validated['event_id']);

        $attendance = Attendance::updateOrCreate(
            ['user_id' => $user->id, 'event_id' => $event->id],
            [
                'status' => $validated['status'],
                'marked_at' => now(),
                'marked_by' => $request->user()->name,
            ]
        );

        return response()->json([
            'message' => 'Attendance marked successfully',
            'attendance' => $attendance,
        ]);
    }

    public function userAttendance(Request $request)
    {
        $user = $request->user();

        $attendance = Attendance::with('event')
            ->where('user_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return response()->json($attendance);
    }

    public function eventAttendance($eventId)
    {
        $event = Event::findOrFail($eventId);

        $attendance = Attendance::with('user')
            ->where('event_id', $eventId)
            ->paginate(15);

        return response()->json($attendance);
    }

    public function markAllAbsent(Request $request)
    {
        if (!$request->user()->isAdmin()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'event_id' => 'required|integer|exists:events,id',
        ]);

        $eventId = $validated['event_id'];
        $event = Event::findOrFail($eventId);

        $markedUsers = Attendance::where('event_id', $eventId)
            ->where('status', '!=', 'absent')
            ->pluck('user_id')
            ->toArray();

        $allStudents = \App\Models\User::where('role', 'student')->pluck('id')->toArray();

        foreach ($allStudents as $studentId) {
            if (!in_array($studentId, $markedUsers)) {
                Attendance::updateOrCreate(
                    ['user_id' => $studentId, 'event_id' => $eventId],
                    ['status' => 'absent', 'marked_by' => 'System']
                );

                // Create fine
                Fine::create([
                    'user_id' => $studentId,
                    'event_id' => $eventId,
                    'reason' => 'Absence from ' . $event->title,
                    'amount' => 100,
                    'status' => 'unpaid',
                ]);
            }
        }

        return response()->json(['message' => 'Absent students marked and fines created']);
    }
}
