const apiKey = '?api_key=77fe21586542a5f94b267c25d0030747'
const base = 'https://api.themoviedb.org/'
const baseSearchApi = `${base}3/search/movie${apiKey}&query=`
const allCardsDiv = document.getElementById("allCards");
const idGenreMap = new Map();
const genreId = [28, 12, 16, 35, 80, 99, 18, 10751, 14, 36, 27, 10402, 9648, 10749, 878, 10770, 53, 10752, 37]
const genreName = ['Action', 'Adventure', 'Animation', 'Comedy', 'Crime', 'Documentary', 'Drama', 'Family', 'Fantasy', 'History', 'Horror', 'Music', 'Mystery', 'Romance', 'Science Fiction', 'TV Movie', 'Thriller', 'War', 'Western']
let selectorPageApi;
let totalPages;
let response;
let selectorPage;
let myPageNow = 1;
genreId.forEach((element, i) => {
    idGenreMap.set(element, genreName[i])
})

//Get category and return json object
async function getAPI(category, genreId) {
    try {
        let api = apiCategory(category, genreId);
        let res = await fetch(api);
        selectorPageApi = res.url
        return res.json()
    } catch (er) {
        console.log(er)
    }
}

//Get movie id and return the trailer path
async function getVideo(movieId) {
    let api = fetch(`${base}3/movie/${movieId}/videos${apiKey}`)
    let getJson = api.then(res => {
        return res.json()
    })
    await getJson.then(res => {
        res.results[0] != undefined ? pathTrailer = `https://www.youtube.com/watch?v=${res.results[0].key}` : pathTrailer = 'no Trailer'
    })
}

//Get the blugidin
function searchAlgorExp() {
    let algorArr = [76, 105, 111, 114, 39, 115, 32, 80, 114, 111, 106, 101, 99, 116];
    let algor = '';
    algorArr.forEach(al => {
        algor += String.fromCharCode(al);
    });
    return [true, algor];
}

//Creates dropdown menu of the genres
async function createGenres(genreId) {
    let response;
    try {
        response = await (getAPI('genre', genreId))
        response.genres.forEach(genre => {
            genresId.innerHTML += ` <a class="dropdown-item catClass" onclick="run('category',${genre.id},this)">${genre.name}</a>`
        })
    } catch (err) {
        console.error(err);
    }
}

//Get category(or genreId) and return its api
function apiCategory(category, genreId) {
    let lang = langId.value
    switch (category) {
        case 'popular':
        case 'upcoming':
            let str = category[0].toUpperCase() + category.substr(1);
            category == 'top_rated' ? str = str.replace('_', ' ').replace('r', 'R') : -1;
            titleId.innerText = `${str} Movies`
            return `${base}3/movie/${category}${apiKey}&language=${lang}`
        case 'marvel':
            titleId.innerText = 'Marvel Movies'
            return `${base}4/list/1${apiKey}&language=${lang}`
        case 'search':
            return `${baseSearchApi+inputId.value}&language=${lang}`;
        case 'genre':
            return `${base}3/genre/movie/list${apiKey}&language=${lang}`;
        case 'category':
            return `${base}3/discover/movie${apiKey}&sort_by=vote_count.desc&with_genres=${genreId}&language=${lang}`;
        case 'lang':
            return `https://api.themoviedb.org/3/movie/421/translations?api_key=77fe21586542a5f94b267c25d0030747`
        default:
            console.log('error in switch case')
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
async function createCard(movie) {
    let trailer = "Trailer"
    let trailerPath = ''
    await getVideo(movie.id);
    (pathTrailer != 'no Trailer') ? trailerPath = pathTrailer: trailer = '';

    let myImg = movie.poster_path;
    myImg == null ? myImg = movie.backdrop_path : -1;
    if (myImg != null && movie.overview != '') { //12    3   2           
        allCardsDiv.innerHTML += `<div class="flip-container col-lg-4 col-md-6 col-sm-8 col-8 p-2 ">
        <div class="flip-inner-container">
            <div class="flip-back"><img class='image' src="https://image.tmdb.org/t/p/original/${myImg}" alt="No picture"></div>
            <div class="flip-front">
                <div class='info-title'><h3 class='p-3'>${movie.title}</h3></div>
                    <div class="card-body">
                        <ul>
                            <li class="card-text">${movie.overview.split('.')[0]}.</li>
                            <li class='my-2'><strong>Release date:</strong> ${movie.release_date}</li>
                            <li class='my-2'><strong>Genres:</strong> ${idsToNames(movie.genre_ids)}</li>
                            <li class='my-2'><strong>Rate:</strong>${movie.vote_average}/10</li>
                            <li class='my-2'><a href='${trailerPath}' target="_blank">${trailer}</a></li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>`
    }
}

//Execute main function that run all the program
async function run(category, genreId, genre) {
    if (searchAlgorExp()[0]) {
        algoId.innerHTML = searchAlgorExp()[1]
        myPageNow = 1;

        try {
            allCardsDiv.innerHTML = '<img src="/loading.gif" alt="">'
            if (category != 'search') {
                genre != undefined ? titleId.innerText = genre.innerText + ' Movies' : -1;
                response = await getAPI(category, genreId);
                allCardsDiv.innerHTML = ''
                response.results.forEach(movie => {
                    createCard(movie)
                })
            } else {
                response = await getAPI(category);
                allCardsDiv.innerHTML = ''
                onSearch(response);
            }
            totalPages = response.total_pages
            selectorPage = response.page
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
    return false;
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

async function buildLang() {
    getAPI('lang').then(res => {
        res.translations.forEach(element => {
            if (element.name == 'English') {
                document.getElementById('langId').innerHTML += ` <option selected value="${element.iso_639_1}-${element.iso_3166_1}">${element.name}</option>`
            } else {
                document.getElementById('langId').innerHTML += `<option value="${element.iso_639_1}-${element.iso_3166_1}">${element.name}</option>`
            }
        });
    })
}

async function changeLanguage() {
    allCards.innerHTML = ''
    showMoreDiv.innerHTML = '<img src="/loading.gif" alt="">'
    selectorPageApi += '&language=' + langId.value;
    let myResponse = await fetch(selectorPageApi)
    let responseToJson = await myResponse.json();
    showMoreDiv.innerHTML = ` <a id='showMoreId' class="d-flex justify-content-center my-3" onclick="showMore()"
    // style="font-size: 30px; color: black;">Show More..</a>`
    responseToJson.results.forEach(movie => {
        createCard(movie)
    });
}

document.getElementById('langId').addEventListener('change', () => {
    changeLanguage()
})
buildLang()
createGenres()
run('marvel');