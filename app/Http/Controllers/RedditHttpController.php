<?php

namespace App\Http\Controllers;

use Illuminate\Routing\Controller as BaseController;
use Session;
use App\Models\User;
use Illuminate\Support\Facades\Http;

class RedditHttpController extends BaseController
{
    public function headLoad(){
        $client_id = env('CLIENT_ID');
        $client_secret = env('CLIENT_SECRET');
        $username = env('USERNAME');
        $password = env('PASSWORD');
        
        // Creazione dell'header per l'autenticazione di base
        $basicAuthHeader = base64_encode("$client_id:$client_secret");
        
        // Richiesta del token di accesso
        $response = Http::withHeaders([
            'Authorization' => "Basic $basicAuthHeader",
            'User-Agent' => 'Mozilla/5.0 (Macintosh; PPC Mac OS X 10_8_7 rv:5.0; en-US) AppleWebKit/533.31.5 (KHTML, like Gecko) Version/4.0 Safari/533.31.5'
        ])->asForm()->post('https://www.reddit.com/api/v1/access_token', [
            'grant_type' => 'password',
            'username' => $username,
            'password' => $password,
        ]);
        
        if ($response->successful()) {
            $token = $response->json()['access_token'];
        
            // Utilizzo del token per ottenere i dati
            $result = Http::withHeaders([
                'Authorization' => "Bearer $token",
                'User-Agent' => 'Mozilla/5.0 (Macintosh; PPC Mac OS X 10_8_7 rv:5.0; en-US) AppleWebKit/533.31.5 (KHTML, like Gecko) Version/4.0 Safari/533.31.5'
            ])->get('https://oauth.reddit.com/best.json?limit=100');
        
            if ($result->successful()) {
                echo $result->body();
            } else {
                echo 0;
            }
        } else {
            echo 0;
        }
    }

    public function subredditRequest($subreddit){
        $endpoint = 'https://www.reddit.com';
        $request = "/r/".$subreddit;
        $end = "/about.json";
        
        $response = Http::get($endpoint.$request.$end);
        echo $response;
    }

    public function getPost($search, $limit=25){
        $endpoint = 'https://www.reddit.com/search.json?';
        $request = 'q='.$search."&limit=".$limit;
        
        $response = Http::get($endpoint.$request);
        echo $response;
    }
}