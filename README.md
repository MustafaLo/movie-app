# Movie-App
This is a simple React App that utilizes the OMDB API to allows users to search for hundreds of movies and bookmark their favourite ones. It also has a 'Reccomend Movie' movie feature that uses OpenAI's Text-Davinci model to reccomend a new movie based on the user's current favourited movies.

### Getting Started
To get started, make sure you have npm installed and run
```
npm run
```

### Open AI Integration
To enable the 'Reccomend Movie' feature, run this command in your terminal at the project's directory
```
touch .env
```

Next, create an enviornment variable named the following and add your own Open AI API Key
```
REACT_APP_OPENAI_API_KEY=""
```



