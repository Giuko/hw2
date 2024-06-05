// Funzione per controllare se l'utente ha raggiunto il fondo della pagina
function checkScroll() {
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    const windowHeight = window.innerHeight;
    const bodyHeight = document.body.offsetHeight;

    if(typeof sidebar !== 'undefined'){
        if(sidebar.dataset.position === "1" ){
            sidebar.dataset.position === "0";
            if(scrollTop <  235){
                sidebar.style.marginTop = 15 + 'px';
                sidebar.classList.remove('sticky');
            }
        }else{
            sidebar.dataset.position === "1";
            if(scrollTop >= 235){
                sidebar.classList.add('sticky');
            }
        }
        // Se l'utente ha raggiunto il fondo della pagina
        if (scrollTop + windowHeight >= bodyHeight) {
            loadMoreContent();
        }
    }    
}
window.addEventListener("scroll", checkScroll);


function onFailure(e){
    console.log("Errore: " + e);
};

function onResponse(response){
    if(!response.ok){
        console.log('Response non recuperato');
        return;
    }
    
    return response.json();
};


/* #region ==== GESTIRE SALVATAGGIO POST =====*/ 
let saved = [];

function isSaved(id){
    for(let i = 0; i < saved.length; i++){
        if(id == saved[i].id){
            return i;
        }
    }
    return -1;
}

function enterStar(e){
    let star = e.target;
    let clicked = star.dataset.click;
    if(clicked === "0"){
        star.innerHTML = '';
        star.textContent ='★'
    } 
}

function leaveStar(e){
    let star = e.target;
    let clicked = star.dataset.click;
    if(clicked === "0"){
        star.innerHTML = '';
        star.textContent = '☆'
    }
}

function clickStar(e){

    e.preventDefault();

    if(!isLogged()){
        loginClick();
        return;
    }
    let star = e.target;
    let clicked = star.dataset.click;

    let article = star.parentElement.parentElement;

    let post = {};
    post['id'] = article.parentElement.parentElement.dataset.id;
    ret = article;
    if(clicked === "0"){
        if(isSaved(post['id']) === -1){
            star.innerHTML = '';
            star.textContent = '★'
            star.dataset.click = "1";

            if(article.querySelector('.title') !== null){
                post['title'] = article.querySelector('.title').textContent;
            }else{
                post['title'] = '';
            }

            if(article.querySelector('.subreddit .icon img') !== null){
                post['icon'] = article.querySelector('.subreddit .icon img').src;
            }else{
                post['icon'] = '';
            }

            if(article.querySelector('.subreddit .name') !== null){
                post['name'] = article.querySelector('.subreddit .name').textContent;
            }else{
                post['name'] = '';
            }
            if(post['descr'] = article.querySelector('.text') !== null){
                post['descr'] = article.querySelector('.text').textContent;
            }else{
                post['descr'] = '';
            }
            if(article.querySelector('.insert .divImg') !== null){
                post['img'] = article.querySelector('.insert .divImg img').src;
            }
            saved.push(post);
            const formData = new FormData();
            formData.append('id', post['id']);
            formData.append('title', post['title']);
            formData.append('icon', post['icon']);
            formData.append('name', post['name']);
            formData.append('descr', post['descr']);
            formData.append('img', post['img']);

            fetch('script_php/savepost.php',{
                method: 'POST',
                body: formData
            });
        }
    }else{
        star.innerHTML = '';
        star.textContent = '☆'
        star.dataset.click = "0";
        let index = isSaved(post['id']);
        if(index !== - 1){
            saved.splice(index, 1);
        }
        fetch('script_php/removepost.php',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(post)
        });
    }

}
/* #endregion */

/* #region ==== GESTIONE NAVBAR ==== */

function resize(){
    let width = window.innerWidth;

    if(width < 1200){
        let nav = document.querySelector('.main-container nav');
        nav.classList.add('hidden');
        nav.classList.remove('flex');
    }else{
        let nav = document.querySelector('.main-container nav');
        nav.classList.add('flex');
        nav.classList.remove('hidden');

        let body = document.querySelector('body');
        body.classList.remove('no-scroll');
    }


}

if(window.innerWidth < 1200){
    let nav = document.querySelector('.main-container nav');
    
    nav.classList.add('hidden');
    nav.classList.remove('flex');
}

window.addEventListener('resize', resize)


function clickMenu(e){
    let shown = e.target.dataset.click;
    let nav = document.querySelector('.main-container nav');
    let body = document.querySelector('body');
    if(shown === '0'){ 
        e.target.dataset.click = '1';
        nav.classList.add('flex');
        nav.classList.remove('hidden');
        nav.style.zIndex=1;
        body.classList.add('no-scroll');
    }else{
        e.target.dataset.click = '0';
        nav.classList.add('hidden');
        nav.classList.remove('flex');
        body.classList.remove('no-scroll');
    }
}

const navbar_menu = document.querySelector('#navbar-menu');
navbar_menu.addEventListener('click', clickMenu);

/* #endregion */

function getImg(url){    
    let ret = "";
    if(ret === ""){
        let index = url.indexOf('.png');
        if(index > 0){
            url = url.substring(0, index+4);
            ret = url;
        }
    }
    if(ret === ""){
        let index = url.indexOf('.jpg');
        if(index > 0){
            url = url.substring(0, index+4);
            ret = url;
        }
    }
    if(ret === ""){
        let index = url.indexOf('.jpeg');
        if(index > 0){
            url = url.substring(0, index+5);
            ret = url;
        }
    }
    return ret;
}