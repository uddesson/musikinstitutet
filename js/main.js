// WIP
const apiKey = `?key=flat_eric`;
const artistsUrl = `https://folksa.ga/api/artists${apiKey}`; 


/******************
 ***** Model? *****
 ******************/
const Model = {

    fetchArtistsThatArentMale(){
        fetch(artistsUrl)
            .then((response) => response.json())
            .then((artists) => {
                // Loop through all the artists
                for (var i = 0; i < artists.length; i++) {
                    if(Model.artistIsNotMale(artists[i]) == true){
                        View.displayArtistName(artists[i].name); 
                    };     
                }
            })

            .catch(error => { 
                // Some reusable function here that displays a generic error-msg to the user
                console.log(error);
            });
    },

    artistIsNotMale(artist){
        if(artist.gender !== 'male'){
            Model.logInfo(artist); // Just for seeing what's in there
            return true;   
        }
        else{
            return false;
        }
    },

    /* This logInfo-function can be used to console.log several things at once,
    and be further developed so we can use it for several things later! */
    logInfo(element){ 
        console.group("Console Log shows:");
        console.log('id:', element._id)
        console.log('Name:', element.name)
        console.log('Gender:', element.gender)
        console.groupEnd();
    }
} // Closing Model





/******************
 ***** View? *****
 ******************/
const View = {
    testList: document.getElementById('test-list'),

     //Testing: Displaying some output
     displayArtistName(artistname){
        let listItem = document
            .createElement('li');
        listItem.innerText = artistname;
        View.testList.appendChild(listItem);
     }
}

Model.fetchArtistsThatArentMale();