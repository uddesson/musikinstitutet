// WIP (Work in progress, currently just testing to fetch from API)
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
                for (var i = 0; i < artists.length; i++) {
                    
                    Model.checkIfNotMale(artists[i]);     
                }
            })
            .catch(error => { 
                // Some reuasble function here that displays a generic error-msg to the user
                console.log(error);
            });
    },

    checkIfNotMale(artist){
        if(artist.gender !== 'male'){
            Model.logInfo(artist);
            View.displayArtistNames(artist.name); 
        }
    },

    /* This logInfo-function could be used as a helper function to console.log several things at once,
    can be further developed so we can use it for several things later! */
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
     displayArtistNames(artistname){
        let listItem = document
            .createElement('li');
        listItem.innerText = artistname;
        View.testList.appendChild(listItem);
     }
 }

 Model.fetchArtistsThatArentMale();