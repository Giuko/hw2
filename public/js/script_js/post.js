
class Post{
    constructor(id, title, content, thumb, subreddit_icon, subreddit_name){
        this.id = id;
        this.title = title;
        this.content = content;
        this.thumb = thumb;
        this.subreddit = {
            icon: subreddit_icon,
            name: subreddit_name
        }
    }
}

async function loadPosts(value){
    console.log("Loading topic: " + value);
    const posts = [];
    const query = `/search.json?q=${value}&limit=10`
    console.log(query);
    const url = 'script_php/fetchNoOauth.php?request=' + query;
    
    json = await fetch(url).then(onResponse, onFailure);
    console.log('loadPost: '+ JSON.stringify(json));
    const data = json.data;
    const num = data.dist;
    for(let i = 0; i < num; i++){
        const info = data.children[i].data;
        
        const id = info.id;
        const title = info.title;
        let content = info.selftext;
        // if(content.length > 403){
        //     content = content.substring(0, 400) + "...";
        // }
        let thumb = info.thumbnail;
        thumb = getImg(thumb);
        
        const subreddit = info.subreddit_name_prefixed;
    
        const subreddit_request = `/${subreddit}/about.json`;
        const subreddit_url = 'script_php/fetchNoOauth.php?request='+subreddit_request; 
        let ico = '';
        const jsonSubreddit = await fetch(subreddit_url).then(onResponse, onFailure)
        
        const infoSubreddit = jsonSubreddit.data;
        ico = getImg(infoSubreddit.icon_img);
        if(ico === ""){
            ico = getImg(infoSubreddit.community_icon);
        }
        const post = new Post(id, title, content, thumb, ico, subreddit);

        const formData = new FormData();
        formData.append('id', id);
        formData.append('title', title);
        formData.append('icon', ico);
        formData.append('name', subreddit); 
        formData.append('descr', content); 
        formData.append('img', thumb); 

        await fetch("script_php/inDBPost.php",{
            method: 'POST',
            body: formData
        });

        posts.push(post);

    }
    return posts;
    
}