<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\StoreFeedbackRequest;
use App\Services\FeedbackService;
use Illuminate\Http\RedirectResponse;

class FeedbackController extends Controller
{
    public function store(StoreFeedbackRequest $request, FeedbackService $feedbackService): RedirectResponse
    {
        $feedbackService->store(
            $request->user(),
            $request->validated('type'),
            $request->validated('message'),
        );

        return redirect()->back()->with('status', 'המשוב נשלח בהצלחה. תודה! 🙏');
    }
}
