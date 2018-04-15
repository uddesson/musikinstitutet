let apiKey = `key=flat_eric`;
const baseUrl = `https://folksa.ga/api`; 


/******************************************************
 ******************** CONTROLLERS *********************
 ******************************************************/

 const SearchController = {
    searchInput: document.getElementById('searchInput'),

    createEventListener: (() => {
        searchInput.addEventListener('keyup', function(){
            ArtistView.containerInner.innerHTML = "";
            TrackView.containerInner.innerHTML = "";
            AlbumView.containerInner.innerHTML = "";

            const searchQuery = document.getElementById('searchInput').value;

            FetchModel.fetchSearched('artists', searchQuery);
            FetchModel.fetchSearched('tracks', searchQuery);
            FetchModel.fetchSearched('albums', searchQuery);


            /*
            TO DO:
            user should be able to search without f ex ' and still get a result

            be able to search for playlists

            Shows duplicates of search result sometimes?

            check if genre: display as link, if clicked fetchSpecificGenre, display as search results
            maybe also make input value genre
            */
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
    },

    setPlaceHolderIfUndefined(imageSrc){
        // Returns src for placeholder image
        if (imageSrc === undefined){
            imageSrc = "images/placeholder.jpg";
            return imageSrc; 
        }
        //Returns imagesrc as original argument
        return imageSrc; 
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
					PlaylistView.displayPlaylists(playlist);
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
        //limit 12 now to get a better view when testing, fetch more when launching?
		return fetch(`${baseUrl}/${category}?limit=12&${apiKey}&sort=desc`)
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
        return fetch(`${baseUrl}/${category}?&${title}=${searchQuery}&${apiKey}&sort=desc`)
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
    },

    fetchPlaylistsForAdding(trackId){
		return fetch(`${baseUrl}/playlists?limit=40&${apiKey}`)
            .then(response => response.json())
			.then((response) => {
				AddToPlaylistView.displayPlaylistss(response, trackId);
			})
			.catch(error => console.log(error));
        },
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
    },
    addTrackToPlaylist(playlistId, tracks){
        fetch(`https://folksa.ga/api/playlists/${playlistId}/tracks?${apiKey}`,{
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ tracks: tracks })
        })
        .then((response) => response.json())
        .then((playlist) => {
            console.log("You've added a track to ", playlist.title);
        });
    },

    addComment(playlistId, text, user){
        let comment = {
            playlist: playlistId,
            body: text,
            username: user
        }
        
        fetch(`https://folksa.ga/api/playlists/${playlistId}/comments?${apiKey}`,{
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(comment)
            })
            .then((response) => response.json())
            .then((playlist) => {
            console.log(playlist);
          });
    }
}

const DeleteModel = {
    //TO DO: make switch statement, if artist: title=name
    deleteOne(objectToDelete, category){
        if (confirm(`Do you want to Delete ${objectToDelete.title}?`)){
            fetch(`${baseUrl}/${category}s/${objectToDelete._id}?${apiKey}`, {
                method: 'DELETE',
                headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    }
                })
            .then((response) => response.json())
            .then((objectToDelete) => {
                console.log('you deleted', objectToDelete.title);
                //TO DO:this need to be made dynamic as well or update siteo.
                ArtistView.containerInner.removeChild(`${category}Div`);
                
            });
        } else {
                return;
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



const AddToPlaylistView = {

    displayPlaylistss: (response, trackId) => {
        let div = document.createElement('div');
        div.classList.add('popup__add-to-playlist');
        let ul = document.createElement('ul');
        let createPlaylistButton = document.createElement('button');
        createPlaylistButton.innerText = 'Create new playlist';
        createPlaylistButton.classList.add('light', 'large');
        const createPlaylistContainer = document.getElementById('createPlaylistContainer');

        createPlaylistButton.addEventListener('click', function(){
            createPlaylistContainer.classList.toggle('hidden');
            div.appendChild(createPlaylistContainer);
        });

        for(let playlist of response){
            let li = document.createElement('li');
            li.innerHTML = playlist.title;
            li.id = playlist._id;
            ul.appendChild(li);
        }

        ul.addEventListener('click', function(ul){
            let playlistId = ul.srcElement.id;
            let track = trackId;
            console.log(ul.srcElement.id);

            PostModel.addTrackToPlaylist(playlistId, track);
        });

        div.appendChild(ul);
        div.appendChild(createPlaylistButton);
        ArtistView.containerInner.appendChild(div);
    }
}





/******************************************************
 *********************** VIEWS ************************
 ******************************************************/

	const ArtistView = {
		container: document.getElementById('container'),
		containerInner: document.createElement('section'),
		
		displayArtist(artist){
            let imageSrc = InputController.setPlaceHolderIfUndefined(artist.coverImage);
            let artistDiv = document.createElement('div');
			artistDiv.innerHTML = `
                    <img src="${imageSrc}" alt="${artist.name}" class="image">
					<h3><a href="${artist.spotifyURL}" target="_blank">${artist.name}</a></h3>`;
			
			const genreDiv = document.createElement('div');
			genreDiv.classList.add('genres');
			
			for(let genre of artist.genres){
				const p = document.createElement('p');
				const textNode = document.createTextNode(genre);
				p.appendChild(textNode);
				genreDiv.appendChild(p);
			}
			artistDiv.appendChild(genreDiv);
            
            //make function/controller
            //fex one for creating the button + eventlistenr 
            //and one for delete(function called in eventlistener)
            let deleteButton = document.createElement('button');
            deleteButton.innerText = 'x';

            deleteButton.addEventListener('click', function(){
                DeleteModel.deleteOne(artist, 'artist');
            });

            let buttonDiv = document.createElement('div');
            buttonDiv.appendChild(deleteButton);
            artistDiv.appendChild(buttonDiv);

			ArtistView.containerInner.classList.add('containerInner', 'container__inner', 'container__artist', 'grid');
			ArtistView.container.appendChild(ArtistView.containerInner);
			ArtistView.containerInner.appendChild(artistDiv);
		}
	}

	const AlbumView = {
		container: document.getElementById('container'),
		containerInner: document.createElement('section'),
		
		displayAlbum(album){
			let albumArtists = album.artists.map((artist) => artist.name);
            let imageSrc = InputController.setPlaceHolderIfUndefined(album.coverImage);
            let albumDiv = document.createElement('div');
			albumDiv.innerHTML = `
					<img src="${imageSrc}" alt="${album.title}" class="image">
					<h3><a href="${album.spotifyURL}" target="_blank">${album.title}</a></h3><br>
					<h4>${albumArtists}</h4>
					<p>Genres: ${album.genres}</p>`;
            
            //make function/controller
            //fex one for creating the button + eventlistenr 
            //and one for delete(function called in eventlistener) 
            let deleteButton = document.createElement('button');
            deleteButton.innerText = 'x';

            deleteButton.addEventListener('click', function(){
                DeleteModel.deleteOne(album, 'album');
            });

            let buttonDiv = document.createElement('div');
            buttonDiv.appendChild(deleteButton);
            albumDiv.appendChild(buttonDiv);
            
			AlbumView.containerInner.classList.add('containerInner', 'container__inner', 'container__albums', 'grid');
			AlbumView.container.appendChild(AlbumView.containerInner);
			AlbumView.containerInner.appendChild(albumDiv);
		}
	}
	
	const TrackView = {
		container: document.getElementById('container'),
		containerInner: document.createElement('section'),

		displayTrack(track){
			let trackArtists = track.artists.map((artist) => artist.name);
			
			let trackDiv = document.createElement('div');
			trackDiv.innerHTML = `
				<h3><a href="${track.spotifyURL}" target="_blank">${track.title}</a></h3><br>
                <h4>by ${trackArtists}</h4>`;
                
            //make function/controller
            //fex one for creating the button + eventlistenr 
            //and one for delete(function called in eventlistener)  
            let addButton = document.createElement('button');
            addButton.innerText = '+';

            addButton.addEventListener('click', function(){
                console.log('scroll up');
                FetchModel.fetchPlaylistsForAdding(track._id);
            });

            let deleteButton = document.createElement('button');
            deleteButton.innerText = 'x';

            deleteButton.addEventListener('click', function(){
                DeleteModel.deleteOne(track, 'track');
            });

            let buttonsDiv = document.createElement('div');
            buttonsDiv.appendChild(addButton);
            buttonsDiv.appendChild(deleteButton);
            trackDiv.appendChild(buttonsDiv);
    
			TrackView.containerInner.classList.add('containerInner', 'container__inner', 'container__tracks', 'list');
			TrackView.container.appendChild(TrackView.containerInner);
			TrackView.containerInner.appendChild(trackDiv);
		},
    }

const PlaylistView = {
    container: document.getElementById('playlistContainer'),
    containerInner: document.createElement('section'),

    getTrackListFrom(playlist){
        let tracklist = '';
        if (playlist.tracks.length > 0){
            let artistName = '';
            for (var i = 0; i < playlist.tracks.length; i++){   
                if (playlist.tracks[i].artists[0] == undefined){
                   artistName = 'Unknown artist';
                } else{
                    artistName = `${playlist.tracks[i].artists[0].name}</p></div>`;
                }
                let trackTitle = `<div><p><span class="text text--bold">${playlist.tracks[i].title}</span> by `;
                tracklist = tracklist + trackTitle + artistName;
            }
        } else{
            tracklist = `<p>No tracks yet</p>`;
        }
        return tracklist; 
    },

    showComments(comments){
        let commentList = document.createElement('ul')
        
        if(comments == ''){
            let listElement = document.createElement('li');
            listElement.innerText = 'No comments yet';
            commentList.appendChild(listElement);
        } 
        else {
            for (var i = 0; i < comments.length; i++){
                let comment = `"${comments[i].body}" by ${comments[i].username}`;
                let listElement = document.createElement('li');
                let deleteButton = document.createElement('button');
                deleteButton.innerText = 'x';
                listElement.innerText = comment;
                listElement.appendChild(deleteButton);
                commentList.appendChild(listElement);

                deleteButton.addEventListener('click', function(){
                    DeleteModel.deleteOne(comment, 'comment');
                });
            }
        }
        
        PlaylistView.container.appendChild(commentList);

        
    },
    
    displayPlaylists(playlist){
        let rating = RatingModel.calculateRatingAverage(playlist);
        let imageSrc = InputController.setPlaceHolderIfUndefined(playlist.coverImage)

        // Create elements below
        let showSinglePlaylistButton = document.createElement('button');
        showSinglePlaylistButton.dataset.id = playlist._id;
		showSinglePlaylistButton.classList.add('dark', 'small');
        showSinglePlaylistButton.innerHTML = 'Show playlist';

        let playlistDiv = document.createElement('div');
        playlistDiv.innerHTML = `
            <img src="${imageSrc}" alt="${playlist.title}" class="image">
            <h3>${playlist.title}</h3><br>
            <h4>Created by: ${playlist.createdBy}</h4>
            <h4>Tracks: ${playlist.tracks.length}</h4>
            <h4>Rating: ${rating}</h4>`;
        container.appendChild(playlistDiv);
        
        playlistDiv.appendChild(showSinglePlaylistButton);

        PlaylistView.containerInner.classList.add('containerInner', 'container__inner', 'container__albums', 'grid');
        PlaylistView.container.appendChild(PlaylistView.containerInner);
        PlaylistView.containerInner.appendChild(playlistDiv);


        showSinglePlaylistButton.addEventListener('click', function(){
            let id = this.dataset.id;
            PlaylistView.displaySinglePlaylist(id, rating, playlist)           
        });
    },

    displaySinglePlaylist(id, rating, playlist){
        let showCommentsButton = document.createElement('button');
		showCommentsButton.classList.add('dark', 'small');
        showCommentsButton.innerHTML = 'Show all comments';
        
        
        let addCommentButton = document.createElement('button');
        addCommentButton.innerText = "Add comment";
        addCommentButton.classList.add('button', 'small', 'light');
        
        let newComment = document.createElement('input');
        newComment.type = 'text';
        newComment.placeholder = 'New comment';

        let commentBy = document.createElement('input');
        commentBy.type = 'text';
        commentBy.placeholder = "Who's commenting?";
        
        let tracklist = PlaylistView.getTrackListFrom(playlist); 
        

        let singlePlaylistContent = `
        <section class="containerInner container__inner container__tracks list">
        <h2>${playlist.title}</h2><br>
        <h4>Created by: ${playlist.createdBy}</h4>
        <h4>Rating: ${rating}</h4>
        ${tracklist}</section>`;
        
        PlaylistView.container.innerHTML = `${singlePlaylistContent}`;
        PlaylistView.container.appendChild(newComment);
        PlaylistView.container.appendChild(commentBy);
        PlaylistView.container.appendChild(addCommentButton);
        PlaylistView.container.appendChild(showCommentsButton);

        addCommentButton.addEventListener('click', function(){
            newComment = newComment.value;
            commentBy = commentBy.value;
            PostModel.addComment(playlist._id, newComment, commentBy);
            
        })

         // Eventlistener for fetching comments is added to that button
        showCommentsButton.addEventListener('click', function(){
            FetchModel.fetchComments(id);
        });
    }
}
    
const SearchView = {
    searchInput: document.getElementById('searchInput')
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