<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class User extends Model{
    
    public function savedPosts(){
        return $this->hasMany(Saved::class);
    }
    
    public function comments(){
        return $this->hasMany(Comment::class);
    }
    
    protected $table = 'users';
}
