<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function admin()
    {
        return response()->json([
            'dashboard' => 'Admin Dashboard'
        ]);
    }

    public function guru()
    {
        return response()->json([
            'dashboard' => 'Guru Dashboard'
        ]);
    }

    public function siswa()
    {
        return response()->json([
            'dashboard' => 'Siswa Dashboard'
        ]);
    }
}
