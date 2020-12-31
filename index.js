const apiKey = '?api_key=77fe21586542a5f94b267c25d0030747'
const base = 'https://api.themoviedb.org/'
const baseSearchApi = `${base}3/search/movie${apiKey}&query=`
const allCardsDiv = document.getElementById("allCards");
const idGenreMap = new Map();
const genreId = [28, 12, 16, 35, 80, 99, 18, 10751, 14, 36, 27, 10402, 9648, 10749, 878, 10770, 53, 10752, 37]
const genreName = ['Action', 'Adventure', 'Animation', 'Comedy', 'Crime', 'Documentary', 'Drama', 'Family', 'Fantasy', 'History', 'Horror', 'Music', 'Mystery', 'Romance', 'Science Fiction', 'TV Movie', 'Thriller', 'War', 'Western']
let selectorPageApi;
let totalPages;
let selectorPage;
let myPageNow = 1;
genreId.forEach((a, i) => {
    idGenreMap.set(genreId[i], genreName[i])
})

//Get category and return json object
function getAPI(category, genreId) {
    let api = ''
    api = apiCategory(category, genreId);
    return fetch(api).then(res => {
        selectorPageApi = res.url
        return res.json();
    });
}

//Get The Blugidin
function searchAlgorExp() {
    let algorArr = [76, 105, 111, 114, 39, 115, 32, 80,114,111,106,101,99,116];
    let algor= '';
    algorArr.forEach(al => {
        algor += String.fromCharCode(al);
    });
    return [true,algor];
}

//Creates dropdown menu of the genres
async function createGenres(genreId) {
    let response;
    try {
        response = await (getAPI('genre', genreId))
        response.genres.forEach(genre => {
            genresId.innerHTML += ` <a class="dropdown-item" onclick="run('category',${genre.id},this)">${genre.name}</a>`
        })
    } catch (err) {
        console.error(err);
    }
}

//Get category(or genreId) and return its api
function apiCategory(category, genreId) {
    switch (category) {
        case 'top_rated':
        case 'popular':
        case 'upcoming':
            let str = category[0].toUpperCase() + category.substr(1);
            category == 'top_rated' ? str = str.replace('_', ' ').replace('r', 'R') : -1;
            titleId.innerText = `${str} Movies`
            return `${base}3/movie/${category}${apiKey}&language=en-US`
        case 'marvel':
            titleId.innerText = 'Marvel Movies'
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

//Get array ids of genres and return array with name of genres
function idsToNames(array) {
    let rdyNames = ''
    array.forEach(name => {
        rdyNames += `${idGenreMap.get(name)}, `
    });
    return rdyNames.substr(0, rdyNames.length - 2) + '.';
}
//Create card for each movie object
function createCard(movie) {
    let myImg = movie.poster_path;
    myImg == null ? myImg = movie.backdrop_path : -1;
    if (myImg != null && movie.overview != '') {
        allCardsDiv.innerHTML += `<div class="flip-container col-4 p-2 ">
        <div class="flip-inner-container ">
            <div class="flip-back">
                <img class='image' src="https://image.tmdb.org/t/p/original/${myImg}" width="100%" height='100%' alt="">
            </div>
            <div class="flip-front" style='background:#0f4c75; color:white'>
                    <h3 class='my-2 p-2 text-center'><strong>${movie.original_title}</strong></h3><hr>

                    <div class="card-body">
                    <ul>
                        <li class="card-text">${movie.overview.split('.')[0]}.</li>
                        <li class='my-2'><strong>Release date:</strong> ${movie.release_date}</li>
                        <li class='my-2'><strong>Genres:</strong> ${idsToNames(movie.genre_ids)}</strong></li>
                        <li class='my-2'><strong>Rate:</strong>${movie.vote_average}/10</li>
                    </ul>
                </div>
            </div>
        </div>
    </div>`
    }
}

//Execute main function that run all the program
async function run(category, genreId, genre) {
    if(searchAlgorExp()[0]){
        algoId.innerHTML = searchAlgorExp()[1]
        myPageNow = 1;
        let response;
        try {
            allCardsDiv.innerHTML = '<img src="/loading.gif" alt="">'
            if (category != 'search') {
                genre != undefined ? titleId.innerText = genre.innerText + ' Movies' : -1;
                response = await getAPI(category, genreId);
                allCardsDiv.innerHTML = ''
                response.results.forEach(movie => {
                    createCard(movie)
                });
    
            } else {
                response = await getAPI(category);
                allCardsDiv.innerHTML = ''
                onSearch(response);
            }
            totalPages = response.total_pages
            selectorPage = response.page
            showMoreDiv.innerHTML = ` <a id='showMoreId' class="d-flex justify-content-center my-3" onclick="showMore()"
            style="font-size: 30px; color: black;">Show More..</a>`
        } catch (err) {
            console.error(err);
        }
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

//Show more movies on click showMore link
async function showMore() {
    try {
        if (myPageNow < totalPages) {
            showMoreDiv.innerHTML = '<img src="/loading.gif" alt="">'
            myPageNow++
            selectorPageApi += '&page=' + myPageNow;
            let myResponse = await fetch(selectorPageApi)
            let responseToJson = await myResponse.json();
            showMoreDiv.innerHTML = ` <a id='showMoreId' class="d-flex justify-content-center my-3" onclick="showMore()"
            // style="font-size: 30px; color: black;">Show More..</a>`
            if (responseToJson.results.length > 1) {
                responseToJson.results.forEach(movie => {
                    createCard(movie)
                });
            }
            myPageNow == totalPages ? showMoreDiv.innerHTML = '' : -1;

        } else {
            showMoreDiv.innerHTML = ''
        }
    } catch (err) {
        console.error(err);
    }
}



createGenres()
run('marvel');