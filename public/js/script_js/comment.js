const postId = document.querySelector('#postId').dataset.info;

function deleteComment(e){
    const id = e.target.parentElement.parentElement.parentElement.dataset.id;
    e.target.parentElement.parentElement.parentElement.remove();
    fetch("/deleteComment/"+id);
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
    if(typeof element['account_id'] !== 'undefined'){
        await fetch('/getUsername/'+element['account_id']).then((response) => {
            return response.json();
        }).then((json) =>{
            userDiv.textContent = json;
        })
    }else{
        userDiv.textContent = element['username'];
    }

    if(typeof element['created_at'] !== 'undefined'){
        dateString = element['created_at'];
    }else{
        dateString = element['post_date'];
    }
    const date = new Date(dateString);

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    // Formattare la data come dd/mm/yyyy
    dataDiv.textContent = '•    ' + `${day}/${month}/${year}`;

    topDiv.appendChild(userDiv);
    topDiv.appendChild(dataDiv);
    commentDiv.appendChild(topDiv);
    
    contentDiv.textContent = element['content'];
    containerDiv.appendChild(contentDiv);
    commentDiv.appendChild(containerDiv);
    commentDiv.dataset.id=element['id'];

    let myUsername;
    await fetch('/getUsername').then((response) => {
        return response.json();
    }).then((json) => {
        myUsername = json;
    });

    if(myUsername == userDiv.textContent){
        const modifyDiv = document.createElement('a');
        modifyDiv.classList.add("modify");
        modifyDiv.textContent = "Delete";
        modifyDiv.addEventListener('click', deleteComment);
        contentDiv.appendChild(modifyDiv);
    }
    
    main.append(commentDiv);
    
}

function loadComment(){
    fetch('/getPostComment/'+postId).then((response) => {
        return response.json();
    }).then((json) => {
        console.log(json)
        const main = document.querySelector("#main");
        json.forEach(element => {
            console.log(element);
            postComment(main, element);
        });   
    });
}


const endpoint = '/getPostInfo/';
const url = endpoint + postId;
let data;

fetch(url).then((response) =>{
    return response.json();
}).then((json)=>{
    console.log(json)
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
        if(img){
            postDiv.appendChild(imgDiv);
        }
        main.appendChild(postDiv);
    }
}).then(loadComment);

async function commentClick(){
    const log = await isLogged();

    if(!log){
        loginClick();
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
    document.querySelector('#commentError').classList.add('hidden');
    
    const log = await isLogged();

    if(log){

        const content = formComment.content.value;
        formData = new FormData();
        formData.append('content', content);
        formData.append('postId', postId);
        const token_csrf = await get_token_csrf();
        const response = await fetch("/commentPost",{
            method: "POST",
            body: formData,
            headers: {
              'X-CSRF-TOKEN': token_csrf
            }
        });

        let comment_id;

        await response.json().then((json) => {
            comment_id = json;
        })

        let myUsername;
        await fetch('/getUsername').then((response) => {
            return response.json();
        }).then((json) => {
            myUsername = json;
        });
        
        formComment.content.value = '';
        console.log("Commented");

        const date = new Date();
        const element = {
            post_date: date,
            username: myUsername,
            content: content,
            id : comment_id

        }
        postComment(document.querySelector('#post'), element);


    }else{
        document.querySelector('#commentError').classList.remove('hidden');
    }
}

formComment.addEventListener('submit', comment);
