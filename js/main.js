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
//const FetchModel1 = {
//    fetchArtists(){
//        fetch(`https://folksa.ga/api/artists/${apiKey}`)
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
//		    .then(response => {
//				for (var artist of response){
//					TestModel.logInfo(artist);
//					view.displayResponse(artist.name);
//				};     
//			})
			.then(response => {
				console.log(response);
				for (let album of response){
					console.log(album.title);
					AlbumView.displayAlbum(album.title);
				}
			})
			.catch(error => console.log(error));
	},
	fetchOne(category, id){
		return fetch(`${baseUrl}/${category}/${id}/${apiKey}`)
			.then(response => response.json())
			.then(response => console.log(response))
			.catch(error => console.log(error));
	},
	fetchSearched(category, searchQuery){
		let title = 'title';
		if(category == 'artists'){
			title = 'name';
		}
		
		return fetch(`${baseUrl}/${category}/?${title}=${searchQuery}/${apiKey}`)
		.then(response => response.json())
		.catch(error => console.log(error));
	}
}


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

const AlbumView = {
	grid: document.getElementById('grid'),
	
	displayAlbum(album){
		let albumDiv = document.createElement('div');
		albumDiv.innerHTML = `<h3>${album}</h3>`;
		AlbumView.grid.appendChild(albumDiv);
	}
}



/**********************
 *** Run functions! ***
 **********************/
//FetchModel1.fetchArtists();

//FetchModel.fetchOne('albums', '5aae2dd4b9791d0344d8f719');
FetchModel.fetchAll('albums');