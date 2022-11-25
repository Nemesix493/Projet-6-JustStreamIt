function newElement(tag, className, innerHTML=null){
    let element = document.createElement(tag);
    element.className = className;
    if (innerHTML != null){
        element.innerHTML = innerHTML;
    }
    return element
}

function loadMovieData(id){
    uri = configData.apiAddr + 'titles/' + id;
    return fetch(uri).then(function (res){
        if (res.ok){
            return res.json();
        }
    });

}

function displayMovieDetails(movieData){
    let body = document.getElementsByTagName('body')[0];
    let main = newElement('main','movie-details');
    body.appendChild(main);
    let returnButtonBlock = newElement('div', 'movie-details__return-button side');
    let returnButton = newElement('p', '', '<');
    returnButtonBlock.appendChild(returnButton);
    let content = newElement('div', 'movie-details__movie');
    main.appendChild(returnButtonBlock);
    main.appendChild(content);
    main.appendChild(newElement('div', 'side'));
    let poster = newElement('img', 'movie-details__movie__poster');
    poster.src = movieData.image_url;
    content.appendChild(poster);
    let descriptionBlock = newElement('div', 'movie-details__movie__description');
    content.appendChild(descriptionBlock);
    returnButton.addEventListener('click', function(){
        body.removeChild(main);
        displayReception();
    });
    descriptionBlock.appendChild(newElement('h1', 'movie-details__movie__description__title', movieData.title));
    let datePublished = movieData.date_published.split('-');
    descriptionBlock.appendChild(newElement(
        'p',
        'movie-details__movie__description__date',
        datePublished[2] + ' / ' + datePublished[1] + ' / ' + datePublished[0]
    ));
    let description = newElement('div', 'movie-details__movie__description__description');
    if (movieData.long_description != movieData.description){
        let longDescription = newElement('p', 'movie-details__movie__description__description__text', movieData.long_description);
        let shortDescription = newElement('p', 'movie-details__movie__description__description__text active', movieData.description);
        let showMore = newElement('a', '', ' Afficher plus');
        let showLess = newElement('a', '', ' Afficher moins');
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
        description.appendChild(newElement('p', 'movie-details__movie__description__description__text active', movieData.long_description));
    }
    descriptionBlock.appendChild(description);
    descriptionBlock.appendChild(newElement('p', 'movie-details__movie__description__actors', movieData.actors.join(', ')));
    descriptionBlock.appendChild(newElement('p', 'movie-details__movie__description__score', '&#128078;&#127996;&#128077;&#127996;</span>: ' + movieData.imdb_score));
    descriptionBlock.appendChild(newElement('p', 'movie-details__movie__description__genre', movieData.genres.join(', ')));


}

function loadAndDisplayMovie(id){
    loadMovieData(id).then(displayMovieDetails);
}