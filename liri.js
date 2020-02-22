const dotenv = require('dotenv').config();
const axios = require('axios').default;
const fs = require('fs');
const keys = require('./keys.js');
const Spotify = require('node-spotify-api');
const inquirer = require('inquirer');
const moment = require('moment');

// end program flag
let done = false

// program user promps questions
let inquaries = [
    {
        type: 'list',
        name: 'selectedCommand',
        message: 'Which category would you like to search?',
        choices: ['Concerts', 'Music', 'Search by Text File', 'Exit Program'],
    },
    {
        type: 'input',
        name: 'songName',
        message: 'What song would you like to search for?',
        when: function (response) {
            if (response.selectedCommand === 'Music') {
                return true;
            }
        }
    },
    {
        type: 'input',
        name: 'bandName',
        message: 'Who would you like to find performances of?',
        when: function (response) {
            if (response.selectedCommand === 'Concerts') {
                return true;
            }
        }
    }

]

//inquirer
inquirer
    .prompt(inquaries)
    .then(function (response) {

        switch (response.selectedCommand) {

            case 'Music':
                searchSpotify(response.songName);
                break;
            case 'Search by Text File':
                readingFile();
                break;
            case 'Concerts':
                searchConcerts(response.bandName);
                break;
            case 'Exit Program':
                done = true;
                return;
        };
    });

// bands in town
// use inquire to get bandName
function searchConcerts(bandName) {
    axios({
        method: 'get',
        url: "https://rest.bandsintown.com/artists/" + bandName + "/events?app_id=codingbootcamp",
        responseType: 'json'
    }).then(function (response) {

        for (i = 0; i < response.data.length; i++) {

            console.log('----------------------------------')
            console.log('Performing at ' + response.data[i].venue.name);
            console.log('In ' + response.data[i].venue.city + ', ' + response.data[i].venue.country);
            console.log('On ' + moment(response.data[i].datetime).format('L') + ' at ' + moment(response.data[i].datetime).format('LT'));
            console.log('----------------------------------')
        };
    });
}

// spotify
// use inquire to get songName
function searchSpotify(songName) {

    let spotify = new Spotify(keys.spotify);

    spotify.search({
        type: 'track',
        query: songName,
        limit: 10,
    }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        } else {
            // console.log(data.tracks.items[1])
            var songs = data.tracks.items;

            console.log('----------queried song info----------');

            for (var i = 0; i < songs.length; i++) {
                console.log('--------------------------');
                console.log('Song #' + (i + 1));
                console.log('Song name: ' + songs[i].name);
                console.log('Album: ' + songs[i].album.name);
                console.log('Artist(s): ' + songs[i].artists[0].name);
                console.log('Listen Here: ' + songs[i].album.external_urls.spotify);
                console.log('----------------------------');
            }
        }
        // console.log(data);
    });
}

// Reads the random text file and passes it to the spotify function
function readingFile() {

    fs.readFile('random.txt', 'utf8', function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        } else {
            console.log(data)
            searchSpotify(data);
        }
    });
}

































// axios
// Make a request for a user with a given ID
// axios.get('/user?ID=')
//     .then(function (response) {
//         // handle success
//         console.log(response);
//     })
//     .catch(function (error) {
//         // handle error
//         console.log(error);
//     })
//     .finally(function () {
//         // always executed
//     });

// // GET request for remote image
// axios({
//     method: 'get',
//     url: 'http://bit.ly/2mTM3nY',
//     responseType: 'stream'
// })
//     .then(function (response) {
//         response.data.pipe(fs.createWriteStream('ada_lovelace.jpg'))
//     });

// // OMDb API
// // Send all data requests to:

// // http://www.omdbapi.com/?apikey=[]&

// // Poster API requests:

// // http://img.omdbapi.com/?apikey=[]&