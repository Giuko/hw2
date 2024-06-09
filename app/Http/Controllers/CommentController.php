<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Validator;
use Illuminate\Routing\Controller as BaseController;
use Session;
use App\Models\Comment;

class CommentController extends BaseController
{
    public function deleteComment($id){
        $comment = Comment::where('id', $id)
                        ->first();
        $user = $comment->account_id;
        if(Session::get('user_id') === $user){
            $comment->delete();
        }
    }
}
