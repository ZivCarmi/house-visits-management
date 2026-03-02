<?php

declare(strict_types=1);

namespace App\DTOs;

use Illuminate\Http\Request;

readonly class PatientFilterDTO
{
    private const VALID_FILTERS = ['all', 'weekly', 'monthly', 'overdue'];

    private const VALID_SORT_COLUMNS = ['id', 'last_visit_date', 'next_visit_date'];

    public function __construct(
        public ?string $search,
        public string $filter,
        public string $sortColumn,
        public string $sortDirection,
        public int $page,
    ) {}

    public static function fromRequest(Request $request): self
    {
        $search = $request->input('search');
        $searchValue = is_string($search) && preg_match('/^\d*$/', $search) ? $search : null;

        $filter = $request->input('filter', 'all');
        $filterValue = is_string($filter) && in_array($filter, self::VALID_FILTERS, true) ? $filter : 'all';

        $sortColumn = $request->input('sort_column', 'id');
        $sortColumnValue = in_array($sortColumn, self::VALID_SORT_COLUMNS, true) ? $sortColumn : 'id';

        $sortDirection = strtolower($request->input('sort_direction', 'desc'));
        $sortDirectionValue = in_array($sortDirection, ['asc', 'desc'], true) ? $sortDirection : 'desc';

        $page = $request->integer('page', 1);

        return new self(
            search: $searchValue,
            filter: $filterValue,
            sortColumn: $sortColumnValue,
            sortDirection: $sortDirectionValue,
            page: $page,
        );
    }

    public function toArray(): array
    {
        return [
            'search' => $this->search,
            'filter' => $this->filter,
            'sort_column' => $this->sortColumn,
            'sort_direction' => $this->sortDirection,
            'page' => $this->page,
        ];
    }
}
