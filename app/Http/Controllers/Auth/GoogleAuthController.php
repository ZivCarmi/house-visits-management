<?php

declare(strict_types=1);

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Laravel\Socialite\Facades\Socialite;

class GoogleAuthController extends Controller
{
    public function redirect(): RedirectResponse
    {
        return Socialite::driver('google')->redirect();
    }

    public function callback(): RedirectResponse
    {
        $googleUser = Socialite::driver('google')->user();

        $googleEmailVerified = ($googleUser['email_verified'] ?? $googleUser['verified_email'] ?? false) === true;

        [$first_name, $last_name] = $this->splitFullName(
            $googleUser->getName() ?? $googleUser->getEmail(),
        );
        $avatar = $googleUser->getAvatar();

        $user = User::query()
            ->where('google_id', $googleUser->getId())
            ->orWhere('email', $googleUser->getEmail())
            ->first();

        $emailVerifiedAt = $googleEmailVerified ? now() : null;

        if ($user) {
            $user->update([
                'google_id' => $user->google_id ?? $googleUser->getId(),
                'email_verified_at' => $user->email_verified_at ?? $emailVerifiedAt,
                'first_name' => $first_name,
                'last_name' => $last_name,
                'avatar' => $avatar,
            ]);
        } else {
            $user = User::query()->create([
                'first_name' => $first_name,
                'last_name' => $last_name,
                'email' => $googleUser->getEmail(),
                'google_id' => $googleUser->getId(),
                'email_verified_at' => $emailVerifiedAt,
                'avatar' => $avatar,
                'password' => bcrypt(Str::random(64)),
            ]);
        }

        Auth::login($user, true);

        return redirect()->intended(route('home', absolute: false));
    }

    /**
     * @return array{0: string, 1: string}
     */
    private function splitFullName(string $fullName): array
    {
        $parts = explode(' ', trim($fullName), 2);

        return [
            $parts[0] ?? '',
            $parts[1] ?? '',
        ];
    }
}
