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
    let main = document.createElement('main');
    body.appendChild(main);
    main.className = 'movie-details';
    let returnButtonBlock = document.createElement('div');
    returnButtonBlock.className = 'movie-details__return-button';
    let returnButton = document.createElement('p');
    returnButton.innerHTML = '<';
    returnButtonBlock.appendChild(returnButton);
    let content = document.createElement('div');
    main.appendChild(returnButton);
    main.appendChild(content);
    main.appendChild(document.createElement('div'));
    content.className = 'movie-details__movie';
    let poster = document.createElement('img');
    poster.src = movieData.image_url;
    poster.className = 'movie-details__movie__poster';
    content.appendChild(poster);
    let descriptionBlock = document.createElement('div');
    content.appendChild(descriptionBlock);
    descriptionBlock.className = 'movie-details__movie__description';
    returnButton.addEventListener('click', function(){
        body.removeChild(main);
        displayReception();
    });

}

function loadAndDisplayMovie(id){
    loadMovieData(id).then(displayMovieDetails);
}