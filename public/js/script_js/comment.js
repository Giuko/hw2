const postId = document.querySelector('#postId').dataset.info;
let retValue;
function deleteComment(e){
    const id = e.target.parentElement.parentElement.parentElement.dataset.id;
    e.target.parentElement.parentElement.parentElement.remove();
    fetch("script_php/deleteComment.php?id="+id);
}

async function postComment(main, element){
    
    const commentDiv = document.createElement('section');
    const topDiv = document.createElement('div');
    const userDiv = document.createElement('div');
    const dataDiv = document.createElement('div');
    const containerDiv = document.createElement('div');
    const contentDiv = document.createElement('div');
    

    contentDiv.classList.add("content");
    containerDiv.classList.add("content-container");
    dataDiv.classList.add("data");
    userDiv.classList.add("user");
    topDiv.classList.add("flex");
    topDiv.classList.add("flex-start");
    topDiv.classList.add("align-center");
    topDiv.classList.add("top");
    commentDiv.classList.add("comment");

    userDiv.textContent = element['username'];
    dateString = element['post_date'];
    // Creare un oggetto Date
    const date = new Date(dateString);

    // Estrarre il giorno, mese e anno
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // I mesi vanno da 0 a 11, quindi aggiungiamo 1
    const year = date.getFullYear();

    // Formattare la data come dd/mm/yyyy
    dataDiv.textContent = '•    ' + `${day}/${month}/${year}`;

    topDiv.appendChild(userDiv);
    topDiv.appendChild(dataDiv);
    commentDiv.appendChild(topDiv);
    
    contentDiv.textContent = element['content'];
    containerDiv.appendChild(contentDiv);
    commentDiv.appendChild(containerDiv);

    // Solo se utente che ha postato e utente loggato sono uguali
    //element['username']

    const formData = new FormData();
    formData.append('username', element['username']);
    await fetch('script_php/checkUsername.php',  {
        method: 'POST',
        body: formData
    }).then((response)=>{
        return response.json();
    }).then((json) => {
        if(json){
            const modifyDiv = document.createElement('a');
            modifyDiv.classList.add("modify");
            modifyDiv.textContent = "Delete";
            modifyDiv.addEventListener('click', deleteComment);
            contentDiv.appendChild(modifyDiv);
        }
    });
    if(element['id'] !== 'undefined'){
        commentDiv.dataset.id=element['id'];   
    }
    main.append(commentDiv);

}

function loadComment(){
    fetch('script_php/getPostComment.php?id='+postId).then((response) => {
        return response.json();
    }).then((json) => {
        if(json !== 0){
            console.log(json);
            const main = document.querySelector("#main");
            json.forEach(element => {
                postComment(main, element);
            });   
        }
    });
}


const endpoint = 'script_php/getPostInfo.php?id=';
const request = postId;
const url = endpoint + request;
let data;

fetch(url).then((response) =>{
    return response.json();
}).then((json)=>{
    data = json;
    if(data === 0){
        document.querySelector('.errore').classList.remove('hidden');
    }else{
        const main = document.querySelector('#post');

        const title = data['title'];
        const icon = data['icon'];
        const subreddit = data['name'];
        const descr = data['descr'];
        const img = data['img'];

        const postDiv = document.createElement('div');
        postDiv.id = 'postDiv';

        const subredditDiv = document.createElement('div');
        subredditDiv.id = 'subredditDiv';
        subredditDiv.classList.add('flex');
        subredditDiv.classList.add('flex-start');
        subredditDiv.classList.add('align-center');

        const subredditName = document.createElement('a');
        subredditName.textContent = subreddit;
        subredditName.href = 'about.php?subreddit='+subreddit;

        const subredditIcon = document.createElement('img');
        subredditIcon.src = icon;

        subredditDiv.appendChild(subredditIcon);
        subredditDiv.appendChild(subredditName);

        const titleDiv = document.createElement('div');
        titleDiv.id = 'titleDiv';
        titleDiv.textContent = title

        const descrDiv = document.createElement('div');
        descrDiv.id = 'descrDiv';
        descrDiv.textContent = descr;

        const imgElement = document.createElement('img');
        imgElement.src = img;

        const imgDiv = document.createElement('div');
        imgDiv.id = 'imgDiv';
        imgDiv.appendChild(imgElement);
        imgDiv.classList.add('flex');
        imgDiv.classList.add('flex-center');

        postDiv.appendChild(subredditDiv);
        postDiv.appendChild(titleDiv);
        postDiv.appendChild(descrDiv);
        postDiv.appendChild(imgDiv);
        main.appendChild(postDiv);
    }
}).then(loadComment);

// async function commentClick(){
//     let isLogged;
//     await fetch('script_php/checkIfLogged.php').then((response) => {
//         return response.json();
//     }).then((json) => {
//         isLogged = json;
//     })
//     if(!isLogged){
//         loginClick();
//         return;
//     }
// }

async function commentClick(){
    let isLogged;

    await fetch("script_php/checkIfLogged.php").then((response)=>{
        return response.json();
    }).then((json) =>{
        isLogged=json;
    });

    if(!isLogged){
        document.querySelector('#commentError').classList.remove('hidden');
    }else{    
        if(document.querySelector('#formComment').classList.contains('hidden')){
            document.querySelector('#formComment').classList.remove('hidden');
        }else{
            document.querySelector('#formComment').classList.add('hidden');
        }
    }
}

const commentButton = document.querySelector('#comment');
commentButton.addEventListener('click', commentClick);

const formComment = document.forms['formComment'];

async function comment(e){
    e.preventDefault();
    let isLogged;
    document.querySelector('#commentError').classList.add('hidden');
    await fetch("script_php/checkIfLogged.php").then((response)=>{
        return response.json();
    }).then((json) =>{
        isLogged=json;
    });

    if(isLogged){

        const content = formComment.content.value;
        formData = new FormData();
        formData.append('content', content);
        formData.append('postId', postId);
        await fetch("script_php/submitComment.php",{
            method: "POST",
            body: formData
        });
        formComment.content.value = '';
        console.log("Commented");

        const date = new Date();
        const element = {
            post_date: date,
            username: 'Me',
            content: content

        }
        postComment(document.querySelector('#post'), element);


    }else{
        document.querySelector('#commentError').classList.remove('hidden');
    }
}

formComment.addEventListener('submit', comment);
