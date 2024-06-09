const feed = document.querySelector('#feed');
let feedContent = Array.from(document.querySelectorAll('#feed .article'));

fetch("/loadSaved").then((response) => {
    return response.json();
}).then((json) => {
    saved = json;
    console.log(json);
    for(let i = 0; i < saved.length; i++){
        createArticle(i);
    }
});

function loadSaved(index){
    let article = feedContent[index];
    let post = saved[index];
    
    let postId = post['postid'];
    let subredditName = post['name'] ?? '';
    let subredditIcon = post['icon'] ?? '';
    let titleText = post['title'] ?? '';
    let descrText = post['descr'] ?? '';
    let imagePost = post['img'] ?? '';

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
    subDiv2.textContent = '★';
    subDiv2.dataset.click = "1";

    subDiv2.addEventListener('mouseenter', enterStar);
    subDiv2.addEventListener('mouseleave', leaveStar);
    subDiv2.addEventListener('click', clickStar);

    let icon = document.createElement('div');
    icon.classList.add('icon');
    icon.classList.add('flex');
    icon.classList.add('flex-center');
    icon.classList.add('align-center');

    let img = document.createElement('img');
    img.src = subredditIcon;

    icon.appendChild(img);

    let name = document.createElement('div');
    name.classList.add('name');
    name.textContent = subredditName;

    let title = document.createElement('div');
    title.classList.add('title');

    let text = document.createElement('div');
    text.classList.add('text');
    text.classList.add('truncate');

    let divImg = document.createElement('div');
    divImg.classList.add('flex');
    divImg.classList.add('divImg');
    divImg.classList.add('flex-center');
    divImg.classList.add('align-center');
    
    let imgArticle = document.createElement('img');
    
    title.textContent = titleText;
    
    text.textContent = descrText;


    subDiv1.appendChild(icon);
    subDiv1.appendChild(name);

    subred.appendChild(subDiv1);
    subred.appendChild(subDiv2);

    externDiv.appendChild(subred);
    externDiv.appendChild(title);
    externDiv.appendChild(text);
    if(!imagePost){
        imagePost = '';
    }
    imgArticle.src = imagePost;
    divImg.appendChild(imgArticle);
    
    externDiv.appendChild(divImg); 
    const link = document.createElement('a');
    link.href = '/comment/' + postId;
    link.appendChild(externDiv);
    article.dataset.id = postId;
    article.appendChild(link); 
}

function createArticle(index){
    let feed = document.querySelector('#feed');
    let docToLoad = 1;
    for (let i = 0; i < docToLoad; i++) {
        let item = document.createElement('article');
        let item_content = document.createElement('div');
        item.classList.add('item');
        item.dataset.index = feedContent.length + 1;
        item.dataset.id = saved[index]['id'];
        item_content.classList.add('insert');
        item.appendChild(item_content);
        feedContent.push(item);
        feed.appendChild(item);
    }
    loadSaved(index);
}