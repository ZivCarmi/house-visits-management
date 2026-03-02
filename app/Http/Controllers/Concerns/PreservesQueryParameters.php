<?php

declare(strict_types=1);

namespace App\Http\Controllers\Concerns;

trait PreservesQueryParameters
{
    protected function preservedQueryParams(): array
    {
        return request()->only(['search', 'sort_column', 'sort_direction', 'filter', 'page']);
    }
}
