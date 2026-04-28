<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Event;
use App\Models\Fine;
use App\Models\Attendance;
use App\Models\Feedback;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function admin(Request $request)
    {
        if (!$request->user()->isAdmin()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $totalStudents = User::where('role', 'student')->count();
        $upcomingEvents = Event::where('start_date', '>', now())
            ->where('is_active', true)
            ->count();
        $unpaidFines = Fine::where('status', 'unpaid')->count();
        $totalUnpaidAmount = Fine::where('status', 'unpaid')->sum('amount');

        $attendanceRate = $this->calculateAttendanceRate();
        $pendingConcerns = Feedback::where('status', 'pending')->count();

        $eventAttendance = Event::with('attendance')
            ->where('start_date', '>', now()->subDays(30))
            ->get()
            ->map(function ($event) {
                $present = $event->attendance->where('status', 'present')->count();
                $total = $event->attendance->count();

                return [
                    'title' => $event->title,
                    'rate' => $total > 0 ? round(($present / $total) * 100) : 0,
                ];
            });

        return response()->json([
            'total_students' => $totalStudents,
            'upcoming_events' => $upcomingEvents,
            'unpaid_fines' => $unpaidFines,
            'total_unpaid_amount' => $totalUnpaidAmount,
            'attendance_rate' => $attendanceRate,
            'pending_concerns' => $pendingConcerns,
            'event_attendance' => $eventAttendance,
        ]);
    }

    public function student(Request $request)
    {
        $user = $request->user();

        $upcomingEvents = Event::where('start_date', '>', now())
            ->where('is_active', true)
            ->limit(5)
            ->get();

        $attendance = Attendance::where('user_id', $user->id)
            ->get();

        $presentCount = $attendance->where('status', 'present')->count();
        $totalEvents = $attendance->count();
        $attendanceRate = $totalEvents > 0 ? round(($presentCount / $totalEvents) * 100) : 0;

        $unpaidFines = Fine::where('user_id', $user->id)
            ->where('status', 'unpaid')
            ->get();

        $totalUnpaid = $unpaidFines->sum('amount');

        $clearance = $user->clearance()->first();

        $notifications = $user->notifications()
            ->whereNull('read_at')
            ->limit(5)
            ->get();

        return response()->json([
            'upcoming_events' => $upcomingEvents,
            'attendance_rate' => $attendanceRate,
            'present_count' => $presentCount,
            'total_events' => $totalEvents,
            'unpaid_fines' => $unpaidFines,
            'total_unpaid_amount' => $totalUnpaid,
            'clearance' => $clearance,
            'notifications' => $notifications,
        ]);
    }

    private function calculateAttendanceRate()
    {
        $totalAttendance = Attendance::count();
        $presentCount = Attendance::where('status', 'present')->count();

        return $totalAttendance > 0 ? round(($presentCount / $totalAttendance) * 100) : 0;
    }
}
