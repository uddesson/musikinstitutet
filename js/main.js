let apiKey = `key=flat_eric`;
const baseUrl = `https://folksa.ga/api`; 


/*******************************************************
 *********************** MODELS ************************
 *******************************************************/


const FetchModel = {
	container: document.getElementById('container'),
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
			.catch(error => StatusView.showStatusMessage("Error", FetchModel.container));
        },

	fetchOne(category, id){
		return fetch(`${baseUrl}/${category}/${id}?${apiKey}`)
			.then(response => response.json())
			.then(response => console.log(response))
			.catch(error => StatusView.showStatusMessage("Error", FetchModel.container));
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
            .catch(error => StatusView.showStatusMessage("Error", FetchModel.container));
    },
    
	fetchGenre(category, genre){
        return fetch(`${baseUrl}/${category}?genres=${genre}&${apiKey}`)
            .then(response => response.json())
            .then((response) => {
                ResponseController.sortResponseByCategory(category, response);
            })
            .catch(error => StatusView.showStatusMessage("Error", FetchModel.container));
    },
    
    fetchComments(id){
		
        fetch(`${baseUrl}/playlists/${id}/comments?key=flat_eric`)
        .then((response) => response.json())
        .then((comments) => {
            PlaylistView.showComments(comments);
        })
		.catch(error => StatusView.showStatusMessage("commentsError"));
    },

    fetchPlaylistsForAdding(trackId){
		return fetch(`${baseUrl}/playlists?limit=40&${apiKey}`)
            .then(response => response.json())
			.then((response) => {
				AddToPlaylistView.displayPlaylistsPopUp(response, trackId);
			})
			.catch(error => {
				StatusView.showStatusMessage("Error", feedbackPopup);
			});
        }
};



const PostModel = {

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
            StatusView.showStatusMessage("Empty", locationForDisplayingStatus);
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
            })
			.catch(error => StatusView.showStatusMessage("Error", FetchModel.container));
            
            StatusView.showStatusMessage("Success", locationForDisplayingStatus)
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
            StatusView.showStatusMessage("Empty", locationForDisplayingStatus)
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
				.catch(error => StatusView.showStatusMessage("Error", FetchModel.container));

            StatusView.showStatusMessage("Success", locationForDisplayingStatus)
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
            StatusView.showStatusMessage("Empty", locationForDisplayingStatus);
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
            })
			.catch(error => StatusView.showStatusMessage("Error", feedbackPopup));

            StatusView.showStatusMessage("Success", locationForDisplayingStatus)
        }
    },

    addPlaylist(playlist){
        
        fetch(`https://folksa.ga/api/playlists?${apiKey}`,{
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(playlist)
        })
        .then((response) => response.json())
        .then((playlist) => {
            console.log(playlist);
        })
		.catch(error => StatusView.showStatusMessage("Error", feedbackPopup));
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
		//Replace addToPlaylistPopup with feedbackPopup when track is successfully added
		const addToPlaylistPopup = document.getElementById('addToPlaylistPopup');
		StatusView.showStatusMessage(`You've added a track to ${playlist.title}`, feedbackPopup);
		addToPlaylistPopup.parentElement.removeChild(addToPlaylistPopup);
    })
	.catch(error => StatusView.showStatusMessage("Error", feedbackPopup));
    },

    addComment(playlistId, text, user){
        let comment = {
            playlist: playlistId,
            body: text,
            username: user
        }
        
        fetch(`https://folksa.ga/api/playlists/${playlistId}/comments?key=flat_eric`,{
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(comment)
            })
            .then((response) => response.json())
            .then((playlist) => {
                FetchModel.fetchComments(playlistId)
			.catch(error => StatusView.showStatusMessage("Error", feedbackPopup));
          });
    },

	rate(category, id, rating){
		fetch(`${baseUrl}/${category}s/${id}/vote?${apiKey}`, {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ rating: rating })
		})
		.then((response) => response.json())
		.then((category) => {
			console.log(category);
		})
		.catch(error => StatusView.showStatusMessage("Error", feedbackPopup));
	}
}

const DeleteModel = {
    //TO DO: make switch statement, if artist: title=name
    deleteOne(objectToDelete, category){
		let title = objectToDelete.title;
        
        if(category == 'artist')
            {
			    title = objectToDelete.name;
            }
        if (confirm(`Do you want to Delete ${title}?`)){
            fetch(`${baseUrl}/${category}s/${objectToDelete._id}?key=flat_eric`, {
                method: 'DELETE',
                headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    }
                })
            .then((response) => response.json())
            .then((objectToDelete) => {
                console.log('you deleted', title);
				StatusView.showStatusMessage(`You deleted ${title}.`, feedbackPopup);
				
				setTimeout(function(){ 
					location.reload(); 
				}, 3000);
                //TO DO:this need to be made dynamic as well or update siteo.
				//ArtistView.containerInner.removeChild(childToRemove);
            })
			.catch(error => {   
				StatusView.showStatusMessage("Error", feedbackPopup)
				console.log(error);
			});
        } else {
            return;
        }
    },

    deleteComment(commentID, playlistID){
        fetch(`https://folksa.ga/api/comments/${commentID}?key=flat_eric`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        })
        .then((response) => response.json())
        .then((comment) => {
            FetchModel.fetchComments(playlistID);
        })
		.catch(error => StatusView.showStatusMessage("Error", feedbackPopup));
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
            return 0;
        }
        else{
            ratingAverage = Math.floor(ratingAverage);
            return ratingAverage;
        }
    }
}



const AddToPlaylistView = {

    displayPlaylistsPopUp: (response, trackId) => {
        let div = document.createElement('div');
        let ul = document.createElement('ul');
        let createPlaylistButton = document.createElement('button');
        const createPlaylistContainer = document.getElementById('createPlaylistContainer');

        createPlaylistButton.innerText = 'Create new playlist';
        div.classList.add('popup__add-to-playlist');
		div.id = 'addToPlaylistPopup';
        createPlaylistButton.classList.add('dark', 'large', 'showPlaylistForm');
		
		//Hide popup when clicking outside of it
		document.addEventListener('click', function(event) {
		  var isClickInside = div.contains(event.target);
		  if (!isClickInside){
			div.classList.add('hidden');
		  }
		});
		
        createPlaylistButton.addEventListener('click', function(){
            if(createPlaylistButton.classList.contains('showPlaylistForm')){
                //show create playlist form
                createPlaylistContainer.classList.toggle('hidden');
                //append the form before the button
                createPlaylistButton.insertAdjacentElement('beforebegin', createPlaylistContainer);
                //change behavior from displaying form to creating playlist
                createPlaylistButton.classList.toggle('showPlaylistForm');
            } else {
                let playlistName = document.getElementById('playlistName').value;
                let createdBy = document.getElementById('createdBy').value;
                let genres = document.getElementById('genres').value;
                let playlistImage = document.getElementById('playlistImage').value;

                let playlist = {
                    title: playlistName,
                    genres: genres,
                    createdBy: createdBy,
                    tracks: trackId,
                    coverImage: playlistImage
                };

                PostModel.addPlaylist(playlist);
                
                //change behavior from creating playlist to displaying form
                createPlaylistButton.classList.toggle('showPlaylistForm');
            }
            
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
            
            let deleteButton = document.createElement('button');
            deleteButton.innerHTML = `<i class="fa fa-times" 
                title="Remove from FED17 Faves" 
                style="font-size:1.7em;"></i>`;

            deleteButton.addEventListener('click', function(){
                DeleteModel.deleteOne(artist, 'artist');
            });

            let buttonDiv = document.createElement('div');
            buttonDiv.style = "top: 10px; right: 10px; position: absolute;"
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
			let ratingInput = createRatingInput();
            let ratingButton = document.createElement('button');
            ratingButton.innerText = "Rate";
			
			albumDiv.innerHTML = `
					<img src="${imageSrc}" alt="${album.title}" class="image">
					<h3><a href="${album.spotifyURL}" target="_blank">${album.title}</a></h3><br>
					<h4>${albumArtists}</h4>
					<p>Genres: ${album.genres}</p>`;
            
			
			ratingButton.addEventListener('click', function(){
				// skcika in ratingInput.value till API
				console.log(ratingInput.value);
				PostModel.rate('album', album._id, ratingInput.value);
			});
			
            let deleteButton = document.createElement('button');
            deleteButton.innerText = 'x';

            deleteButton.addEventListener('click', function(){
                DeleteModel.deleteOne(album, 'album');
            });

            let buttonDiv = document.createElement('div');
            buttonDiv.appendChild(ratingInput);
            buttonDiv.appendChild(ratingButton);
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
			let ratingInput = createRatingInput();
            let ratingButton = document.createElement('button');
            ratingButton.innerText = "Rate";
			
			trackDiv.innerHTML = `
				<h3><a href="${track.spotifyURL}" target="_blank">${track.title}</a></h3><br>
                <h4>by ${trackArtists}</h4>`;
			
        
            ratingButton.addEventListener('click', function(){
                // skcika in ratingInput.value till API
                console.log(ratingInput.value);
                PostModel.rate('track', track._id, ratingInput.value);
            });
			
            //make function/controller
            //fex one for creating the button + eventlistenr 
            //and one for delete(function called in eventlistener)  
            let addButton = document.createElement('button');
            addButton.innerText = '+';

            addButton.addEventListener('click', function(){
                FetchModel.fetchPlaylistsForAdding(track._id);
            });

            let deleteButton = document.createElement('button');
            deleteButton.innerText = 'x';

            deleteButton.addEventListener('click', function(){
                DeleteModel.deleteOne(track, 'track');
            });

			createRatingInput();
            let buttonsDiv = document.createElement('div');
            buttonsDiv.appendChild(ratingInput);
            buttonsDiv.appendChild(ratingButton);
            buttonsDiv.appendChild(addButton);
            buttonsDiv.appendChild(deleteButton);
            trackDiv.appendChild(buttonsDiv);
    
			TrackView.containerInner.classList.add('containerInner', 'container__inner', 'container__tracks', 'list');
			TrackView.container.appendChild(TrackView.containerInner);
			TrackView.containerInner.appendChild(trackDiv);
		}
    }

const PlaylistView = {
    container: document.getElementById('playlistContainer'),
    containerInner: document.createElement('section'),
    commentsContainer: document.createElement('section'),

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
        PlaylistView.commentsContainer.innerHTML = '';
        let commentList = document.createElement('ul')
        commentList.id = 'commentsList';
        commentList.classList.add('comments');
        let commentsHeadline = document.createElement('h3');
        commentsHeadline.innerText = 'Kommentarer';
        
        if(comments == ''){
            let listElement = document.createElement('li');
            listElement.innerText = 'No comments yet';
            commentList.appendChild(listElement);
        } 
        else {
            for (var i = 0; i < comments.length; i++){
                // console.log(comments[i])
                let comment = `"${comments[i].body}" by ${comments[i].username}`;
                let commentId = comments[i]._id;
                let playlistId = comments[i].playlist;
                let listElement = document.createElement('li');
                let deleteButton = document.createElement('button');
                deleteButton.classList.add('button', 'large', 'clear');
                deleteButton.innerHTML = '<i class="fa fa-minus-circle" style="font-size:1.2em;"></i>';
                listElement.innerText = comment;
                listElement.appendChild(deleteButton);
                commentList.appendChild(listElement);

                deleteButton.addEventListener('click', function(){
                    DeleteModel.deleteComment(commentId, playlistId);
                });
            }
        }
        PlaylistView.commentsContainer.appendChild(commentsHeadline);
        PlaylistView.commentsContainer.appendChild(commentList);    
    },
    
    displayPlaylists(playlist){
        let rating = RatingModel.calculateRatingAverage(playlist);
        let imageSrc = InputController.setPlaceHolderIfUndefined(playlist.coverImage);

        // Create elements below
        let showSinglePlaylistButton = document.createElement('button');
        showSinglePlaylistButton.dataset.id = playlist._id;
		showSinglePlaylistButton.classList.add('dark', 'small');
        showSinglePlaylistButton.innerHTML = 'Show playlist';

        let playlistDiv = document.createElement('div');
        playlistDiv.innerHTML = `
            <img src="${imageSrc}" alt="${playlist.title}" class="image">
            <h3>${playlist.title}</h3>
            <h4>Created by: ${playlist.createdBy}</h4>
            <h4>Tracks: ${playlist.tracks.length}</h4>
            <h4>Rating: ${rating} / 10</h4>`;
        container.appendChild(playlistDiv);
        
        playlistDiv.appendChild(showSinglePlaylistButton);

        PlaylistView.containerInner.classList.add('containerInner', 'container__inner', 'container__playlists', 'grid');
        PlaylistView.containerInner.appendChild(playlistDiv);
        PlaylistView.container.appendChild(PlaylistView.containerInner);
        
        showSinglePlaylistButton.addEventListener('click', function(){
            let id = this.dataset.id;
            PlaylistView.displaySinglePlaylist(id, rating, playlist)           
        });
    },

    displaySinglePlaylist(id, rating, playlist){
        FetchModel.fetchComments(id);
        PlaylistView.container.innerHTML = '';
		let ratingInput = createRatingInput();
        let ratingButton = document.createElement('button');
        ratingButton.innerText = "Rate";
        let tracklist = PlaylistView.getTrackListFrom(playlist); 
        
        let singlePlaylistContent = document.createElement('section');
        singlePlaylistContent.classList.add('containerInner', 'container__inner', 'container__playlists', 'list');
        singlePlaylistContent.innerHTML =
               `<h2>${playlist.title}</h2>
                <h4>Created by: ${playlist.createdBy}</h4>
                <h4>Playlist rating: ${rating} / 10</h4>
                ${tracklist}</section>`;

        let singlePlaylistActions = document.createElement('section');
        singlePlaylistActions.classList.add('containerInner', 'container__playlists', 'container__inner--medium');
        
        let newComment = document.createElement('input');
        newComment.type = 'text';
        newComment.placeholder = 'New comment';
		
        let commentBy = document.createElement('input');
        commentBy.type = 'text';
        commentBy.placeholder = "Who's commenting?";

        let addCommentButton = document.createElement('button');
        addCommentButton.innerText = "Add comment";
        addCommentButton.classList.add('button', 'large', 'dark');

        let deletePlaylistButton = document.createElement('button');
        deletePlaylistButton.innerText = "Remove this playlist";
        deletePlaylistButton.classList.add('button', 'large', 'warning');

        singlePlaylistActions.appendChild(ratingInput);
        singlePlaylistActions.appendChild(ratingButton);
        singlePlaylistActions.appendChild(PlaylistView.commentsContainer);
        singlePlaylistActions.appendChild(newComment);
        singlePlaylistActions.appendChild(commentBy);
        singlePlaylistActions.appendChild(addCommentButton);
        singlePlaylistActions.appendChild(deletePlaylistButton);
        PlaylistView.container.appendChild(singlePlaylistContent);
        PlaylistView.container.appendChild(singlePlaylistActions);

        ratingButton.addEventListener('click', function(){
            // skcika in ratingInput.value till API
            console.log(ratingInput.value);
            PostModel.rate('playlist', playlist._id, ratingInput.value);
        });
        
        addCommentButton.addEventListener('click', function(){
            PostModel.addComment(playlist._id, newComment.value, commentBy.value);
        })

        deletePlaylistButton.addEventListener('click', function(){
            DeleteModel.deleteOne(playlist, 'playlist');
        })
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
            lastActivePage = 'home';
            /* Clicking home view will refresh the page, 
            since we want to fetch from */
            location.reload();
    
            /* When we ADD the class hidden, we hide views
             or elements that should not be active */
            NavigationView.postFormsWrapper.classList.add('hidden');
        });
    },  
    
    enablePlaylistView(){
        NavigationView.playlistsMenuAction.addEventListener('click', function(){
            NavigationView.playlistContainer.innerHTML = '';
            PlaylistView.containerInner.innerHTML = '';
            NavigationView.playlistContainer.classList.remove('hidden');
            FetchModel.fetchAll('playlists');       
            
            ArtistView.container.classList.add('hidden');
            NavigationView.postFormsWrapper.classList.add('hidden');
        });

        /* If the user tries to search while on the contribute "page",
        we still allow them to do so, and hide the other views */
        SearchView.searchInput.addEventListener('keyup', function(){
            ArtistView.container.classList.remove('hidden');
            NavigationView.postFormsWrapper.classList.add('hidden');
            NavigationView.playlistContainer.classList.remove('hidden');
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
    }
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

//Create a function that creates a rating input field
function createRatingInput(){
	//Create rating select field with 10 options
	let ratingInput = document.createElement('select');

	for(let i = 1; i <= 10; i++){
		let number = document.createElement('option');
		number.innerText = i;
		number.value = i;
		ratingInput.appendChild(number);
	}
	return ratingInput;
}

function displayRating(){
	
}


const StatusView = {
    statusMessage: document.getElementById('statusMessage'),
	feedbackPopup: document.getElementById('feedbackPopup'),
    /* Takes to params, location should be the div where you want to put the error message
    and status should be a string that fits one of the switch-cases */
    showStatusMessage(status = 'Error', location = 'feedbackPopup'){
		if (location === 'feedbackPopup'){
			feedbackPopup.classList.toggle('hidden');
		}
        switch (status) {
            case "Empty":
            StatusView.statusMessage.innerText = "Oops, you haven't filled out the fields correctly.";
			StatusView.statusMessage.classList.add('feedback__empty');
            break;

            case "Success":
            StatusView.statusMessage.innerText = "Nice, it worked!";
			StatusView.statusMessage.classList.add('feedback__success');
            break;
			
			case "Error":
			StatusView.statusMessage.innerText = "Something went wrong :-(";
			StatusView.statusMessage.classList.add('feedback__error');
			break;
			
			case "commentsError":
			StatusView.statusMessage.innerText = "Something went wrong when loading comments :-(";
			StatusView.statusMessage.classList.add('feedback__error');
			break;
				
			//If none of the feedback messages above, use the text passed as the first parameter in the function
			default:
        	StatusView.statusMessage.innerText = status;
        }
        StatusView.statusMessage.classList.add('feedback');
        location.appendChild(StatusView.statusMessage);
        location.classList.remove('hidden');
		
		//Hide popup when clicking outside of it
		document.addEventListener('click', function(event) {
		  var isClickInside = feedbackPopup.contains(event.target);
		  if (!isClickInside){
			feedbackPopup.classList.add('hidden');
		  }
		});
    }
}



/******************************************************
 ******************** CONTROLLERS *********************
 ******************************************************/

const SearchController = {
    createEventListener: (() => {
        SearchView.searchInput.addEventListener('keyup', function(){
            ArtistView.containerInner.innerHTML = "";
            TrackView.containerInner.innerHTML = "";
            AlbumView.containerInner.innerHTML = "";
            PlaylistView.containerInner.innerHTML = "";

            const searchQuery = document.getElementById('searchInput').value;

            FetchModel.fetchSearched('artists', searchQuery);
            FetchModel.fetchSearched('tracks', searchQuery);
            FetchModel.fetchSearched('albums', searchQuery);
            FetchModel.fetchSearched('playlists', searchQuery);

            GenreController.checkIfGenre(searchQuery);
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
        if (imageSrc === undefined || imageSrc == ''){
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
                // Playlists are sorted before displayed
                ResponseController.sortByRatingHighToLow(response);
                
				for (let playlist of response){
                    PlaylistView.displayPlaylists(playlist);
				}
			break;
		}
    },

    sortByRatingHighToLow(response){
        response.sort((playlistA, playlistB) => {
            let averageForA = RatingModel.calculateRatingAverage(playlistA);
            let averageForB = RatingModel.calculateRatingAverage(playlistB);

            if(averageForA < averageForB){
                return 1;
            }
            if(averageForB < averageForA){
                return -1;
            }
            return 0;
        })  
    }
}


/* TO DO: If searchquery matches a genre: display a link to that genre, 
if clicked then fetchGenre, display as search results. artists, albums, tracks.
also set search input value as the name of the genre*/
GenreController = { 
    checkIfGenre(searchQuery) {
        switch (searchQuery) {
            case 'jazz':
                //display jazz + image. eventlistener that triggers displayGenre
                GenreController.setGenre('jazz');
            break;
            case 'hip hop': 
                GenreController.setGenre('hip hop');
            break;
            case 'rock':
                GenreController.setGenre('rock');
            break;
            case 'folk':
                GenreController.setGenre('folk');
            break;
            case 'reggae':
                GenreController.setGenre('reggae');
            break;
            case 'pop':
                GenreController.setGenre('pop');
            break;
            case 'rnb':
                GenreController.setGenre('rnb');
            break;
            case 'dancehall':
                GenreController.setGenre('dancehall');
            break;
            case 'indie':
                GenreController.setGenre('indie');
            break;
            case 'heavy metal':
                GenreController.setGenre('heavy metal');
            break;
            case 'electronic':
                GenreController.setGenre('electronic');
            break;
        }
    },

    setGenre(genre){
        ArtistView.containerInner.innerHTML = "";
        TrackView.containerInner.innerHTML = "";
        AlbumView.containerInner.innerHTML = "";

        FetchModel.fetchGenre('artists', genre);
        FetchModel.fetchGenre('albums', genre);
        FetchModel.fetchGenre('tracks', genre);
        
        //to show user what genre they're on
        searchInput.value = genre;
    }
}


/********************************************************
 ******************** RUN FUNCTIONS *********************
 *******************************************************/

FetchModel.fetchAll('artists');
FetchModel.fetchAll('albums');
FetchModel.fetchAll('tracks');


NavigationView.enablePostView();
NavigationView.enableHomeView();
NavigationView.enablePlaylistView();

// TO DO: Self invoke
PostView.createEventListeners(); 