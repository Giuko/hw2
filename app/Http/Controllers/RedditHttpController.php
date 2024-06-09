<?php

namespace App\Http\Controllers;

use Illuminate\Routing\Controller as BaseController;
use Session;
use App\Models\User;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Cache;

class RedditHttpController extends BaseController
{
    private $token = '';

    private function getAccessToken(){
        // Controlla se il token è già stato memorizzato
        if ($this->token) {
            return $this->token;
        }

        // Controlla se il token è in cache
        if (Cache::has('reddit_access_token')) {
            $this->token = Cache::get('reddit_access_token');
            return $this->token;
        }

        $client_id = env('CLIENT_ID');
        $client_secret = env('CLIENT_SECRET');
        $username = env('USERNAME');
        $password = env('PASSWORD');
        
        // Creazione dell'header per l'autenticazione di base
        $basicAuthHeader = base64_encode("$client_id:$client_secret");
        
        // Richiesta del token di accesso
        $response = Http::withHeaders([
            'Authorization' => "Basic $basicAuthHeader",
            'User-Agent' => 'My_University_script 1.0 (by /u/GiukoMG)'
        ])->asForm()->post('https://www.reddit.com/api/v1/access_token', [
            'grant_type' => 'password',
            'username' => $username,
            'password' => $password,
        ]);
        
        $this->token = $response->json()['access_token'];
        
        // Memorizza il token nella cache per evitare di fare richieste ripetute
        Cache::put('reddit_access_token', $this->token, $response->json()['expires_in'] / 60); // expires_in è in secondi

        return $this->token;
    }
    
    public function headLoad(){
        $token = $this->getAccessToken();
        
        // Utilizzo del token per ottenere i dati
        $result = Http::withHeaders([
            'Authorization' => "Bearer $token",
            'User-Agent' => 'My_University_script 1.0 (by /u/GiukoMG)'
        ])->get('https://oauth.reddit.com/best.json?limit=100');
    
        if ($result->successful()) {
            echo $result->body();
        } else {
            echo 0;
        }
        
    }

    public function subredditRequest($subreddit){
        $endpoint = 'https://oauth.reddit.com';
        $request = "/r/".$subreddit;
        $end = "/about.json";
        
        $token = $this->getAccessToken();
        $response = Http::withHeaders([
            'Authorization' => "Bearer $token",
            'User-Agent' => 'My_University_script 1.0 (by /u/GiukoMG)'            
        ])->get($endpoint.$request.$end);
        echo $response;
    }

    public function getPost($search, $limit=25){
        $endpoint = 'https://oauth.reddit.com/search.json?';
        $request = 'q='.$search."&limit=".$limit;
        
        $token = $this->getAccessToken();
        $response = Http::withHeaders([
            'Authorization' => "Bearer $token",
            'User-Agent' => 'My_University_script 1.0 (by /u/GiukoMG)'            
        ])->get($endpoint.$request);
        echo $response;
    }
}