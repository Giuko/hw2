<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Routing\Controller as BaseController;

class PostController extends BaseController
{
    public function savePost(){
        $post = Post::where('postid', request('id'))
                ->first();

        if($post){
            return;
        }

        $post = new Post;
        $post->postid = request('id');
        $post->title = request('title');
        $post->icon = request('icon');
        $post->name = request('name');
        $post->descr = request('descr');
        $post->img = request('img');

        $post->save();
    }
}