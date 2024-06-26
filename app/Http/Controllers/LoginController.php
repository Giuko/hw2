<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Validator;
use Illuminate\Routing\Controller as BaseController;
use Session;
use App\Models\User;

class LoginController extends BaseController
{
    public function login(){
        if(Session::get('user_id')){
            return;
        }

        // Validazione dati
        if(strlen(request('username')) == 0 || strlen(request('password')) < 8){
            return;
        }
        $user = User::where('username', request('username'))->first();
        if(!$user || !password_verify(request('password'), $user->password)){
            return 0;
        }
        // Login
        Session::put('user_id', $user->id);
        
        return 1;
    }

    public function signup(){
        if(Session::get('user_id')){
            return;
        }

        // Validazione dati
        if(strlen(request('username')) == 0 || strlen(request('password')) < 8){
            return;
        }

        $validator = Validator::make(request()->all(), [
            'username' => 'required',
            'password' => [
                'required',
                'min:8', // At least 8 characters
                'regex:/[A-Z]+/', // At least one uppercase letter
                'regex:/[a-z]+/', // At least one lowercase letter
                'regex:/[0-9]+/', // At least one number
                'regex:/[@#$%^&*+=-_.,:;!?]/', // At least one symbol
            ],
        ]);
        
        if ($validator->fails()) {
            return;
        }

        $user = User::where('username', request('username'))
                ->orWhere('email', request('email'))
                ->first();

        if($user){
            return;
        }
        
        // Creazione User
        $user = new User;
        $user->username = request('username');
        $user->email = request('email');
        $user->name = request('name');
        $user->surname = request('surname');
        $user->password = password_hash(request('password'), PASSWORD_BCRYPT);
        $user->save();

        // Login
        Session::put('user_id', $user->id);
        
        return;
    }

    public function logout(){
        Session::flush();
    }

    public function isLogged(){
        // Verifica se loggato
        if(Session::get('user_id')){
            echo 1;
        }else{
            echo 0;
        }
    }

    public function getUsername($id){
        // Verifica se loggato
        $user = User::where('id', $id)->first();
        return response()->json($user->username);
    }
    
    public function getUsernameSession(){
        // Verifica se loggato
        if(Session::get('user_id')){
            
            $user = User::where('id', Session::get('user_id'))->first();
            
            return response()->json($user->username);
        }else{
            return 0;
        }
    }
}
