let receptionData = {};

function printCategory(categoryKey, order, slice){
    sliceCategory(categoryKey, slice);

    let category = createHTMLElement(
        'section',
        {
            "className": "categories__category"
        }
    );
    category.style.order = order;
    let title = createHTMLElement(
        'h1',
        {
            "className": "categories__category__title",
            "innerHTML": receptionData.categories[categoryKey].name
        }
    );
    category.appendChild(title);
    let carousel = createHTMLElement(
        'div',
        {
            "className": "categories__category__carousel"
        }
    );
    category.appendChild(carousel);
    let buttonLeft = createHTMLElement(
        'div',
        {
            "className": "categories__category__carousel__arrow-button"
        }
    );
    let buttonRight = createHTMLElement(
        'div',
        {
            "className": "categories__category__carousel__arrow-button"
        }
    );
    let leftArrow = createHTMLElement(
        'div',
        {
            "innerHTML": "<"
        }
    );
    let rightArrow = createHTMLElement(
        'div',
        {
            "innerHTML": ">"
        }
    );
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
        let movieImage = createHTMLElement(
            'img',
            {
                "src": movie.imgLink,
                "className": "categories__category__carousel__movie",
                "alt": "poster de " + movie.title,
                "id": movie.id
            }
        );
        
        movieImage.addEventListener('click',function(ev){
            let body = document.getElementsByTagName('body')[0];
            body.removeChild(receptionData.content);
            loadAndDisplayMovie(movieImage.id)
        });
        carousel.appendChild(movieImage);
    }
    receptionData.content.appendChild(category);
}

function sliceCategory(categoryKey, slice){
    let newMoviesArray = [];
    for(let i = 0; i < receptionData.categories[categoryKey].movies.length; i++){
        if(i >= slice[0] && i < slice[1]){
            newMoviesArray.push(receptionData.categories[categoryKey].movies[i]);    
        }
    }
    receptionData.categories[categoryKey].movies = newMoviesArray;
}

function loadCategoryData(categoryKey, uri, order, slice=null){
    let numberOffMovie;
    let catSlice;
    if(slice != null){
        numberOffMovie = slice[1];
        catSlice = slice;
    }else{
        numberOffMovie = configData.numberOfMovieSeclectedByCategory;
        catSlice = [0, numberOffMovie];
    }
    fetch(uri).then(function(res){
        if (res.ok){
            return res.json();
        }
    }).then(function(value){
        let count = 0;
        while(count < value.results.length && receptionData.categories[categoryKey].movies.length < numberOffMovie){
            receptionData.categories[categoryKey].movies.push({
                'imgLink': value.results[count].image_url,
                'title': value.results[count].title,
                'id':value.results[count].id
            });
            count += 1;
        }
        if (value.hasOwnProperty('next') && receptionData.categories[categoryKey].movies.length < numberOffMovie){
            loadCategoryData(categoryKey, value.next, order, catSlice);
        }else{
            printCategory(categoryKey, order, catSlice);
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
    let bestMovie = createHTMLElement(
        'section',
        {
            "className": "categories__best-movie"
        }
    );

    receptionData.content.appendChild(bestMovie);
    let descriptionBlock = createHTMLElement(
        'div',
        {
            "className": "categories__best-movie__description"
        }
    );
    let img = createHTMLElement(
        'img',
        {
            "className": "categories__best-movie__poster",
            "src": receptionData.bestMovie.image_url,
            "alt": "Poster de " + receptionData.bestMovie.title
        }
    );
    let title = createHTMLElement(
        'h1',
        {
            "innerHTML": receptionData.bestMovie.title
        }
    );
    bestMovie.appendChild(img);
    bestMovie.appendChild(descriptionBlock)
    descriptionBlock.appendChild(title);
    let datePublished = receptionData.bestMovie.date_published.split('-');
    let publishDate = createHTMLElement(
        'p',
        {
            "innerHTML": 'Sortie le : ' + datePublished[2] + ' / ' + datePublished[1] + ' / ' + datePublished[0]
        }
    );
    descriptionBlock.appendChild(publishDate);
    let score = createHTMLElement(
        'p',
        {
            "innerHTML": 'IMDB : ' + receptionData.bestMovie.imdb_score + ' &#11088;'
        }
    );
    descriptionBlock.appendChild(score);
    let description = createHTMLElement(
        'p',
        {
            "innerHTML": 'Description : ' + receptionData.bestMovie.description
        }
    );
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
    loadCategoryData('bestMovies', uri, '1', [1, configData.numberOfMovieSeclectedByCategory+1]);
    for (let i = 0; i< configData.categoriesToPrint.length; i++){
        loadAndPrintCategory(configData.categoriesToPrint[i].key, configData.categoriesToPrint[i].name, (i+2).toString());
    }
    
}

function initReception(){
    receptionData.categories = {};
    receptionData.content = createHTMLElement(
        'main',
        {
            'id': 'categoriesList',
            'className': 'categories'
        }
    );
    let body = document.getElementsByTagName('body')[0];
    body.appendChild(receptionData.content);
    loadPages();
}

function displayReception(){
    let body = document.getElementsByTagName('body')[0];
    body.appendChild(receptionData.content);
}

initReception();
