<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Post extends Model{

    public function savedByUsers(){
        return $this->hasMany(Saved::class);
    }

    public function commentByUsers(){
        return $this->hasMany(Comment::class);
    }
    
    protected $table = 'posts';
}
