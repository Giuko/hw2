const endpoint = 'script_php/fetchNoOauth.php?request=';
const request = '/'+document.querySelector('#subredditInfo').dataset.info + '/about.json';
const url = endpoint + request;

// La funzione serve per ottenere le informazioni riguardo i subreddit e successivamente popolare la pagina web
function getInfo(){
    fetch(url).then(onResponse, onFailure).then((json) => {
        const title = json.data.title;
        let icon = json.data.icon_img;
        const descr = json.data.public_description;
        const descr2 = json.data.submit_text;
        let banner = json.data.banner_background_image;

        const titleDiv = document.querySelector('.title');
        titleDiv.textContent = title;

        const descrDiv = document.querySelector('#descr');
        descrDiv.textContent = descr;

        const descr2Div = document.querySelector('#descr2');
        descr2Div.textContent = descr2;

        console.log(descr2);

        const bannerDiv = document.querySelector('#banner');

        const iconDiv = document.querySelector('#icon');

        if(icon === ""){
            icon = getImg(json.data.community_icon);
        }
        if(icon !== ""){
            const imgIcon = document.createElement('img');
            iconDiv.appendChild(imgIcon);
            icon = getImg(icon);
            iconDiv.querySelector('img').src = icon;
            
        }

        if(banner !== ""){
            const imgBanner = document.createElement('img');
            bannerDiv.appendChild(imgBanner);
            banner = getImg(banner);
            bannerDiv.querySelector('img').src = banner;
            
        }
    })
}

getInfo();