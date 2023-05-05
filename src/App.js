import{ useEffect, useState} from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import MovieList from './components/MovieList';
import MovieListHeading from './components/MovieListHeading';
import Search from './components/Search'
import AddFavorites from './components/AddFavorites';
import RemoveFavorites from './components/RemoveFavorites';
import ReccomendMovie from './components/ReccomendMovie';
import "./App.css"
import {Configuration, OpenAIApi} from 'openai'


function App() {
 const [movies, setMovies] = useState([]) 
 const [search, setSearch] = useState('')
 const [favorites, setFavorites] = useState([])

 
 const config = new Configuration({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY
 })

 const openai = new OpenAIApi(config)

 const generatePrompt = () => {
    let favoriteMovieTitles = ''
    favorites.forEach((movie) => {
      favoriteMovieTitles += movie.Title + ', '
    })

    return "Please reccomend me a similar movie with ONLY the title name and no other information based on this list of movies: " + favoriteMovieTitles
 }
 
 const generateResponse = async () => {
  let options = {
      model: 'text-davinci-003',
      temperature: 0.2,
      max_tokens: 100,
      frequency_penalty: 0.0,
      presence_penalty: 0.0,
      stop: ['/'],
  };

  let completeOptions = {
      ...options,
      prompt: generatePrompt(),
  };

  const response = await openai.createCompletion(completeOptions)
  console.log(response.data.choices[0].text)

  if (response.data.choices) {
    setSearch(response.data.choices[0].text)
  }
  
  };
  
 

 const getMovieRequest = () => {
  const url = "http://www.omdbapi.com/?s=" + search + "&apikey=c436f225"
  fetch(url)
    .then(res => {
      return res.json()
  })
    .then(data => {
      if(data.Search){
        setMovies(data.Search)
      }
    })
      
  }



  //watch the search value and only call getMovieRequest once it changes
  useEffect(() => {
    getMovieRequest()
  }, [search])


  //Once the application loads, get all the movies you favorited from your local storage and setFavorites as them
  //This ensures that even if the page is reloaded, your favorites still get saved and loaded onto the application
  // ***NOTE: The "[]" parameters means call useEffect only ONCE when the application intially starts up
  useEffect(() => {
    const movieFavorites = JSON.parse(localStorage.getItem('react-movie-app-favorites'))

    //Cannot read length property of null (later on) so have to setFavorties to []
    if(movieFavorites == null){
      setFavorites([])
    }
    else{
      setFavorites(movieFavorites)
    }
  }, [])

  //Saves the movie list (items) to local storage so that we remember what we set as our favorites
  const saveToLocalStorage = (items) => {
    localStorage.setItem('react-movie-app-favorites', JSON.stringify(items))
  }

  const addFavoriteMovie = (movie) => {
    //Make a new copy of an array the "..." and add the new movie to it with "[...favorties,movie]"

    //IMPORTANT: setFavorites(favorites.push(movie)) does NOT WORK

    const newFavorites = [...favorites, movie]

    setFavorites(newFavorites)
    saveToLocalStorage(newFavorites)
  }


  const removeFavoriteMovie = (movie) => {
     const newFavorites = favorites.filter((favorite) => favorite.imdbID !== movie.imdbID)
     setFavorites(newFavorites)
     saveToLocalStorage(newFavorites)
  }


  return (
    //bootstrap classes
    <div className="container-fluid movie-app">

      <div className= "row d-flex align-items-center m-4">
        <MovieListHeading heading="Movie List"/>

        <ReccomendMovie generateResponse={generateResponse}/>

        {/* Pass in the states: search and setSearch, to the Search component*/}
        {/* Must pass in search and setSearch states because CHILD Components CANNOT pass data to parent components (in this case Search.js to App.js)*/}
        <Search search={search} setSearch={setSearch}/>
      </div>

    
      
  


      {/*Pass in the list of movies the user searched for and the Favorities component to render */}
      <div className="row">
        <MovieList movies={movies} handleButtonClick={addFavoriteMovie}  AddOrRemoveFavorites={AddFavorites}/>
      </div>

      

      <div className= "row d-flex allign-items-center m-4">
        {(favorites.length !== 0) && <MovieListHeading heading="Favorites"/>}
      </div>



      {/* Render new movie list except this time pass in the favorited movies */}
      <div className="row">
        <MovieList movies={favorites} handleButtonClick={removeFavoriteMovie}  AddOrRemoveFavorites={RemoveFavorites}/>
      </div>




    </div>

    



  );
 }
 
export default App;
 

