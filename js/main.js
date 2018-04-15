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
				AddToPlaylistView.displayPlaylistsPopUp(response, trackId);
			})
			.catch(error => console.log(error));
        },
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
        });
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
                FetchModel.fetchComments(playlistId);
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
		});
	}
}

const DeleteModel = {
    //TO DO: make switch statement, if artist: title=name
    deleteOne(objectToDelete, category){
        if (confirm(`Do you want to Delete ${objectToDelete.title}?`)){
            fetch(`${baseUrl}/${category}s/${objectToDelete._id}?key=flat_eric`, {
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
        });
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

    displayPlaylistsPopUp: (response, trackId) => {
        let div = document.createElement('div');
        div.classList.add('popup__add-to-playlist');
        let ul = document.createElement('ul');
        let createPlaylistButton = document.createElement('button');
        createPlaylistButton.innerText = 'Create new playlist';
        createPlaylistButton.classList.add('dark', 'large', 'showPlaylistForm');
        const createPlaylistContainer = document.getElementById('createPlaylistContainer');
		
		//Hide popup when clicking outside of it
		document.addEventListener('click', function(event) {
		  var isClickInside = div.contains(event.target);
		  if (!isClickInside){
			console.log('Clicked outside div')
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
			let ratingInput = createRatingInput();
			
			albumDiv.innerHTML = `
					<img src="${imageSrc}" alt="${album.title}" class="image">
					<h3><a href="${album.spotifyURL}" target="_blank">${album.title}</a></h3><br>
					<h4>${albumArtists}</h4>
					<p>Genres: ${album.genres}</p>`;
            
			
			ratingInput.addEventListener('change', function(){
				// skcika in ratingInput.value till API
				console.log(ratingInput.value);
				PostModel.rate('album', album._id, ratingInput.value);
			});
			
            //make function/controller
            //fex one for creating the button + eventlistenr 
            //and one for delete(function called in eventlistener) 
            let deleteButton = document.createElement('button');
            deleteButton.innerText = 'x';

            deleteButton.addEventListener('click', function(){
                DeleteModel.deleteOne(album, 'album');
            });

            let buttonDiv = document.createElement('div');
			buttonDiv.appendChild(ratingInput);
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
			
			trackDiv.innerHTML = `
				<h3><a href="${track.spotifyURL}" target="_blank">${track.title}</a></h3><br>
                <h4>by ${trackArtists}</h4>`;
			
			ratingInput.addEventListener('change', function(){
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
                console.log('scroll up');
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
                deleteButton.innerText = 'x';
                listElement.innerText = comment;
                listElement.appendChild(deleteButton);
                commentList.appendChild(listElement);

                deleteButton.addEventListener('click', function(){
                    DeleteModel.deleteComment(commentId, playlistId);
                });
            }
        }
        
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
            <h3>${playlist.title}</h3><br>
            <h4>Created by: ${playlist.createdBy}</h4>
            <h4>Tracks: ${playlist.tracks.length}</h4>
            <h4>Rating: ${rating}</h4>`;
        container.appendChild(playlistDiv);
        
        playlistDiv.appendChild(showSinglePlaylistButton);

        PlaylistView.containerInner.classList.add('containerInner', 'container__inner', 'container__albums', 'grid');
        PlaylistView.containerInner.appendChild(playlistDiv);
        PlaylistView.container.appendChild(PlaylistView.containerInner);
        
        showSinglePlaylistButton.addEventListener('click', function(){
            let id = this.dataset.id;
            PlaylistView.displaySinglePlaylist(id, rating, playlist)           
        });
    },

    displaySinglePlaylist(id, rating, playlist){
        // Fetch comments for single playlist, since these should be displayed as well
        FetchModel.fetchComments(id);
		let ratingInput = createRatingInput();
        let tracklist = PlaylistView.getTrackListFrom(playlist); 
		
        let singlePlaylistContent = `
            <section class="containerInner container__inner container__tracks list">
                <h2>${playlist.title}</h2><br>
                <h4>Created by: ${playlist.createdBy}</h4>
                <h4>Rating: ${rating}</h4>
                ${tracklist}
            </section>`;
		
		ratingInput.addEventListener('change', function(){
			// skcika in ratingInput.value till API
			console.log(ratingInput.value);
			PostModel.rate('playlist', playlist._id, ratingInput.value);
		});
		
		
        let newComment = document.createElement('input');
        newComment.type = 'text';
        newComment.placeholder = 'New comment';
		
        let commentBy = document.createElement('input');
        commentBy.type = 'text';
        commentBy.placeholder = "Who's commenting?";

        let addCommentButton = document.createElement('button');
        addCommentButton.innerText = "Add comment";
        addCommentButton.classList.add('button', 'small', 'dark');

        let removePlaylistButton = document.createElement('button');
        removePlaylistButton.innerText = "Remove this playlist";
        removePlaylistButton.classList.add('button', 'small', 'light');

        PlaylistView.container.innerHTML = `${singlePlaylistContent}`;
		PlaylistView.container.appendChild(ratingInput);
        PlaylistView.container.appendChild(newComment);
        PlaylistView.container.appendChild(commentBy);
        PlaylistView.container.appendChild(addCommentButton);
        PlaylistView.container.appendChild(PlaylistView.commentsContainer);
        PlaylistView.container.appendChild(removePlaylistButton);

        addCommentButton.addEventListener('click', function(){
            newComment = newComment.value;
            commentBy = commentBy.value;
            PostModel.addComment(playlist._id, newComment, commentBy);
        })

        removePlaylistButton.addEventListener('click', function(){
            // console.log(playlist, playlist)
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
            NavigationView.playlistContainer.classList.add('hidden');
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


NavigationView.enablePostView();
NavigationView.enableHomeView();
NavigationView.enablePlaylistView();

// TO DO: Self invoke
PostView.createEventListeners(); 