function loadMovieData(id){
    uri = configData.apiAddr + 'titles/' + id;
    return fetch(uri).then(function (res){
        if (res.ok){
            return res.json();
        }
    });

}

function createReturnButton(body, main){
    let returnButtonBlock = createHTMLElement('div', {'className':'movie-details__return-button side'});
    let returnButton = createHTMLElement('p', {'innerHTML':'<'});
    returnButton.addEventListener('click', function(){
        body.removeChild(main);
        displayReception();
    });
    returnButtonBlock.appendChild(returnButton);
    return returnButtonBlock;
}

function createDescription(movieData){
    let description = createHTMLElement('div', {'className':'movie-details__movie__description__description'});
    if (movieData.long_description != movieData.description){
        let longDescription = createHTMLElement(
            'p',
            {
                'className':'movie-details__movie__description__description__text',
                'innerHTML':movieData.long_description
            }
        );
        let shortDescription = createHTMLElement(
            'p',
            {
                'className': 'movie-details__movie__description__description__text active',
                'innerHTML': movieData.description
            }
        );
        let showMore = createHTMLElement('a',{'innerHTML':' Afficher plus'});
        let showLess = createHTMLElement('a',{'innerHTML':' Afficher moins'});
        let changeDescription = function (){
            longDescription.classList.toggle('active');
            shortDescription.classList.toggle('active');
        }
        showMore.addEventListener('click', changeDescription);
        showLess.addEventListener('click', changeDescription);
        longDescription.appendChild(showLess);
        shortDescription.appendChild(showMore);
        description.appendChild(longDescription);
        description.appendChild(shortDescription);
    }else{
        description.appendChild(createHTMLElement(
            'p',
            {
                'className': 'movie-details__movie__description__description__text active',
                'innerHTML': movieData.long_description
            }
        ));
    }
    return description
}

function createDescriptionBlock(movieData){
    let descriptionBlock = createHTMLElement('div', {'className':'movie-details__movie__description'});
    descriptionBlock.appendChild(createHTMLElement(
        'h1',
        {
            'className':'movie-details__movie__description__title',
            'innerHTML': movieData.title
        }
    ));
    let datePublished = movieData.date_published.split('-');
    descriptionBlock.appendChild(createHTMLElement(
        'p',
        {
            'className':'movie-details__movie__description__date',
            'innerHTML': datePublished[2] + ' / ' + datePublished[1] + ' / ' + datePublished[0]
        }
    ));
    descriptionBlock.appendChild(createDescription(movieData));
    descriptionBlock.appendChild(createHTMLElement(
        'p',
        {
            'className':'movie-details__movie__description__actors',
            'innerHTML': movieData.actors.join(', ')
        }
    ));
    descriptionBlock.appendChild(createHTMLElement(
        'p',
        {
            'className': 'movie-details__movie__description__score',
            'innerHTML': '&#128078;&#127996;&#128077;&#127996;</span>: ' + movieData.imdb_score
        }
    ));
    descriptionBlock.appendChild(createHTMLElement(
        'p',
        {
            'className': 'movie-details__movie__description__genre',
            'innerHTML': movieData.genres.join(', ')
        }
    ));
    return descriptionBlock;
}

function createContent(movieData){
    let content = createHTMLElement('div', {'className':'movie-details__movie'});
    let poster = createHTMLElement(
        'img',
        {
            'className':'movie-details__movie__poster',
            'src': movieData.image_url,
            'alt': 'Poster de ' + movieData.title
        }
    );
    content.appendChild(poster);
    let description = createDescriptionBlock(movieData);
    content.appendChild(description);
    return content;
}

function createMainElement(body, movieData){
    let main = createHTMLElement('main',{'className':'movie-details'});
    body.appendChild(main);
    let returnButton = createReturnButton(body, main);
    main.appendChild(returnButton);
    let content = createContent(movieData);
    main.appendChild(content);
    main.appendChild(createHTMLElement('div', {'className':'side'}));
}

function displayMovieDetails(movieData){
    let body = document.getElementsByTagName('body')[0];
    createMainElement(body, movieData);
}

function loadAndDisplayMovie(id){
    loadMovieData(id).then(displayMovieDetails);
}