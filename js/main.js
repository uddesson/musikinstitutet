// WIP (Work in progress, currently just testing to fetch from API)
const apiKey = `?key=flat_eric`;
const artistsUrl = `https://folksa.ga/api/artists${apiKey}`; 

function fetchAllArtists(){
    fetch(artistsUrl)
        .then((response) => response.json())

        .then((artists) => {
            for (var i = 0; i < artists.length; i++) {
                /* Maybe here we should have a function like "excludeMaleArtists()";   
                That checks if (artist != "male") before the code continues executing */
                
                logInfo(artists[i]); //Shows info about each fetched artists in console
            }
        });
}

fetchAllArtists();

/* logInfo could be used as a helper function to console.log several things at once,
can be further developed so we can use it for several things later! */
function logInfo(element){ 
    console.group("Console Log shows:");
    console.log('id:', element._id)
    console.log('Name:', element.name)
    console.groupEnd();
}