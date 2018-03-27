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
                
            }
        });
}

fetchAllArtists();
