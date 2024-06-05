<?php
use Illuminate\Support\Facades\Route;
use App\Models\User;

/* === PAGINE DISPONIBILI === */
Route::get('/', function(){
    return view('home');
});

Route::get('/saved', function(){
    return view('saved');
});

Route::get('/comment/{id}', function($id){
    return view('comment')
        ->with("post_id", $id);
});

Route::get('/about/{id}', function($id){
    return view('about')
        ->with("post_id", $id);
});
/* === FINE PAGINE DISPONIBILI=== */

/* === NECESSARI PER RICHIESTE ASINCRONE === */
Route::get('/refresh-csrf', function() {
    return csrf_token();
});

Route::get('/getUsers', function(){
    $users = User::all();
    return $users;
});

/* === LOGIN CONTROLLER === */
Route::post('/login', 'App\Http\Controllers\LoginController@login');
Route::post('/signup', 'App\Http\Controllers\LoginController@signup');
Route::get('/logout', 'App\Http\Controllers\LoginController@logout');
/* === FINE LOGIN CONTROLLER === */

/* === REDDIT CONTROLLER === */
Route::get('/headLoad', 'App\Http\Controllers\RedditHttpController@headLoad');
Route::get('/noOauth/{request}/{limit?}', 'App\Http\Controllers\RedditHttpController@noOauth');
/* === FINE REDDIT CONTROLLER === */