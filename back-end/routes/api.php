<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\AnnouncementController;
use App\Http\Controllers\AttendanceController;
use App\Http\Controllers\FineController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\ClearanceController;
use App\Http\Controllers\FeedbackController;
use App\Http\Controllers\DashboardController;

// Public routes
Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login', [AuthController::class, 'login']);

Route::get('/announcements/latest', [AnnouncementController::class, 'latest']);
Route::get('/events/upcoming', [EventController::class, 'upcoming']);
Route::get('/announcements', [AnnouncementController::class, 'index']);
Route::get('/announcements/{id}', [AnnouncementController::class, 'show']);
Route::get('/events', [EventController::class, 'index']);
Route::get('/events/{id}', [EventController::class, 'show']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    // Auth
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/user', [AuthController::class, 'user']);

    // User profile
    Route::get('/user/profile', [UserController::class, 'profile']);
    Route::post('/user/profile', [UserController::class, 'update']);

    // Dashboard
    Route::get('/dashboard/admin', [DashboardController::class, 'admin']);
    Route::get('/dashboard/student', [DashboardController::class, 'student']);

    // Attendance
    Route::get('/attendance', [AttendanceController::class, 'index']);
    Route::get('/attendance/my-history', [AttendanceController::class, 'userAttendance']);
    Route::get('/attendance/event/{eventId}', [AttendanceController::class, 'eventAttendance']);

    // Fines
    Route::get('/fines', [FineController::class, 'index']);
    Route::get('/fines/{id}', [FineController::class, 'show']);
    Route::get('/fines/user/{userId}', [FineController::class, 'userFines']);

    // Payments
    Route::get('/payments', [PaymentController::class, 'index']);
    Route::get('/payments/{id}', [PaymentController::class, 'show']);
    Route::get('/payments/user/{userId}', [PaymentController::class, 'userPayments']);
    Route::get('/payments-summary', [PaymentController::class, 'summary']);

    // Clearance
    Route::get('/clearance', [ClearanceController::class, 'userClearance']);
    Route::get('/clearance/list', [ClearanceController::class, 'index']);
    Route::get('/clearance/{id}', [ClearanceController::class, 'show']);

    // Feedback
    Route::get('/feedback', [FeedbackController::class, 'index']);
    Route::post('/feedback', [FeedbackController::class, 'store']);
    Route::get('/feedback/{id}', [FeedbackController::class, 'show']);

    // Admin only routes
    Route::middleware('admin')->group(function () {
        // Users
        Route::get('/users', [UserController::class, 'index']);
        Route::get('/users/{id}', [UserController::class, 'show']);
        Route::post('/users/{id}/toggle-active', [UserController::class, 'toggleActive']);

        // Events
        Route::post('/events', [EventController::class, 'store']);
        Route::post('/events/{id}', [EventController::class, 'update']);
        Route::delete('/events/{id}', [EventController::class, 'destroy']);

        // Announcements
        Route::post('/announcements', [AnnouncementController::class, 'store']);
        Route::post('/announcements/{id}', [AnnouncementController::class, 'update']);
        Route::delete('/announcements/{id}', [AnnouncementController::class, 'destroy']);

        // Attendance
        Route::post('/attendance/mark', [AttendanceController::class, 'mark']);
        Route::post('/attendance/mark-all-absent', [AttendanceController::class, 'markAllAbsent']);

        // Fines
        Route::post('/fines', [FineController::class, 'store']);
        Route::post('/fines/{id}', [FineController::class, 'update']);
        Route::delete('/fines/{id}', [FineController::class, 'destroy']);

        // Payments
        Route::post('/payments', [PaymentController::class, 'store']);

        // Clearances
        Route::post('/clearance/{id}', [ClearanceController::class, 'update']);
        Route::post('/clearance/{id}/toggle-signature', [ClearanceController::class, 'toggleSignature']);

        // Feedback
        Route::post('/feedback/{id}/respond', [FeedbackController::class, 'respond']);
        Route::post('/feedback/{id}/resolve', [FeedbackController::class, 'resolve']);
        Route::delete('/feedback/{id}', [FeedbackController::class, 'destroy']);
    });
});


Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});