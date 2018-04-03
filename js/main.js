const apiKey = `?key=flat_eric`;
const baseUrl = `https://folksa.ga/api`; 

/******************
 ** Controllers ***
 ******************/

const GenderController = {
    excludeMaleArtists(artist){
        let artists = artist.filter(artist => artist.gender !== 'male');
        return artists;
    }
}


/******************
 ***** Models *****
 ******************/
//const FetchModel = {
//
//    fetchArtists(){
//        fetch(url)
//            .then((response) => response.json())
//            .then((artists) => {
//                    sortedArtists = GenderController.excludeMaleArtists(artists);
//                    for (var artist of sortedArtists){
//                        TestModel.logInfo(artist);
//                        ArtistView.displayArtistName(artist.name);
//                    };     
//                }
//            )       
//
//            .catch(error => { 
//                // Some reusable function here that displays a generic error-msg to the user
//                console.log(error);
//            });
//    }
//}

//TEMPORARY CONSTS FOR FETCH URL
const id = '5aae2dd4b9791d0344d8f719';
const category = 'albums';
const searchQuery = 'shakira';

const FetchModel = {
	fetchAll(category){
		return fetch(`${baseUrl}/${category}/${apiKey}`)
			.then(response => response.json())
			.catch(error => console.log(error));
	},
	fetchOne(category, id){
		return fetch(`${baseUrl}/${category}/${id}/${apiKey}`)
			.then(response => response.json())
			.then(response => console.log(response))
			.catch(error => console.log(error));
	},
	fetchSearched(category, searchQuery){
		return fetch(`${baseUrl}/${category}/?title=${searchQuery}/${apiKey}`)
		.then(response => response.json())
		.catch(error => console.log(error));
	}
}

FetchModel.fetchOne('albums', '5aae2dd4b9791d0344d8f719');


// TestModel can be removed when project is finished
const TestModel = {
    
    /* Used to console.log several things at once - for testing purposes */
    logInfo(element){ 
        console.group("Console Log shows:");
        console.log('id:', element._id);
        console.log('Name:', element.name);
        console.log('Gender:', element.gender);
        console.log('Genres:', element.genres);
        console.log('Albums:', element.albums);
        console.groupEnd();
    }
}


/******************
 ***** Views *****
 ******************/

const ArtistView = {
    testList: document.getElementById('test-list'),

     //Testing: Displaying some output
     displayArtistName(artistname){
        let listItem = document.createElement('li');
        listItem.innerText = artistname;
        ArtistView.testList.appendChild(listItem);
    }
}



/**********************
 *** Run functions! ***
 **********************/

FetchModel.fetchArtists();