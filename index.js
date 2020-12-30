const apiKey = '?api_key=77fe21586542a5f94b267c25d0030747'
const base = 'https://api.themoviedb.org/'
const baseSearchApi = `${base}3/search/movie${apiKey}&query=`
const allCardsDiv = document.getElementById("allCards");

//Get category and return json object
function getAPI(category,genreId) {
    let api = ''
    api = apiCategory(category,genreId);
    return fetch(api).then(res => {
        return res.json();
    });
}

//Creates dropdown menu of the genres
async function createGenres(genreId) {
    let response;
    try {
        response = await (getAPI('genre',genreId))
        console.log(response.genres[0])
        response.genres.forEach(genre => {
            genresId.innerHTML += ` <a class="dropdown-item" onclick="run('category',${genre.id})">${genre.name}</a>`
        })
    } catch (err) {
        console.error(err);
    }
}

//Get category(or genreId) and return its api
function apiCategory(category,genreId) {
    switch (category) {
        case 'top_rated':
        case 'popular':
        case 'upcoming':
            return `${base}3/movie/${category}${apiKey}&language=en-US`
        case 'home':
            return `${base}4/list/1${apiKey}`
        case 'search':
            return `${baseSearchApi+inputId.value}`;
        case 'genre':
            return `${base}3/genre/movie/list${apiKey}`;
        case 'category':
            return `${base}3/discover/movie${apiKey}&language=en-US&sort_by=vote_count.desc&with_genres=${genreId}`;
        default:
            break;
    }
}

//Create card for each movie object
function createCard(movie) {
    let myImg = movie.poster_path;
    myImg == null ? myImg = movie.backdrop_path : -1;

    if (myImg != null && movie.overview != '') {
        allCardsDiv.innerHTML += `<div onmouseover="displayHide(this,true)" onmouseout="displayHide(this)" class="card text-dark m-2 col-lg-3 p-0"  style = 'background:#f1faee'>
        <div class="textDiv d-none ">
            <div class="card-header" style='background:#a8dadc' ><h3>${movie.original_title}</h3></div>
            <div class="card-body" style='width:100%; height:350px; overflow:scroll'>
                <p class="card-text">${movie.overview}</p>
                <p><strong>Rate: ${movie.vote_average}/10</strong></p></br>
                <p><strong>Release date: ${movie.release_date}</strong></p></br>
            </div>
        </div>
            <img class='image' src="https://image.tmdb.org/t/p/original/${myImg}" width="100%" height = '450px' alt="">
    </div>`
    }
}

//Display text and hide img and opposite
function displayHide(movie, flag) {
    let targetImg = movie.querySelector('img');
    let targetClass = movie.getElementsByClassName('textDiv')[0];
    if (flag) {
        targetImg.style.display = 'none';
        targetClass.className = 'textDiv';
    } else {
        targetImg.style.display = '';
        targetClass.classList.add('d-none');
    }
}

//Execute main function that run all the program
async function run(category,genreId) {
    createGenres()
    let response;
    try {
        allCardsDiv.innerHTML = '<img src="/loading.gif" alt="">'
        if (category != 'search') {
            response = await getAPI(category,genreId);
            allCardsDiv.innerHTML = ''
            response.results.forEach(movie => {
                createCard(movie)
            });
        } else {
            response = await getAPI(category);
            allCardsDiv.innerHTML = ''
            onSearch(response);
        }

    } catch (err) {
        console.error(err);
    }
}

//Create title, and builds movies by user input
function onSearch(response) {
    let title = inputId.value
    title = title[0].toUpperCase() + title.substr(1);
    titleId.innerText = title
    if (response.results.length > 1) {
        response.results.forEach(movie => {
            createCard(movie)
        });
    } else {
        titleId.innerText = `\"${title}\" ` + ': Not Found'
    }
}

run('home');