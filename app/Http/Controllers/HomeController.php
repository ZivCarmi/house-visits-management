<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use Carbon\Carbon;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    private const VISIT_STATS_TIMEZONE = 'Asia/Jerusalem';

    public function index(): Response
    {
        $today = Carbon::today(self::VISIT_STATS_TIMEZONE);
        $weekStart = $today->copy()->subDays($today->dayOfWeek)->startOfDay();
        $weekEnd = $weekStart->copy()->addDays(6)->endOfDay();
        $monthStart = $today->copy()->startOfMonth();
        $monthEnd = $today->copy()->endOfMonth();

        $patients = auth()->user()->patients();

        $stats = [
            'total_patients' => $patients->count(),
            'need_visit_this_week' => (clone $patients)
                ->whereBetween('next_visit_date', [$weekStart, $weekEnd])
                ->count(),
            'visited_this_month' => (clone $patients)
                ->whereBetween('last_visit_date', [$monthStart, $monthEnd])
                ->count(),
        ];

        return Inertia::render('Home', ['stats' => $stats]);
    }
}
