<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Models\Comment;
use App\Models\Saved;
use Session;
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

    public function savePostUser($id){

        if(!Session::get('user_id')){
            return;
        }
        
        $post = Post::where('postid', $id)
                ->first();

        if(!$post){
            return;
        }


        $saved = Saved::where('post_id', $post->id)
                        ->where('user_id', Session::get('user_id'))
                        ->first();
        if($saved){
            return;
        }

        $saved = new Saved;

        $saved->post_id = $post->id;
        $saved->user_id = Session::get('user_id');

        $saved->save();
    }

    public function removePostUser($id){

        if(!Session::get('user_id')){
            return;
        }
        
        $post = Post::where('postid', $id)
                ->first();

        if(!$post){
            return;
        }


        $saved = Saved::where('post_id', $post->id)
                        ->where('user_id', Session::get('user_id'))
                        ->first();

        $saved->delete();
    }

    public function getPost($id){
        $post = Post::where('postid', $id)
                ->first();

        if($post){
            return response()->json($post);
        }
        return 0;
    }

    public function getPostComment($id){
        $post = Post::where('postid', $id)
                ->first();

        if($post){
            $comments = $post->commentByUsers;
            return response()->json($comments);
        }
        return 0;
    }

    public function commentPost(){
        if(!Session::get('user_id')){
            return;
        }
        $id = request('postId');
        $post = Post::where('postid', $id)
                ->first();

        if(!$post){
            return;
        }
        $user_id = Session::get('user_id');
        $post_id = $post->id;

        $comment = new Comment;

        $comment->post_id = $post_id;
        $comment->account_id = $user_id;
        $comment->content = request('content');


        $comment->save();
        return $comment->id;
    }

    public function isSaved($id){
        if(!Session::get('user_id')){
            return response()->json(0);
        }
        
        $post = Post::where('postid', $id)
                ->first();
        if(!$post){
            return response()->json(0);
        }
        $user_id = Session::get('user_id');
        $post_id = $post->id;

        $saved = Saved::where('post_id', $post_id)->where('user_id', $user_id)->first();
        if($saved){
            return response()->json(1);
        }
        return response()->json(0);
    }

    public function loadSaved(){
        if(!Session::get('user_id')){
            return;
        }

        $user_id = Session::get('user_id');

        $saved = Saved::where('user_id', $user_id)->get();

        $postIds = $saved->pluck('post_id');
        
        $posts = Post::whereIn('id', $postIds)->get();

        return response()->json($posts);
    }
}