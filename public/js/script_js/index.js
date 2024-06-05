const feed = document.querySelector('#feed');
const feedContent = Array.from(document.querySelectorAll('#feed article'));
let headContent = Array.from(document.querySelectorAll('#head .item'));
const sidebarList = document.querySelector('#popular-communities-list');
const sidebar = document.querySelector('#sidebar');

const head_array = [];
const subreddit_array = [];
let post_array = [];


class Head{
    constructor(article, title, description, name, icon){
        this.article = article;
        this.title = title;
        this.description = description;
        this.name = name;
        this.icon = icon;
    }
}

class Subreddit{
    constructor(icon, name, members){
        this.icon = icon;
        this.name = name;
        this.members = members;
    }
}

// Funzione che gestisce i click nell'header

function onClick(){
    let button_previous = document.querySelector('#previous-head');
    let button_next = (document.querySelector('#next-head'));
    
    let items = document.querySelectorAll('#head .item');

    if(button_previous.classList.contains('hidden')){
        
        button_previous.classList.remove('hidden');
        button_next.classList.add('hidden');

        for(let item of items){
            let index = parseInt(item.dataset.index);
            item.style.backgroundImage = head_array[index].article;
            item.querySelector('.title').textContent = head_array[index].title;
            item.querySelector('.description').textContent = head_array[index].description;
            item.querySelector('.name').textContent = head_array[index].name;
            item.querySelector('img').src = head_array[index].icon;
        }
    }else{        
        button_previous.classList.add('hidden');
        button_next.classList.remove('hidden');

        for(let item of items){
            let index = parseInt(item.dataset.index) - 1;
            item.style.backgroundImage = head_array[index].article;
            item.querySelector('.title').textContent = head_array[index].title;
            item.querySelector('.description').textContent = head_array[index].description;
            item.querySelector('.name').textContent = head_array[index].name;
            item.querySelector('img').src = head_array[index].icon;
        }
    }

}



function loadMoreContent(){
    let feed = document.querySelector('#feed');
    let docToLoad = 1;
    for (let i = 0; i < docToLoad; i++) {
        let item = document.createElement('article');
        let item_content = document.createElement('div');
        item.classList.add('item');
        item.dataset.index = feedContent.length + 1;
        item_content.classList.add('insert');
        item.appendChild(item_content);
        feedContent.push(item);
        feed.appendChild(item);
        loadContent();
    }
}

//Funzione che gestisce il blocco laterale con i subreddit
function onCLickMore(event){
    let t = event.currentTarget;
    e=t;
    let div = document.createElement('div');

    div.classList.add('text');
    div.classList.add('flex');
    div.classList.add('flex-center');
    
    t.innerHTML = '';
    sidebarList.innerHTML = '';

    let numToIterate;
    if(t.dataset.mode === 'more'){
        document.querySelector('#sidebar').style.height = '500px';
        t.dataset.mode = 'less';
        div.textContent = 'See less';

        numToIterate = subreddit_array.length;
    }else{
        document.querySelector('#sidebar').style.height = '394px';
        t.dataset.mode = 'more';
        div.textContent = 'See more';

        numToIterate = 4;
    }

    for(let i = 0; i < numToIterate; i++){
        let item = document.createElement('div');
        item.classList.add('item');
        let container = document.createElement('div');
        container.classList.add('container');
        container.classList.add('flex');
        let content = document.createElement('div');
        content.classList.add('content');
        content.classList.add('flex');
        let image = document.createElement('div');
        image.classList.add('image');
        let img = document.createElement('img');
        img.src = subreddit_array[i].icon;
        let text = document.createElement('div');
        text.classList.add('text');
        text.classList.add('flex');
        let name = document.createElement('div');
        name.classList.add('name');
        name.textContent = subreddit_array[i].name;
        let members = document.createElement('div');
        members.classList.add('members');
        members.textContent = subreddit_array[i].members;
        text.appendChild(name);
        text.appendChild(members);
        image.appendChild(img);
        content.appendChild(image);
        content.appendChild(text);
        container.appendChild(content);
        item.appendChild(container);
        sidebarList.appendChild(item);
        let link = document.createElement('a');
        link.href = 'about.php?subreddit='+name.textContent;
        link.appendChild(item);
        sidebarList.appendChild(link);
    }

    t.appendChild(div);
}

let previous_head = document.querySelector('#previous-head');
previous_head.addEventListener("click", onClick);

let next_head = (document.querySelector('#next-head'));
next_head.addEventListener("click", onClick);

let more = document.querySelector('#more');
more.addEventListener("click", onCLickMore)


function onEnterSearch(e){
    if(e.key === "Enter"){
        let value = encodeURIComponent(searchbar.value);
        loadPosts(value).then((value) => {
            post_array = value;
            console.log('Post loaded');
            loadContent();
        });
    }
}

const searchbar = document.querySelector('#searchbar');
searchbar.addEventListener("keyup", onEnterSearch)





function recentClick(e){
    let r = e.currentTarget;
    let recentContent = Array.from(document.querySelectorAll(".main-container .subnav [data-recent = '1'] .recent"));
    let door = document.querySelector('[data-navtype = recent] .door');
    if(parseInt(r.dataset.click) === 0){
        r.dataset.click = 1;
        door.textContent = '^';
        for(let recent of recentContent){
            recent.classList.add('flex');
            recent.classList.remove('hidden');
        }
    }else{
        r.dataset.click = 0;
        door.textContent = 'V';
        for(let recent of recentContent){
            recent.classList.remove('flex');
            recent.classList.add('hidden');
        }
    }
}

let recent = document.querySelector('[data-navtype = recent]');
recent.addEventListener('click', recentClick);

let topics = document.querySelector('[data-navtype = topics]');
let resources = document.querySelector('[data-navtype = resources]');

function firstHeadLoad(){
    let items = document.querySelectorAll('#head .item');
    for(let item of items){
        let index = parseInt(item.dataset.index) - 1;
        item.style.backgroundImage = head_array[index].article;
        item.querySelector('.title').textContent = head_array[index].title;
        item.querySelector('.description').textContent = head_array[index].description;
        item.querySelector('.name').textContent = head_array[index].name;
        item.querySelector('img').src = head_array[index].icon;
    }   
}

function firstSidebarLoad(){
    sidebarList.innerHTML = '';

    document.querySelector('#sidebar').style.height = '394px';

    for(let i = 0; i < 4; i++){
        let item = document.createElement('div');
        item.classList.add('item');
        let container = document.createElement('div');
        container.classList.add('container');
        container.classList.add('flex');
        let content = document.createElement('div');
        content.classList.add('content');
        content.classList.add('flex');
        let image = document.createElement('div');
        image.classList.add('image');
        let img = document.createElement('img');
        img.src = subreddit_array[i].icon;;
        let text = document.createElement('div');
        text.classList.add('text');
        text.classList.add('flex');
        let name = document.createElement('div');
        name.classList.add('name');
        name.textContent = subreddit_array[i].name;
        let members = document.createElement('div');
        members.classList.add('members');
        members.textContent = subreddit_array[i].members;
        text.appendChild(name);
        text.appendChild(members);
        image.appendChild(img);
        content.appendChild(image);
        content.appendChild(text);
        container.appendChild(content);
        item.appendChild(container);
        let link = document.createElement('a');
        link.href = 'about.php?subreddit='+name.textContent;
        link.appendChild(item);
        sidebarList.appendChild(link);
    }
    recentLoad();
}

function recentLoad(){
    let recent = Array.from(document.querySelectorAll(".main-container .subnav [data-recent = '1']"));
    for(let i = 0; i < 3; i++){
        let externDiv = document.createElement('div');
        externDiv.classList.add('hidden');
        externDiv.classList.add('align-center');
        externDiv.classList.add('flex-start');
        externDiv.classList.add('recent');

        let divImg = document.createElement('div');
        divImg.classList.add('image');
        let img = document.createElement('img');
        img.src = subreddit_array[i].icon;
        divImg.appendChild(img);

        let divText = document.createElement('div');
        divText.classList.add('text');
        divText.classList.add('flex');
        divText.classList.add('align-center');
        divText.classList.add('flex-start');
        divText.textContent = subreddit_array[i].name;

        externDiv.appendChild(divImg);
        externDiv.appendChild(divText);

        let link = document.createElement('a');
        link.href = 'about.php?subreddit='+divText.textContent;
        link.appendChild(externDiv);
        sidebarList.appendChild(link);

        recent[i].appendChild(link);
    }
}

/* #region ==== HEAD ==== */
async function getIcon(subreddit){
    const url = `/noOauth/${subreddit}`;
    const response = await fetch(url);
    let jsonResponse;
    await response.text().then((json) => {
        jsonResponse = json;
    })
    console.log(jsonResponse);
    // const icon = await fetch(url).then(onResponse, onFailure).then((json) => {
    //     console.log('getIcon: ' + JSON.stringify(json));
    //     let ico = getImg(json.data.icon_img);
    //     if(ico === ""){
    //         ico = getImg(json.data.community_icon);
    //     }
    //     return ico;
    // });
    // return icon;
}

async function onHeadJson(json){
    let nels = json.data.dist;
    
    const array = [];
    for(let i = 0; i < nels; i++){
        let t = json.data.children[i].data.thumbnail;
        
        if(t.endsWith('.jpg') || t.endsWith('.jpeg') || t.endsWith('.png')){
            array.push(json.data.children[i]);
        }
    }
    let nelsFiltered = array.length;
    if(nelsFiltered > 5){
        nelsFiltered = 5;
    }
    
    for(let i = 0; i < nelsFiltered; i++){
        let text = array[i].data.title;
        const title = text.substring(0, 15);
        const subreddit = array[i].data.subreddit_name_prefixed;
        const thumbnail = array[i].data.thumbnail;
        if(text.length >= 33){
            text = text.substring(0, 30) + "...";
        }
        await getIcon(array[i].data.subreddit).then(iconUrl =>{
            head = new Head(`url(${thumbnail})`,title, text, subreddit, iconUrl);
            head_array.push(head);
        })
    }
    
    firstHeadLoad();
}

async function HeadLoading(){
    await fetch("/headLoad").then(onResponse, onFailure).then(onHeadJson);
}
/* #endregion */

/* #region ==== SUBREDDIT ==== */
function onSubredditInfoJson(json){
    
    let icon = getImg(json.data.community_icon);
    if(icon === ""){
        icon = getImg(json.data.icon_img);
    }

    const name = 'r/'+json.data.display_name;
    const members = json.data.subscribers.toLocaleString('it-IT') + " members"; //Per portare il numero in una stringa con la separazione delle migliaia con i punti

    subreddit = new Subreddit(icon, name, members);
    subreddit_array.push(subreddit);
    
}

async function onBestJson(json){
    let visited = [];
    console.log('onBest: ' + JSON.stringify(json));
    for(let i = 0; i < json.data.dist; i++){
        let name = json.data.children[i].data.subreddit_name_prefixed;
        if(!visited.includes(name)){
            visited.push(name);
        }
    }
    let promise = [];
    for(let i = 0; i < visited.length; i++){
        const request = `/${visited[i]}/about.json`;
        const url = 'script_php/fetchNoOauth.php?request='+request; 
        await (fetch(url).then(onResponse, onFailure).then(onSubredditInfoJson));
    }         
    firstSidebarLoad();
}

async function loadSubreddit(){
    const request = `/best.json`;
    const url = 'script_php/fetchNoOauth.php?request='+request; 
    const json = await fetch(url).then(onResponse, onFailure);
    await onBestJson(json);
}
/* #endregion */

/* #region ==== FEED ==== */
function loadContent(){
    for(let i = 0; i < feedContent.length; i++){
        const article = feedContent[i];
        const index = (article.dataset.index - 1) % post_array.length;

        const id_post = post_array[index].id;
        const title_post = post_array[index].title;
        const content_post = post_array[index].content;
        const thumb_post = post_array[index].thumb;
        const subreddit_icon_post = post_array[index].subreddit['icon'];
        const subreddit_name_post = post_array[index].subreddit['name'];

        article.innerHTML = '';

        let externDiv = document.createElement('div');
        externDiv.classList.add('insert');
        externDiv.classList.add('flex');
        externDiv.classList.add('flex-column');
        let subred = document.createElement('div');
        subred.classList.add('subreddit');
        subred.classList.add('flex');
        subred.classList.add('align-center');
        subred.classList.add('space-between');

        let subDiv1 = document.createElement('div');
        subDiv1.classList.add('flex');
        subDiv1.classList.add('align-center');
        subDiv1.classList.add('flex-center');


        let subDiv2 = document.createElement('div');
        subDiv2.classList.add('star');
        subDiv2.textContent = '☆';
        subDiv2.dataset.click = "0";

        subDiv2.addEventListener('mouseenter', enterStar);
        subDiv2.addEventListener('mouseleave', leaveStar);
        subDiv2.addEventListener('click', clickStar);

        let icon = document.createElement('div');
        icon.classList.add('icon');
        icon.classList.add('flex');
        icon.classList.add('flex-center');
        icon.classList.add('align-center');



        let img = document.createElement('img');
        img.src = subreddit_icon_post;

        icon.appendChild(img);

        let name = document.createElement('div');
        name.classList.add('name');
        name.textContent = subreddit_name_post;
        
        let title = document.createElement('div');
        title.classList.add('title');

        let text = document.createElement('div');
        text.classList.add('text');
        text.classList.add('truncate');

        let divImg = document.createElement('div');
        divImg.classList.add('divImg');
        divImg.classList.add('flex');
        divImg.classList.add('flex-center');
        divImg.classList.add('align-center');
        
        let imgArticle = document.createElement('img');
        
        // imgArticle.width = json.data.children[index].data.thumbnail_width;
        // imgArticle.height = json.data.children[index].data.thumbnail_height;

        title.textContent = title_post;

        article.dataset.id = id_post;
        
        text.textContent = content_post;


        subDiv1.appendChild(icon);
        subDiv1.appendChild(name);

        subred.appendChild(subDiv1);
        subred.appendChild(subDiv2);

        externDiv.appendChild(subred);
        externDiv.appendChild(title);
        externDiv.appendChild(text);
        
        if(thumb_post !== ''){
            imgArticle.src = thumb_post;
            divImg.appendChild(imgArticle);
            externDiv.appendChild(divImg); 
        }

        const link = document.createElement('a');
        link.href = 'comment.php?postId=' + article.dataset.id;
        link.appendChild(externDiv);
        article.appendChild(link);
        
    }
}
/* #endregion */


HeadLoading();
loadSubreddit();
loadPosts('new').then((value) => {
    post_array = value;
    console.log('Post loaded');
    loadContent();
});