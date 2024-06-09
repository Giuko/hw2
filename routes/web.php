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
        ->with("subreddit", $id);
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
Route::get('/isLogged', 'App\Http\Controllers\LoginController@isLogged');
Route::get('/getUsername/{id}', 'App\Http\Controllers\LoginController@getUsername');
Route::get('/getUsername', 'App\Http\Controllers\LoginController@getUsernameSession');
/* === FINE LOGIN CONTROLLER === */

/* === REDDIT CONTROLLER === */
Route::get('/headLoad', 'App\Http\Controllers\RedditHttpController@headLoad');
Route::get('/subredditRequest/{subreddit}', 'App\Http\Controllers\RedditHttpController@subredditRequest');
Route::get('/getPost/{request}/{limit?}', 'App\Http\Controllers\RedditHttpController@getPost');
/* === FINE REDDIT CONTROLLER === */

/* === POST CONTROLLER === */
Route::post('/savePost', 'App\Http\Controllers\PostController@savePost');       /* Inserisce il post nel DB */
Route::get('/savePostUser/{id}', 'App\Http\Controllers\PostController@savePostUser');   /* Salva il post nel DB saved con la relazione con User */
Route::get('/removePostUser/{id}', 'App\Http\Controllers\PostController@removePostUser');   /* Elimimna il post nel DB saved con la relazione con User */
Route::get('/getPostInfo/{id}', 'App\Http\Controllers\PostController@getPost');
Route::get('/getPostComment/{id}', 'App\Http\Controllers\PostController@getPostComment');
Route::post('/commentPost', 'App\Http\Controllers\PostController@commentPost');
Route::get('/isSaved/{id}', 'App\Http\Controllers\PostController@isSaved');
Route::get('loadSaved', 'App\Http\Controllers\PostController@loadSaved');
/* === FINE POST CONTROLLER === */

/* === COMMENT CONTROLLER === */
Route::get('/deleteComment/{id}', 'App\Http\Controllers\CommentController@deleteComment');
/* === FINE COMMENT CONTROLLER === */