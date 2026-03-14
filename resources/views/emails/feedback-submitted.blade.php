<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
    <meta charset="UTF-8">
    <title>משוב חדש: {{ $typeLabel }}</title>
</head>
<body>
<h1>משוב חדש: {{ $typeLabel }}</h1>

<p>
    <strong>משתמש:</strong>
    {{ $feedback->user->full_name }} ({{ $feedback->user->email }})
</p>

<p>
    <strong>סוג:</strong>
    {{ $typeLabel }}
</p>

<p>
    <strong>תיאור:</strong>
    <br>
    {{ $feedback->message }}
</p>

<hr>
<p>
    {{ $feedback->created_at->timezone('Asia/Jerusalem')->format('d/m/Y H:i') }}
</p>
</body>
</html>
