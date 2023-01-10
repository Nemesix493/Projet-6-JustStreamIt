# Projet-6-JustStreamIt
## What it is
A graphical interface inspired by netflix to display movie categories and movie dettails from [OCMovies-API](https://github.com/OpenClassrooms-Student-Center/OCMovies-API-EN-FR).
## Installation
You just have to donwload the code then setup the settings.
## Settings
The settings file is /public/JavaScript/config.js :
- apiAddr : your OCMovie-API URL
- numberOfMovieSeclectedByCategory : the number of movie you want display in each category
- categoriesToPrint : is a list of the categories you want display using this patern
    ``` js
    {
        'key':'category name in the API',
        'name':'Category title to display'
    }
    ```
If you want change any scss code don't forget to recompile and prefix it.