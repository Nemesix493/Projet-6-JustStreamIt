let receptionData = {};

function printCategory(categoryKey, order){
    let category = document.createElement('section');
    category.style.order = order;
    category.className = 'categories__category';
    let title = document.createElement('h1');
    title.className = 'categories__category__title';
    title.innerHTML = receptionData.categories[categoryKey].name;
    category.appendChild(title);
    let carousel = document.createElement('div');
    carousel.className = 'categories__category__carousel';
    category.appendChild(carousel);
    let buttonLeft = document.createElement('div');
    let buttonRight = document.createElement('div');
    buttonLeft.className = 'categories__category__carousel__arrow-button';
    buttonRight.className = 'categories__category__carousel__arrow-button';
    let leftArrow = document.createElement('div');
    let rightArrow = document.createElement('div');
    leftArrow.innerHTML = '<';
    rightArrow.innerHTML = '>';
    buttonLeft.appendChild(leftArrow);
    buttonRight.appendChild(rightArrow);
    carousel.appendChild(buttonLeft);
    carousel.appendChild(buttonRight);
    buttonRight.addEventListener('click', function (event){
        let movie = carousel.childNodes[2];
        carousel.removeChild(movie);
        carousel.appendChild(movie);
    })
    buttonLeft.addEventListener('click', function (event){
        let movieNumber = carousel.childNodes.length-1;
        let movie = carousel.childNodes[movieNumber];
        carousel.removeChild(movie);
        carousel.insertBefore(movie, carousel.childNodes[2]);
    })
    for (const movie of receptionData.categories[categoryKey].movies){
        let movieImage = document.createElement('img');
        movieImage.src = movie.imgLink;
        movieImage.className = 'categories__category__carousel__movie';
        movieImage.alt = 'poster de ' + movie.title;
        movieImage.id = movie.id;
        movieImage.addEventListener('click',function(ev){
            let body = document.getElementsByTagName('body')[0];
            body.removeChild(receptionData.content);
            loadAndDisplayMovie(movieImage.id)
        });
        carousel.appendChild(movieImage);
    }
    receptionData.content.appendChild(category);
}

function loadCategoryData(categoryKey, uri, order){
    fetch(uri).then(function(res){
        if (res.ok){
            return res.json();
        }
    }).then(function(value){
        let count = 0;
        while(count < value.results.length && receptionData.categories[categoryKey].movies.length < configData.numberOfMovieSeclectedByCategory){
            receptionData.categories[categoryKey].movies.push({
                'imgLink': value.results[count].image_url,
                'title': value.results[count].title,
                'id':value.results[count].id
            });
            count += 1;
        }
        if (value.hasOwnProperty('next') && receptionData.categories[categoryKey].movies.length < configData.numberOfMovieSeclectedByCategory){
            loadCategoryData(categoryKey, value.next);
        }else{
            printCategory(categoryKey, order);
        }
    });

}

function loadAndPrintCategory(categoryKey, categoryName, order){
    let uri = configData.apiAddr + 'titles/?sort_by=-imdb_score&genre=' + categoryKey;
    receptionData.categories[categoryKey] = {};
    receptionData.categories[categoryKey].name = categoryName
    receptionData.categories[categoryKey].movies = [];
    loadCategoryData(categoryKey, uri, order);
}

function printBestMovie(){
    let bestMovie = document.createElement('section');
    receptionData.content.appendChild(bestMovie);
    bestMovie.className = 'categories__best-movie';
    let descriptionBlock = document.createElement('div');
    descriptionBlock.className = 'categories__best-movie__description';
    let img = document.createElement('img');
    img.className = 'categories__best-movie__poster';
    img.src = receptionData.bestMovie.image_url;
    img.alt = 'Poster de ' + receptionData.bestMovie.title;
    let title = document.createElement('h1');
    title.innerHTML = receptionData.bestMovie.title;
    bestMovie.appendChild(img);
    bestMovie.appendChild(descriptionBlock)
    descriptionBlock.appendChild(title);
    let publishDate = document.createElement('p');
    let datePublished = receptionData.bestMovie.date_published.split('-');
    publishDate.innerHTML = datePublished[2] + ' / ' + datePublished[1] + ' / ' + datePublished[0];
    descriptionBlock.appendChild(publishDate);
    let score = document.createElement('p');
    score.innerHTML = '&#128078;&#127996;&#128077;&#127996;</span>: ' + receptionData.bestMovie.imdb_score;
    descriptionBlock.appendChild(score);
    let description = document.createElement('p');
    description.innerHTML = receptionData.bestMovie.description;
    descriptionBlock.appendChild(description);
    bestMovie.addEventListener('click', function(){
        let body = document.getElementsByTagName('body')[0];
        body.removeChild(receptionData.content);
        loadAndDisplayMovie(receptionData.bestMovie.id);
    })
}

function loadAndPrintBestMovie(){
    let uri = configData.apiAddr + 'titles/?sort_by=-imdb_score';
    fetch(uri).then(function (res){
        if (res.ok){
            return res.json();
        }
    }).then(function (value){
        fetch(value.results[0].url).then(function (res){
            if (res.ok){
                return res.json();
            }
        }).then(function (completeValue){
            receptionData.bestMovie = completeValue;
            printBestMovie();
        });
    });
}

function loadPages(){
    loadAndPrintBestMovie();
    let uri = configData.apiAddr + 'titles/?sort_by=-imdb_score';
    receptionData.categories.bestMovies = {};
    receptionData.categories.bestMovies.name = 'Les meilleurs films';
    receptionData.categories.bestMovies.movies = [];
    loadCategoryData('bestMovies', uri, 1);
    for (let i = 0; i< configData.categoriesToPrint.length; i++){
        loadAndPrintCategory(configData.categoriesToPrint[i].key, configData.categoriesToPrint[i].name, i+2);
    }
    
}

function initReception(){
    receptionData.categories = {};
    receptionData.content = document.createElement('main')
    receptionData.content.id = 'categoriesList';
    receptionData.content.className = 'categories';
    let body = document.getElementsByTagName('body')[0];
    body.appendChild(receptionData.content);
    loadPages();
}

function displayReception(){
    let body = document.getElementsByTagName('body')[0];
    body.appendChild(receptionData.content);
}

initReception();


