let apiKey = `key=flat_eric`;
const baseUrl = `https://folksa.ga/api`; 


/******************************************************
 ******************** CONTROLLERS *********************
 ******************************************************/

 const SearchController = {
    searchInput: document.getElementById('searchInput'),

    //The "general search"
    createEventListener (){
        searchInput.addEventListener('keyup', function(){
            ArtistView.grid.innerHTML = "";
            const searchQuery = document.getElementById('searchInput').value;
            
            /* Model
            TO DO: store fetched data*/
            FetchModel.fetchSearched('artists', searchQuery);
            FetchModel.fetchSearched('tracks', searchQuery);
            FetchModel.fetchSearched('albums', searchQuery);
            FetchModel.fetchSearched('playlists', searchQuery);

            /* View
            TO DO: send fetched data to SearchView so user can see it
            f ex SearchView.displayTracks(tracks);
            */
        });
    }

    //TO DO: the user should also be able to specify their search with specific genre
}


const InputController = {
    
    // Run to check if user tried so input empty string
    checkIfValidUserInput(input){
        if (input.trim() == ''){
            return true;
    
        } else {
            // Run some error-view
            console.log('user tried to input empty space')
            return;
        }
    }
}


// Loop out content (artists, albums or tracks) from response object
const ResponseController = {
	sortResponseByCategory(category, response) {
		switch (category) {
			case 'artists':
				for (let artist of response) {
					ArtistView.displayArtist(artist);
				}
			break;
			case 'albums': 
				for (let album of response){
					AlbumView.displayAlbum(album);
				}
			break;
			case 'tracks':
				for (let track of response){
					TrackView.displayTrack(track);
				}
			break;
		}
	},
	fetchAlbumArtist(response) {
		for (albums of response){
			let i = 0;
			console.log(albums.artists[i].name);  //FORTSÄTT JOBBA HÄR
		}
    }    
}


const GenderController = {

    excludeMaleArtists(artists){
        // console.log(artists)
        let sorted = artists.filter(artist => artist.gender !== 'male');
        // console.log(sorted)
        return sorted;
    },

    filterFetchByGender(sortedArtists, fetchedArray){
        console.log('albums:', fetchedArray)
        
        //TO DO: 
        // * Filter them by gender
        // * Return filtered results
       
        // let filtered = fetchedArray.filter(filtered => sortedArtists._id == fetchedArray.artists);    

    }
}



//TEMPORARY VARIABLES FOR FETCH URL
let id = '5aae2dd4b9791d0344d8f719';
let category = 'albums';
let searchQuery = 'shakira';


/*******************************************************
 *********************** MODELS ************************
 *******************************************************/


const FetchModel = {

    async fetchSortedArtists(){
        await fetch(`${baseUrl}/artists?${apiKey}&limit=1000&sort=desc&`)
            .then(response => response.json())
            .then(response => {
                return sortedArtists = GenderController.excludeMaleArtists(response)})     
            .catch(error => console.log(error));      
            
    },
	
	fetchAll(category){
        if(category == 'albums'){
            apiKey += '&populateArtists=true';
        }
        
		return fetch(`${baseUrl}/${category}?${apiKey}`)
            .then(response => response.json())
            // TODO: Get filterFetchByGender-function to work!!
			// .then(response => GenderController.filterFetchByGender(sortedArtists, response))
			.then((response) => {
				ResponseController.sortResponseByCategory(category, response);
				if(category == 'albums'){
					ResponseController.fetchAlbumArtist(response);
				}
			})
			.catch(error => console.log(error));
        },
        
//	fetchAlbumArtist(){ //THIS ONE ONLY FETCHES SHAKIRA ATM = D
//			return fetch(`${baseUrl}/artists/${id}/?${apiKey}`)
//			.then((response) => response.json())
//			.then((response) => {
//				let artists = response.name;
//				for (let artist of artists){
//					console.log(artist);
//				}
//			})
//        },
        
	fetchOne(category, id){
		return fetch(`${baseUrl}/${category}/${id}?${apiKey}`)
			.then(response => response.json())
			.then(response => console.log(response))
			.catch(error => console.log(error));
    },
    
	fetchSearched(category, searchQuery){
		let title = 'title';
        
        if(category == 'artists')
            {
			    title = 'name';
            }
        
        return fetch(`${baseUrl}/${category}?${title}=${searchQuery}&${apiKey}`)
            .then(response => response.json())
            .then((response) => {
                ResponseController.sortResponseByCategory(category, response);
            })
            .catch(error => console.log(error));
	}
};


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


const PostModel = {
    // TO DO:
    // * Add validation/check-functions so user sends correct stuff
    // * Add playlists

    addArtist(){

        let artist = {
            name: PostView.artistForm.name.value,
            born: PostView.artistForm.born.value,
            gender: PostView.artistForm.gender.value.toLowerCase(),
            genres: PostView.artistForm.genres.value.replace(" ", ""),
            spotifyURL: PostView.artistForm.spotify.value,
            coverImage: PostView.artistForm.image.value
        }

        fetch(`${baseUrl}/artists?${apiKey}`,{
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(artist)
          })
          .then((response) => response.json())
          .then((artist) => {
            console.log(artist);
          });
    },

    addAlbum(){
        
        let album = {
            title: PostView.albumForm.title.value,
            artists: PostView.albumForm.artists.value, //Can be multiple IDs, must be comma separated string if multiple
            releaseDate: PostView.albumForm.year.value,
            genres: PostView.albumForm.genres.value.replace(" ", ""),
            spotifyURL: PostView.albumForm.spotify.value,
            coverImage: PostView.albumForm.image.value
        }

        fetch(`${baseUrl}/albums?${apiKey}`,{
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(album),
          })
          .then((response) => response.json())
          .then((album) => {
            console.log(album);
          });
    },

    addTrack(){

        let track = {
            title: PostView.trackForm.title.value,
            artists: PostView.trackForm.artists.value,
            album: PostView.trackForm.albums.value
        }

        fetch(`${baseUrl}/tracks?${apiKey}`,{
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(track),
          })
          .then((response) => response.json())
          .then((postedTrack) => {
            console.log(postedTrack);
          });
    }
}


/******************************************************
 *********************** VIEWS ************************
 ******************************************************/

const ArtistView = {
	grid: document.getElementById('grid'),
	
	displayArtist(artist){
		let artistDiv = document.createElement('div');
		artistDiv.innerHTML = `
			<h3>${artist.name}</h3>
			<p>Genres: ${artist.genres}</p>`;
		ArtistView.grid.appendChild(artistDiv);
	}
}

const AlbumView = {
	grid: document.getElementById('grid'),
	
	displayAlbum(album){
		let albumDiv = document.createElement('div');
		albumDiv.innerHTML = `
			<h3>${album.title}</h3> 
			by <h4>${album.artists}</h4>
			<p>Genres: ${album.genres}</p>`;
		AlbumView.grid.appendChild(albumDiv);
	}
}

const TrackView = {
	grid: document.getElementById('grid'),
	
	displayTrack(track){
		let trackDiv = document.createElement('div');
		trackDiv.innerHTML = `
			<h3>${track.title}</h3> 
			by <h4>${track.artists}</h4>;`
			TrackView.grid.appendChild(trackDiv);
	}
}


const SearchView = {
    searchButton: document.getElementById('searchButton'),
    searchInput: document.getElementById('searchInput'),
    output: document.getElementById('searchOutput'),

    displayTracks(tracks){
        const ul = document.createElement('ul');

        for (let track of tracks){
            let listItem = document.createElement('li');

            listItem.innerText = tracks.title;
            // + display artist name and album title
            
            //make links/eventlistener with the 3 id:s

            ul.appendChild(listItem);
        }

        SearchView.output.appendChild(ul);
    },

    displayArtists(artists){
        for (let artist of artists){
            ArtistView.displayArtist(artist);
            //make link/eventlistener with artist.id around both name and image

        }
    },

    //TO DO: displayAlbums()

    //TO DO: displayPlayslists()

    //or should we make static divs with h2 and ul in index.html??
    createDiv(categoryName){
        const div = document.createElement('div');
        const h2 = document.createElement('h2');

        h2.innerText = categoryName;
        div.appendChild(h2);

        return div;
    }
}


const NavigationView = {
    /* TO DO:
    * - Look over these functions and see if the can be ONE instead
    * - While on the "contribute page" you can click the search button 
    * even if the input field has no value
    */

    homeMenuAction: document.getElementById('home'),
    contributeMenuAction: document.getElementById('contribute'),
    postFormsWrapper: document.getElementById('postFormsWrapper'),

    enableHomeView(){
        NavigationView.homeMenuAction.addEventListener('click', function(){
            /* When we REMOVE the class hidden, we show views
             and elements that should be active */
            ArtistView.grid.classList.remove('hidden');
    
            /* When we ADD the class hidden, we hide views
             or elements that should not be active */
            NavigationView.postFormsWrapper.classList.add('hidden');
        });
    },  
    
    enablePostView(){
        NavigationView.contributeMenuAction.addEventListener('click', function(){
            NavigationView.postFormsWrapper.classList.remove('hidden');

            // Hide views ("page") or elements that should not be active
            AlbumView.grid.classList.add('hidden');
        });

        /* If the user tries to search while on the contribute "page",
        we still allow them to do so, and hide the post-view */
        SearchView.searchInput.addEventListener('keyup', function(){
            ArtistView.grid.classList.remove('hidden');
            NavigationView.postFormsWrapper.classList.add('hidden');
        });

        SearchView.searchButton.addEventListener('click', function(){
            ArtistView.grid.classList.remove('hidden');
            NavigationView.postFormsWrapper.classList.add('hidden');
        });
    },
}


const PostView = { 
    
    menuActions: [
        addArtistAction = document.getElementById('addArtistAction'),
        addTrackAction = document.getElementById('addTrackAction'),
        addAlbumAction = document.getElementById('addAlbumAction')
    ],

    buttons: {
        addArtistButton: document.getElementById('addArtistButton'),
        addAlbumButton: document.getElementById('addAlbumButton'),
        addTrackButton: document.getElementById('addTrackButton')
    },

    artistForm: {
        name: document.getElementById('artistName'),
        born: document.getElementById('artistBorn'),
        gender: document.getElementById('artistGender'),
        genres: document.getElementById('artistGenre'),
        country: document.getElementById('artistBorn'),
        spotify: document.getElementById('artistSpotifyUrl'),
        image: document.getElementById('artistImage')
    },

    albumForm: {
        title: document.getElementById('albumTitle'),
        artists: document.getElementById('albumArtist'),
        genres: document.getElementById('albumGenre'),
        year: document.getElementById('albumReleaseYear'),
        spotify: document.getElementById('albumSpotifyUrl'),
        image: document.getElementById('artistImage')
    },

    trackForm: {
        title: document.getElementById('trackTitle'),
        artists: document.getElementById('trackArtist'),
        albums: document.getElementById('trackAlbum'),
    },

    createEventListeners(){
        for (var action of PostView.menuActions){
            action.addEventListener('click', function(){
                this.nextElementSibling.classList.toggle('hidden'); 
            });
        }

        // Eventlistener that triggers add ARTIST
        PostView.buttons.addArtistButton.addEventListener('click', function(event){
            event.preventDefault(); // Stop page from refreshing on click
            PostModel.addArtist();
        })
        
        // Eventlistener that triggers add ALBUM
        PostView.buttons.addAlbumButton.addEventListener('click', function(event){
            event.preventDefault();
            PostModel.addAlbum();
        })
        
        // Eventlistener that triggers add TRACK
        PostView.buttons.addTrackButton.addEventListener('click', function(event){
            event.preventDefault();
            PostModel.addTrack();
        })
    }
}

/********************************************************
 ******************** RUN FUNCTIONS *********************
 *******************************************************/

FetchModel.fetchAll('artists');
FetchModel.fetchAll('albums');
FetchModel.fetchAll('tracks');

// let sortedArtists = FetchModel.fetchSortedArtists();

NavigationView.enablePostView();
NavigationView.enableHomeView();

// TO DO: Maybe make creating eventlisteners self-invoked?
PostView.createEventListeners(); 
SearchController.createEventListener();