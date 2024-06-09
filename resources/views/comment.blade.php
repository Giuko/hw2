<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reddit</title>
    <link rel="icon" type="image/x-icon" href="{{ asset('css/style/img/redditFavicon.png') }}">
    <link rel="stylesheet" href="{{ asset('css/style/style.css') }}">
    <link rel="stylesheet" href="{{ asset('css/style/comment.css') }}">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <script src="{{ asset('js/script_js/utils.js') }}" defer></script>
    <script src="{{ asset('js/script_js/login.js') }}" defer></script> 
    <script src="{{ asset('js/script_js/comment.js') }}" defer></script>
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;1,100;1,200;1,300;1,400;1,500;1,600;1,700&display=swap" rel="stylesheet">

</head>
<body>
   
    <div class='hidden' id='postId' data-info='{{ $post_id }}'></div>
    
    <!-- #region ==== FORM ==== -->
    <section id='modal-view' class='hidden'>
        <div id='loginDiv'>
            <div id="loginForm" class="flex flex-column align-center">
                <div class="login_top flex flex-end align-center"> <button id="closeLogin">X</button> </div>
            <form action="" method="post" name="login">
                <div class="login_main">
                    <h1>Log In</h1>
                    <p>By continuing, you agree to our User Agreement and acknowledge that you understand the Privacy Policy.</p>
                    
                    <p class='hidden' id='errore_credenziali'></p>
                    <div>
                        <div class="loginInput">
                            <p>Username</p>
                            <input type="text" name="username">
                        </div>
                        <div class="loginInput">
                            <p>Password</p>
                            <input type="password" name="password">
                        </div>
                    </div>
                    <div class="signup flex align-center">
                        New? <a id="signup">Sign Up</a>
                    </div>
                </div>
                <div class="login_bottom flex flex-center align-center"> <input type="submit" name="azione" value="Log In"></div>
            </form>
            </div>
        </div>
        <div id='signupDiv' class='hidden'>
            <div id="signupForm" class="flex flex-column align-center">
                <div class="signup_top flex flex-end align-center"> <button id="closeSignup">X</button> </div>
            <form action="" method="post" name="signup">
                <div class="signup_main">
                    <h1>Sign Up</h1>
                    <p>By continuing, you agree to our User Agreement and acknowledge that you understand the Privacy Policy.</p>
                    
                    <p class='hidden' id='errore_credenziali'></p>
                    <div>
                        <div class="signupInput">
                            <p>Username</p>
                            <input type="text" name="username">
                        </div>
                        <div class="signupInput">
                            <p>Email</p>
                            <input type="email" name="email">
                        </div>
                        <div class="signupInput">
                            <p>Name</p>
                            <input type="text" name="name">
                        </div>
                        <div class="signupInput">
                            <p>Surname</p>
                            <input type="text" name="surname">
                        </div>
                        <div class="signupInput">
                            <p>Password</p>
                            <input type="password" name="password">
                        </div>
                    </div>
                </div>
                <div class="login_bottom flex flex-center align-center"> <input type="submit" value="Sign Up"></div>
            </form>
            </div>
        </div>
    </section>
    <!-- #endregion-->
    <header class="flex flex-start">
        <div class = "flex" id="logo">
            <div id = "navbar-menu" data-click="0"></div>
            <div id = "navbar-logo"></div>
            <div id = "navbar-reddit"></div>
        </div>
            <div class="flex flex-center" id="search">
        </div>
        
        <div class="flex space-around" id="setting">
             
            @if (session()->has('user_id'))
                <div class="flex flex-center" id="logout" data-action="comment-logout">
                    <div class="item">Log out</div>
                </div>

                <div class="hidden flex-center" id="login" data-action="comment-login"> 
                    <div class="item">Log In</div>
                </div>
            @else
                <div class="hidden flex-center" id="logout" data-action="comment-logout">
                    <div class="item">Log out</div>
                </div>

                <div class="flex flex-center" id="login" data-action="comment-login">
                    <div class="item">Log In</div>
                </div>
            @endif
            
        </div>
    </header>
    <div class="main-container">
        <nav class="flex flex-center">
            <div class="subnav flex flex-start">
                <a href="/">    
                    <div class="flex flex-start" id="popular">
                        <div class="image"></div>
                        <div class="item">Popular</div>
                    </div>
                </a>
                
                <hr class="border-neutral-weak">
                <a href="/saved">
                    <div class="item-nav flex" data-navtype="resources" data-click="0">
                        <div class="flex">SAVED</div>
                    </div>
                </a>
            </div> 
        </nav>
        <div class="container flex flex-center">
            <div class="subcontainer">    
                <div class="flex flex-center flex-column" id="main">
                    <h1 class='errore hidden'>Si è verificato un errore, ricaricare la pagine<br>Se l'errore persiste provare un altro post</h1>
                    <div id="post"></div>
                    <div id = "button_comment" class="flex flex-start align-center">
                        <button id="comment" class="flex align-center"><span>+</span>Comment</button>
                    </div>
                    <p id = "commentError" class = "errore   hidden">Bisogna essere loggati</p>
                    <form class = "hidden" action="" method='post' id='formComment' name="formComment">
                        <div class = "flex flex-column">
                            <textarea class = 'text' type="text" placeholder="Comment here" name="content"></textarea>
                            <input class = 'submit' type="submit" value="Comment">
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</body>
</html>