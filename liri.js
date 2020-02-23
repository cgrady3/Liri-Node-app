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
        choices: ['Concerts', 'Movies', 'Music', 'Search by Text File', 'Exit Program'],
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
    },
    {
        type: 'input',
        name: 'movieName',
        message: 'What movie would you like to search?',
        when: function (response) {
            if (response.selectedCommand === 'Movies') {
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
            case 'Movies':
                searchMovies(response.movieName);
                break;
            case 'Exit Program':
                done = true;
                return;
        };
    });

// bands in town
// use inquire to get bandName
// use momentjs to get time stamp conversions
function searchConcerts(bandName) {
    axios({
        method: 'get',
        url: 'https://rest.bandsintown.com/artists/' + bandName + '/events?app_id=codingbootcamp',
        responseType: 'json'
    }).then(function (response) {

        for (i = 0; i < response.data.length; i++) {

            console.log('----------------------------------')
            console.log('Performing at ' + response.data[i].venue.name);
            console.log('In ' + response.data[i].venue.city + ', ' + response.data[i].venue.country);
            console.log('On ' + moment(response.data[i].datetime).format('L') + ' at ' + moment(response.data[i].datetime).format('LT'));
            console.log('----------------------------------')
            fs.appendFileSync('log.txt', '----------------------------------\n');
            fs.appendFileSync('log.txt', 'Performing at ' + response.data[i].venue.name + '\n');
            fs.appendFileSync('log.txt', 'In ' + response.data[i].venue.city + ', ' + response.data[i].venue.country + '\n');
            fs.appendFileSync('log.txt', 'On ' + moment(response.data[i].datetime).format('L') + ' at ' + moment(response.data[i].datetime).format('LT') + '\n');
            fs.appendFileSync('log.txt', '----------------------------------\n');
        };
    });
}

// spotify
// use inquire to get songName
function searchSpotify(songName) {

    let spotify = new Spotify(keys.spotify);

    if (!songName) {
        songName = 'thesign';
    }

    spotify.search({
        type: 'track',
        query: songName,
        limit: 10,
    }, function (err, response) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }
        else {
            var songs = response.tracks.items;

            console.log('----------queried song info----------');

            for (var i = 0; i < songs.length; i++) {
                console.log('--------------------------');
                console.log('Song #' + (i + 1));
                console.log('Song name: ' + songs[i].name);
                console.log('Album: ' + songs[i].album.name);
                console.log('Artist(s): ' + songs[i].artists[0].name);
                console.log('Listen Here: ' + songs[i].album.external_urls.spotify);
                console.log('----------------------------');
                fs.appendFileSync('log.txt', '----------------------------------\n');
                fs.appendFileSync('log.txt', 'Song #' + (i + 1) + '\n');
                fs.appendFileSync('log.txt', 'Song name: ' + songs[i].name + '\n');
                fs.appendFileSync('log.txt', 'Album: ' + songs[i].album.name + '\n');
                fs.appendFileSync('log.txt', 'Artist(s): ' + songs[i].artists[0].name + '\n');
                fs.appendFileSync('log.txt', 'Listen Here: ' + songs[i].album.external_urls.spotify + '\n');
                fs.appendFileSync('log.txt', '----------------------------------\n');
            }
        }

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

// searches OMDb to return information about a queried movie
function searchMovies(movieName) {

    if (!movieName) {
        movieName = 'mr.nobody';
        console.log('If you haven\'t watched "Mr. Nobody," then you should click the link below!');
        console.log('http://www.imdb.com/title/tt0485947/')
    }

    axios({
        method: 'get',
        url: 'http://www.omdbapi.com/?t=' + movieName + '&apikey=' + keys.OMDb.key + '',
        responseType: 'json'
    }).then(function (response) {

        console.log('----------------------------------');
        console.log('Title: ' + response.data.Title);
        console.log('Release Year: ' + response.data.Year);
        console.log('IMDB Rating: ' + response.data.Ratings[0].Value);
        console.log('Rotten Tomatoes Rating: ' + response.data.Ratings[1].Value);
        console.log('Produced in ' + response.data.Country);
        console.log('Language: ' + response.data.Language);
        console.log('Plot ' + response.data.Plot);
        console.log('Actors ' + response.data.Actors);
        console.log('----------------------------------');
        fs.appendFileSync('log.txt', '----------------------------------\n');
        fs.appendFileSync('log.txt', 'Title: ' + response.data.Title + '\n');
        fs.appendFileSync('log.txt', 'Release Year: ' + response.data.Year + '\n');
        fs.appendFileSync('log.txt', 'IMDB Rating: ' + response.data.Ratings[0].Value + '\n');
        fs.appendFileSync('log.txt', 'Rotten Tomatoes Rating: ' + response.data.Ratings[1].Value + '\n');
        fs.appendFileSync('log.txt', 'Produced in ' + response.data.Country + '\n');
        fs.appendFileSync('log.txt', 'Language: ' + response.data.Language + '\n');
        fs.appendFileSync('log.txt', 'Plot ' + response.data.Plot + '\n');
        fs.appendFileSync('log.txt', 'Actors ' + response.data.Actors + '\n');
        fs.appendFileSync('log.txt', '----------------------------------\n');
    });
}

