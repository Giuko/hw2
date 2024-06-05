const usernameList = [];
const emailList = [];

async function get_token_csrf(){
    let token_text;
    const response = await fetch('/refresh-csrf');
    await response.text().then((text) => {
        token_text = text
    });
    return token_text;
}

fetch('getUsers').then((response) => {return response.json()}).then((json) =>{
    for(let i = 0; i < json.length; i++){
        usernameList.push(json[i].username);
        emailList.push(json[i].email);
    }
    console.log(usernameList);
    console.log(emailList);
})

function contieneMaiuscola(word) {
    let alfabeto = "ABCDEFGHILJKMNOPQRSTUVWXYZ";
    for(let i = 0; i < word.length; i++){
        if(alfabeto.includes(word[i])){
            return true
        }
    }
    return false;
}

function contieneNumero(word) {
    let alfabeto = "0123456789";
    for(let i = 0; i < word.length; i++){
        if(alfabeto.includes(word[i])){
            return true
        }
    }
    return false;
}

function contieneSimbolo(word) {
    let alfabeto = "!@#£$%^&*()-_=+[{]}|;:,<.>/?";
    for(let i = 0; i < word.length; i++){
        if(alfabeto.includes(word[i])){
            return true
        }
    }
    return false;
}

async function loginPHP(username, password, token){
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);

    const url = '/login';
    
    const response = await fetch(url,{
        method: 'POST',
        body: formData,
        headers: {
          'X-CSRF-TOKEN': token
        }
    });
    let textResponse;
    await response.text().then((text)=> textResponse = text );
    return (textResponse);
}

function switchButton(value){
    if(value === 0){
        // From login to logout
        login.classList.remove('flex');
        login.classList.add('hidden');
        logout.classList.remove('hidden');
        logout.classList.add('flex');
    }else{
        // From logout to login
        login.classList.add('flex');
        login.classList.remove('hidden');
        logout.classList.add('hidden');
        logout.classList.remove('flex');
    }
}

async function validazioneLogin(e){
    e.preventDefault();
    const form = e.target;

    let token_csrf = await get_token_csrf();

    const username = (form.username.value);
    const password = (form.password.value);
    form.password.value='';

    const errorParagraph = document.querySelector('#loginDiv #errore_credenziali');
    
    if(username.length == 0 || password.length == 0){
        errorParagraph.textContent = ("Compilare tutti i campi");
        errorParagraph.classList.add('errore');
        errorParagraph.classList.remove('hidden');
    }else{
        if(!usernameList.includes(username)){
            errorParagraph.textContent = ("Nome Utente non esistente");
            form.username.value='';
            errorParagraph.classList.add('errore');
            errorParagraph.classList.remove('hidden');
        }else{            
            if(parseInt(await loginPHP(username, password,token_csrf )) === 0){
                errorParagraph.textContent = ("Password errata");
                errorParagraph.classList.add('errore');
                errorParagraph.classList.remove('hidden');
            }else{
                switchButton(0);
                document.querySelector('#modal-view').classList.add('hidden');
                document.querySelector('#modal-view').classList.remove('flex');
                if(login.dataset.action === 'saved-login'){
                    window.open("/saved", "_self");
                }else if(login.dataset.action === 'comment-login'){
                    document.querySelector('#commentError').classList.add('hidden');
                    location.reload();
                }
            }
        }
    }
}

async function validazioneSignup(e){
    e.preventDefault();
    const form = e.target;
    let token_csrf = await get_token_csrf();

    const username = (form.username.value);
    const email = (form.email.value);
    const name = (form.name.value);
    const surname = (form.surname.value);
    const password = (form.password.value);
    form.password.value = '';
    const errorParagraph = document.querySelector('#signupDiv #errore_credenziali');
    

    if(username.length == 0 || email.length == 0 || name.length == 0 || surname.length == 0 || password.length == 0){
        errorParagraph.textContent = ("Compilare tutti i campi");
        errorParagraph.classList.add('errore');
        errorParagraph.classList.remove('hidden');
    }else if(password.length <= 7){
        errorParagraph.textContent = ("Password troppo corta");
        errorParagraph.classList.add('errore');
        errorParagraph.classList.remove('hidden');
    }else if(!contieneMaiuscola(password)){
        errorParagraph.textContent = ("Password deve contenere almeno una maiuscola");
        errorParagraph.classList.add('errore');
        errorParagraph.classList.remove('hidden');
    }else if(!contieneNumero(password)){
        errorParagraph.textContent = ("Password deve contenere almeno un numero");
        errorParagraph.classList.add('errore');
        errorParagraph.classList.remove('hidden');
    }else if(!contieneSimbolo(password)){
        errorParagraph.textContent = ("Password deve contenere almeno un simbolo");
        errorParagraph.classList.add('errore');
        errorParagraph.classList.remove('hidden');
    }else{
        if(usernameList.includes(username)){
            form.username.value='';
            errorParagraph.textContent = ("Nome Utente esistente");
            errorParagraph.classList.add('errore');
            errorParagraph.classList.remove('hidden');
        }
        else if(emailList.includes(email)){
            form.email.value='';
            errorParagraph.textContent = ("Email esistente");
            errorParagraph.classList.add('errore');
            errorParagraph.classList.remove('hidden');
        }else{
            const formData = new FormData();
            formData.append('username', username);
            formData.append('password', password);
            formData.append('name', name);
            formData.append('surname', surname);
            formData.append('email', email);

            const url = '/signup';
            
            const response = await fetch(url,{
                method: 'POST',
                body: formData,
                headers: {
                  'X-CSRF-TOKEN': token_csrf
                }
            }).then((response) => {
                console.log(response.text())
            })
            // .then((ret) => {
            //     text = ret;
            //     console.log(text);
            // });
            
            switchButton(0);
            document.querySelector('#modal-view').classList.add('hidden');
            document.querySelector('#modal-view').classList.remove('flex');
            if(login.dataset.action === 'saved-login'){
                document.querySelector('.errore').classList.add('hidden');
                fetch("script_php/loadSaved.php").then((response) => {
                    return response.json();
                }).then((json) => {
                    saved = json;
                    for(let i = 0; i < saved.length; i++){
                        createArticle(i);
                    }
                });
            }
        }
    }
}

function signUp(e){
    //Altrimenti viene effettuato il submit del loginForm
    e.preventDefault();
    const loginWindow = document.querySelector('#loginDiv');
    const signupWindow = document.querySelector('#signupDiv');
    signupWindow.classList.remove('hidden');
    loginWindow.classList.add('hidden');
    
}

const loginForm = document.forms['login'];
loginForm.addEventListener('submit', validazioneLogin);

const signupForm = document.forms['signup'];
signupForm.addEventListener('submit', validazioneSignup);

const signupButton = document.querySelector('#signup');
signupButton.addEventListener('click', signUp);

function loginClick(){
    const modal = document.querySelector('#modal-view');
    modal.classList.add('flex');
    modal.classList.remove('hidden');
    modal.style.top= window.scrollY + 'px';
    const body = document.querySelector('body');
    body.classList.add('no-scroll');
}

function closeLoginSignupFunction(){
    const modal = document.querySelector('#modal-view');
    const loginWindow = document.querySelector('#loginDiv');
    const signupWindow = document.querySelector('#signupDiv');

    

    signupWindow.classList.add('hidden');
    loginWindow.classList.remove('hidden');

    modal.classList.remove('flex');
    modal.classList.add('hidden');
    const body = document.querySelector('body');
    body.classList.remove('no-scroll');
}

async function logoutClick(){
    console.log("Logout");
    switchButton(1);
    await fetch('logout');
    if(logout.dataset.action === 'saved-logout'){
        const url = "/";
        window.open(url, "_self");
    }else if(logout.dataset.action === 'comment-logout'){
        location.reload();
    }
}

const login = document.querySelector('#login');
const logout = document.querySelector('#logout');
const closeLoginButton = document.querySelector('#closeLogin');
const closeSignupButton = document.querySelector('#closeSignup');

closeLoginButton.addEventListener('click', closeLoginSignupFunction);
closeSignupButton.addEventListener('click', closeLoginSignupFunction);

login.addEventListener('click', loginClick);
logout.addEventListener('click', logoutClick);


function isLogged(){
    fetch('/isLogged')
}