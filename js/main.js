let apiKey = `key=flat_eric`;
const baseUrl = `https://folksa.ga/api`; 


/******************************************************
 ******************** CONTROLLERS *********************
 ******************************************************/

 const SearchController = {
    searchInput: document.getElementById('searchInput'),
    container: document.getElementById('container'),

    createEventListener: (() => {
        searchInput.addEventListener('keyup', function(){
            ArtistView.containerInner.innerHTML = "";
            AlbumView.containerInner.innerHTML = "";
            TrackView.containerInner.innerHTML = "";
            //PlaylistView.containerInner.innerHTML = "";

            const searchQuery = document.getElementById('searchInput').value;
        
            FetchModel.fetchSearched('artists', searchQuery);
            FetchModel.fetchSearched('tracks', searchQuery);
            FetchModel.fetchSearched('albums', searchQuery);
            FetchModel.fetchSearched('playlists', searchQuery);

            //kolla genrena
            FetchModel.fetchSpecificGenre('artists', searchQuery);
            FetchModel.fetchSpecificGenre('tracks', searchQuery);
            FetchModel.fetchSpecificGenre('albums', searchQuery);
            FetchModel.fetchSpecificGenre('playlists', searchQuery);
        });
    })()
}


const InputController = {
    
    inputIsEmptySpace(singleInput){
        if (singleInput.trim() == ''){
            return true; // The input was just space :(
        } else {
            return;
        }
    },

    formFieldsAreEmpty(form){
        for (var field in form) {
            if (form.hasOwnProperty(field)) {
                if(form[field] === '' || undefined){
                    return true;
                }
                else if(InputController.inputIsEmptySpace(form[field])){
                    return true;
                }
            }
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
            case 'playlists':
				for (let playlist of response){
					PlaylistView.displayPlaylist(playlist);
				}
			break;
		}
    }
}

/*******************************************************
 *********************** MODELS ************************
 *******************************************************/


const FetchModel = {

	fetchAll(category){
        if(category == 'albums'){
            apiKey += '&populateArtists=true';
        }
        
		return fetch(`${baseUrl}/${category}?limit=52&${apiKey}&sort=desc`)
            .then(response => response.json())
			.then((response) => {
				ResponseController.sortResponseByCategory(category, response);
			})
			.catch(error => console.log(error));
        },

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
    },
    
	fetchSpecificGenre(category, genre){
        return fetch(`${baseUrl}/${category}?genres=${genre}&${apiKey}`)
            .then(response => response.json())
            .then((response) => {
                ResponseController.sortResponseByCategory(category, response);
            })
            .catch(error => console.log(error));
    },
    
    fetchComments(id){
        fetch(`${baseUrl}/playlists/${id}/comments?${apiKey}`)
        .then((response) => response.json())
        .then((comments) => {
            PlaylistView.showComments(comments)
        });
    }
};

const PostModel = {
    // TO DO:
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

        let locationForDisplayingStatus = document.getElementById('addedArtistStatus');

        if (InputController.formFieldsAreEmpty(artist)){
            StatusView.showStatusMessage(locationForDisplayingStatus, "Empty");
        }

        else {
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
            
            StatusView.showStatusMessage(locationForDisplayingStatus, "Success")
        }
    },

    addAlbum(){
        let album = {
            title: PostView.albumForm.title.value,
            artists: PostView.albumForm.artists.value,
            releaseDate: PostView.albumForm.year.value,
            genres: PostView.albumForm.genres.value.replace(" ", ""),
            spotifyURL: PostView.albumForm.spotify.value,
            coverImage: PostView.albumForm.image.value
        }

        let locationForDisplayingStatus = document.getElementById('addedAlbumStatus');

        if (InputController.formFieldsAreEmpty(album)){
            StatusView.showStatusMessage(locationForDisplayingStatus, "Empty")
        }

        else {
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
                })

            StatusView.showStatusMessage(locationForDisplayingStatus, "Success")
        }
    },

    addTrack(){
        let track = {
            title: PostView.trackForm.title.value,
            artists: PostView.trackForm.artists.value,
            album: PostView.trackForm.albums.value
        }

        let locationForDisplayingStatus = document.getElementById('addedTrackStatus');

        if (InputController.formFieldsAreEmpty(track)){
            StatusView.showStatusMessage(locationForDisplayingStatus, "Empty");
        }

        else {
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

            StatusView.showStatusMessage(locationForDisplayingStatus, "Success")
        }
    }
}


const RatingModel = {
    
    calculateRatingAverage(playlist){
        let ratingSum = 0;
            for (var rating of playlist.ratings){  
                ratingSum = ratingSum + rating; 
            }
        let ratingAverage = ratingSum / playlist.ratings.length; // Do math, get average!
        
        if (isNaN(ratingAverage)){
            return 'No rating yet';
        }
        else{
            ratingAverage = Math.floor(ratingAverage);
            return `${ratingAverage} / 10`;
        }
    }
}


/******************************************************
 *********************** VIEWS ************************
 ******************************************************/

	const ArtistView = {
		container: document.getElementById('container'),
		containerInner: document.createElement('div'),
		
		displayArtist(artist){
            let artistDiv = document.createElement('div');
			artistDiv.innerHTML = `
					<img src="${artist.coverImage}" alt="${artist.name}" class="image">
					<h3><a href="${artist.spotifyURL}" target="_blank">${artist.name}</a></h3>
					<p>Genres: ${artist.genres}</p>
					<button id="delete">Delete</button>`;
			ArtistView.containerInner.classList.add('containerInner', 'container__inner', 'container__artist', 'grid');
			ArtistView.container.appendChild(ArtistView.containerInner);
			ArtistView.containerInner.appendChild(artistDiv);
		}
	}

	const AlbumView = {
		container: document.getElementById('container'),
		containerInner: document.createElement('div'),
		
		displayAlbum(album){
			let albumArtists = album.artists.map((artist) => artist.name);
			
            let albumDiv = document.createElement('div');
			albumDiv.innerHTML = `
					<img src="${album.coverImage}" alt="${album.title}" class="image">
					<h3><a href="${album.spotifyURL}" target="_blank">${album.title}</a></h3><br>
					<h4>${albumArtists}</h4>
					<p>Genres: ${album.genres}</p>`;
			
			AlbumView.containerInner.classList.add('containerInner', 'container__inner', 'container__albums', 'grid');
			AlbumView.container.appendChild(AlbumView.containerInner);
			AlbumView.containerInner.appendChild(albumDiv);
		}
	}
	
	const TrackView = {
		container: document.getElementById('container'),
		containerInner: document.createElement('div'),

		displayTrack(track){
			let trackArtists = track.artists.map((artist) => artist.name);
			
			let trackDiv = document.createElement('div');
			trackDiv.innerHTML = `
				<h3><a href="${track.spotifyURL}" target="_blank">${track.title}</a></h3><br>
				<h4>by ${trackArtists}</h4>`;
			
			TrackView.containerInner.classList.add('containerInner', 'container__inner', 'container__tracks', 'list');
			TrackView.container.appendChild(TrackView.containerInner);
			TrackView.containerInner.appendChild(trackDiv);
		}
	}

const PlaylistView = {

    getTrackListFrom(playlist){
        let tracklist = '';
        for (var i = 0; i < playlist.tracks.length; i++){
            let trackTitle = `<p><span class="text text--bold">${playlist.tracks[i].title}</span> by `;
            let artistName = `${playlist.tracks[i].artists[0].name}</p><br>`;
            tracklist = tracklist + trackTitle + artistName;
        }
        return tracklist;
    },

    showComments(comments){
        for (var i = 0; i < comments.length; i++){
            let comment = comments[i].body;
            console.log(comment);
        }
    },
    
    displayPlaylist(playlist){
        /* TO DO: 
        * - Loop out comments to user when "show comments" is clicked
        * - Send along new comment-input to a post-comment-function
        */
        
        let rating = RatingModel.calculateRatingAverage(playlist);
        let tracklist = PlaylistView.getTrackListFrom(playlist);
        
        // Put the playlists in the right container and add classes
        playlistContainer: document.getElementById('playlistContainer');
        playlistContainer.classList.add('container__playlists', 'list');

        // Create elements below
        let showCommentsButton = document.createElement('button');
        showCommentsButton.innerHTML = 'Show comments';

        // This is where we output the content to the user
        let playlistDiv = document.createElement('div');
        playlistDiv.innerHTML = `
            <h3>${playlist.title}</h3><br>
            <h4>Created by: ${playlist.createdBy}</h4>
            <h4>Tracks: ${playlist.tracks.length}</h4>
            <h4>Rating: ${rating}</h4>
            <h4>Number of comments: ${playlist.comments.length}</h4>
            ${tracklist}
            <input type="text" placeholder="Add comment (not working)"><br>
            <input type="number" placeholder="Add rating" min="1" max="10"><br>`;
        playlistContainer.appendChild(playlistDiv);

        // A "Show comments"-button is displayed if the playlist has any ( > 0) comments
        if(playlist.comments.length > 0){
            playlistDiv.appendChild(showCommentsButton)
        };

        // Eventlistener for fetching comments is added to that button
        showCommentsButton.addEventListener('click', function(){
            FetchModel.fetchComments(playlist._id);
        });
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
    * - Look over these functions and see if the can be ONE instead,
    * - Or if they all should be replaced by innerHTML somehow
    * - While on the "contribute page" you can click the search button 
    * even if the input field has no value
    */

    homeMenuAction: document.getElementById('home'),
    contributeMenuAction: document.getElementById('contribute'),
    playlistsMenuAction: document.getElementById('playlists'),
    postFormsWrapper: document.getElementById('postFormsWrapper'),
    playlistContainer: document.getElementById('playlistContainer'),

    enableHomeView(){
        NavigationView.homeMenuAction.addEventListener('click', function(){
            /* When we REMOVE the class hidden, we show views
             and elements that should be active */
            ArtistView.container.classList.remove('hidden');
    
            /* When we ADD the class hidden, we hide views
             or elements that should not be active */
            NavigationView.postFormsWrapper.classList.add('hidden');
            NavigationView.playlistContainer.classList.add('hidden');
        });
    },  
    
    enablePlaylistView(){
        NavigationView.playlistsMenuAction.addEventListener('click', function(){
            NavigationView.playlistContainer.classList.remove('hidden');
            
            ArtistView.container.classList.add('hidden');
            NavigationView.postFormsWrapper.classList.add('hidden');
        });

        /* If the user tries to search while on the contribute "page",
        we still allow them to do so, and hide the post-view */
        SearchView.searchInput.addEventListener('keyup', function(){
            ArtistView.container.classList.remove('hidden');
            NavigationView.postFormsWrapper.classList.add('hidden');
        });
    },

    enablePostView(){
        NavigationView.contributeMenuAction.addEventListener('click', function(){
            NavigationView.postFormsWrapper.classList.remove('hidden');

            // Hide views ("page") or elements that should not be active
            ArtistView.container.classList.add('hidden');
            NavigationView.playlistContainer.classList.add('hidden');
        });

        SearchView.searchInput.addEventListener('keyup', function(){
            ArtistView.container.classList.remove('hidden');
            NavigationView.postFormsWrapper.classList.add('hidden');
        });
    },
}


const PostView = { 
    
    actions: [
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
        image: document.getElementById('albumCoverUrl')
    },

    trackForm: {
        title: document.getElementById('trackTitle'),
        artists: document.getElementById('trackArtist'),
        albums: document.getElementById('trackAlbum'),
    },

    createEventListeners: () => {
        for (var action of PostView.actions){
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


const StatusView = {
    statusMessage: document.getElementById('statusMessage'),

    /* Takes to params, location should be the div where you want to put the error message
    and status should be a string that fits one of the switch-cases */
    showStatusMessage(location, status){
        switch (status) {
            case "Empty":
            StatusView.statusMessage.innerText = "Oops, you haven't filled out the fields correctly.";
            break;

            case "Success":
            StatusView.statusMessage.innerText = "Nice, it worked!";
            break;
        }
        
        location.appendChild(StatusView.statusMessage);
        location.classList.remove('hidden');
    }
}

/********************************************************
 ******************** RUN FUNCTIONS *********************
 *******************************************************/

FetchModel.fetchAll('artists');
FetchModel.fetchAll('albums');
FetchModel.fetchAll('tracks');
FetchModel.fetchAll('playlists');

NavigationView.enablePostView();
NavigationView.enableHomeView();
NavigationView.enablePlaylistView();

// TO DO: Self invoke
PostView.createEventListeners(); 