const dotenv = require("dotenv").config();
const axios = require('axios').default;
const fs = require('fs');
const keys = require("./keys.js");
const Spotify = require('node-spotify-api');
const inquirer = require('inquirer');

function readingFile() {
    // Reads the random text file and passes it to the spotify function
    
    fs.readFile("random.txt", "utf8", function(err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }
        
        getSpotify(data);
    });
}

//spotify
// use inquire to get songName
function getSpotify(songName) {
    let spotify = new Spotify(keys.spotify);
    
    spotify.search({
        type: 'track',
        query: 'All the Small Things',
        limit: 20
    }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }
    
        console.log(data);
    });
}



































// axios
// Make a request for a user with a given ID
axios.get('/user?ID=')
    .then(function (response) {
        // handle success
        console.log(response);
    })
    .catch(function (error) {
        // handle error
        console.log(error);
    })
    .finally(function () {
        // always executed
    });

// GET request for remote image
axios({
    method: 'get',
    url: 'http://bit.ly/2mTM3nY',
    responseType: 'stream'
})
    .then(function (response) {
        response.data.pipe(fs.createWriteStream('ada_lovelace.jpg'))
    });

// OMDb API
// Send all data requests to:

// http://www.omdbapi.com/?apikey=[]&

// Poster API requests:

// http://img.omdbapi.com/?apikey=[]&