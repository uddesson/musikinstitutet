let apiKey = `key=flat_eric`;
const baseUrl = `https://folksa.ga/api`; 

/*******************************************************
 *********************** MODELS ************************
 *******************************************************/

const FetchModel = {
    
	fetchAll(category){
        // We want to use our api-key plus this for category albums
        if(category == 'albums'){
            apiKey += '&populateArtists=true';
        }

        // Fetching the 12 latest of any category
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
        // Path differs for artists, we need to replace title with name
        let title = 'title';
        if(category == 'artists'){
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
			.catch(error => { StatusView.showStatusMessage("Error", feedbackPopup); });
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

        /* When adding to the api you recive 
        success/error-notifactions, this is were they're shown */
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

        // Don't post anything if form fields are empty
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
        // Don't post ratings to api unless they're actually more than 0
        if (rating > 0) {
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
                StatusView.showStatusMessage(`You rated this a ${rating} out of 10!`, feedbackPopup);
            })
            .catch(error);
        } else {
            alert('Choose a rating between 1 and 10!');
        }
    }
}

const DeleteModel = {
    deleteOne(objectToDelete, category){
		let title = objectToDelete.title;
        
        if(category == 'artist'){
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
                
                // Wait 3 seconds before page is refreshed
				setTimeout(function(){ 
					location.reload(); 
				}, 3000);
            })
			.catch(error => {   
                StatusView.showStatusMessage("Error", feedbackPopup)
			});
        } 
        else{
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
    
    calculateRatingAverage(category){
        let ratingSum = 0;
            for (var rating of category.ratings){  
                ratingSum = ratingSum + rating; 
            }
        let ratingAverage = ratingSum / category.ratings.length; // Do math, get average of array!
        
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

    // This is triggerd when you want to add a track to a playlist
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
                // Show create playlist form
                createPlaylistContainer.classList.toggle('hidden');
                // Append the form before the button
                createPlaylistButton.insertAdjacentElement('beforebegin', createPlaylistContainer);
                // Change behavior from displaying form to creating playlist
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
                
                // Change behavior from creating playlist to displaying form
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
    
    } // Closing displayPlaylistsPopUp()
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
        artistDiv.innerHTML = `<img src="${imageSrc}" 
                alt="${artist.name}" class="image">
                <h3><a href="${artist.spotifyURL}" 
                target="_blank">${artist.name}</a></h3>`;
        
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
            title="Remove from FED17 Faves"></i>`;

        deleteButton.addEventListener('click', function(){
            DeleteModel.deleteOne(artist, 'artist');
        });

        let deleteIcon = document.createElement('div');
        deleteIcon.classList.add('deleteIcon');
        deleteIcon.appendChild(deleteButton);
        artistDiv.appendChild(deleteIcon);

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
        let rating = RatingModel.calculateRatingAverage(album);
        let ratingInput = createRatingInput();
        let ratingButton = document.createElement('button');
        ratingButton.innerText = "Rate";
        
        albumDiv.innerHTML = `
                <img src="${imageSrc}" alt="${album.title}" class="image">
                <h3><a href="${album.spotifyURL}" target="_blank">${album.title}</a></h3>
                <h4>${albumArtists}</h4>`;
        
        
        ratingButton.addEventListener('click', function(){
            PostModel.rate('album', album._id, ratingInput.value);
        });
        
        let deleteButton = document.createElement('button');
        deleteButton.innerHTML = `<i class="fa fa-times" 
            title="Remove from FED17 Faves"></i>`;

        deleteButton.addEventListener('click', function(){
            DeleteModel.deleteOne(album, 'album');
        });

        let deleteIcon = document.createElement('div');
        deleteIcon.classList.add('deleteIcon');
        deleteIcon.appendChild(deleteButton);
        albumDiv.appendChild(deleteIcon);

        let ratingDiv = document.createElement('div');
        ratingDiv.classList.add('rating__div');

        let ratingOutput = document.createElement('p');
        ratingOutput.innerHTML = `Rating: ${rating} / 10`;

        ratingDiv.appendChild(ratingOutput);
        ratingDiv.appendChild(ratingInput);
        ratingDiv.appendChild(ratingButton);
        albumDiv.appendChild(ratingDiv);

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
        let rating = RatingModel.calculateRatingAverage(track);
        let ratingInput = createRatingInput();
        let ratingButton = document.createElement('button');
            ratingButton.innerText = "Add rating";
        
        trackDiv.innerHTML = `<h3><a href="${track.spotifyURL}" 
            target="_blank">${track.title}</a></h3><br>
            <h4>by ${trackArtists}</h4>
            Rating: ${rating} / 10`;
        
        // Rating magic happens when rate-button is clicked
        ratingButton.addEventListener('click', function(){
            PostModel.rate('track', track._id, ratingInput.value);
        });
          
        let addButton = document.createElement('button');
            addButton.innerHTML = `<i class="fa fa-plus" 
            title="Remove from FED17 Faves"></i>`;

        addButton.addEventListener('click', function(){
            FetchModel.fetchPlaylistsForAdding(track._id);
        });

        let deleteButton = document.createElement('button');
        deleteButton.innerHTML = `<i class="fa fa-times" 
            title="Remove from FED17 Faves"></i>`;

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

        // When the playlist has tracks, add each to the tracklist
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
        /* For a "refreshing" page effect 
        we empty the container everytime we call showComments */
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
                let comment = `"${comments[i].body}" by ${comments[i].username}`;
                let commentId = comments[i]._id;
                let playlistId = comments[i].playlist;

                let listElement = document.createElement('li');

                let deleteButton = document.createElement('button');
                deleteButton.classList.add('button', 'large', 'clear');
                deleteButton.innerHTML = `<i class="fa fa-minus-circle" 
                style="font-size:1.2em;"></i>`;

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

        PlaylistView.containerInner.classList.add('containerInner', 'container__inner', 'grid');
        PlaylistView.containerInner.appendChild(playlistDiv);
        PlaylistView.container.appendChild(PlaylistView.containerInner);
        
        showSinglePlaylistButton.addEventListener('click', function(){
            // Get the id from the clicked playlist
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
            singlePlaylistContent.classList.add('containerInner', 'container__inner', 'container__playlist', 'list');
            singlePlaylistContent.innerHTML =
                `<h3>${playlist.title}</h3>
                    <h4><span class="text--bold">Created by:</span> ${playlist.createdBy}</h4>
                    <h4><span class="text--bold">Playlist rating:</span> ${rating} / 10</h4>
                    ${tracklist}</section>`;

        let singlePlaylistActions = document.createElement('section');
            singlePlaylistActions.classList.add('containerInner', 'container__playlist', 'container__inner--medium');
        
        let newComment = document.createElement('input');
            newComment.type = 'text';
            newComment.placeholder = 'New comment';
		
        let commentBy = document.createElement('input');
            commentBy.type = 'text';
            commentBy.placeholder = "Who's commenting?";

        let addCommentButton = document.createElement('button');
            addCommentButton.innerText = "Add comment";
            addCommentButton.classList.add('button', 'large', 'dark', 'block');

        let deletePlaylistButton = document.createElement('button');
            deletePlaylistButton.innerText = "Remove this playlist";
            deletePlaylistButton.classList.add('button', 'large', 'warning');

        // Error/Success-messages are to be displayed in this location
        let locationForDisplayingStatus = document.createElement('div');
        
        singlePlaylistActions.appendChild(ratingInput);
        singlePlaylistActions.appendChild(ratingButton);
        singlePlaylistActions.appendChild(PlaylistView.commentsContainer);
        singlePlaylistActions.appendChild(newComment);
        singlePlaylistActions.appendChild(commentBy);
        singlePlaylistActions.appendChild(locationForDisplayingStatus);
        singlePlaylistActions.appendChild(addCommentButton);
        singlePlaylistActions.appendChild(deletePlaylistButton);

        PlaylistView.container.appendChild(singlePlaylistContent);
        PlaylistView.container.appendChild(singlePlaylistActions);

        ratingButton.addEventListener('click', function(){
            PostModel.rate('playlist', playlist._id, ratingInput.value);
            StatusView.showStatusMessage("Success", locationForDisplayingStatus);
        });
        
        addCommentButton.addEventListener('click', function(){
            if(InputController.inputIsEmptySpace(newComment.value)
            || InputController.inputIsEmptySpace(commentBy.value)){
                // Empty values will stop comment from being added
                StatusView.showStatusMessage("Empty", locationForDisplayingStatus);
            }
            // If values are set, a new comment can be added
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

    // The actions (menu-texts) that choose between in the navbar
    homeMenuAction: document.getElementById('home'),
    contributeMenuAction: document.getElementById('contribute'),
    playlistsMenuAction: document.getElementById('playlists'),

    // Wrappers that we can use for toggling hidden-class
    postFormsWrapper: document.getElementById('postFormsWrapper'),
    playlistContainer: document.getElementById('playlistContainer'),

    enableHomeView(){
        NavigationView.homeMenuAction.addEventListener('click', function(){
            /* Clicking home view will refresh the entire page, 
            because we want to re-fetch the latest content from the API */
            location.reload();
        });
    },  
    
    enablePlaylistView(){
        NavigationView.playlistsMenuAction.addEventListener('click', function(){
            // Empty containers to prevent double playlist-views
            NavigationView.playlistContainer.innerHTML = '';
            PlaylistView.containerInner.innerHTML = '';

            NavigationView.playlistContainer.classList.remove('hidden');
            
            FetchModel.fetchAll('playlists');       
            
            // Hide elements we don't want to show for playlist-views
            ArtistView.container.classList.add('hidden');
            NavigationView.postFormsWrapper.classList.add('hidden');
        });

        /* If the user tries to search while on the playlist "page",
        we still allow them to do so, and hide the other views */
        SearchView.searchInput.addEventListener('keyup', function(){
            ArtistView.container.classList.remove('hidden');
            NavigationView.postFormsWrapper.classList.add('hidden');
            NavigationView.playlistContainer.classList.add('hidden');
        });
    },

    enablePostView(){
        NavigationView.contributeMenuAction.addEventListener('click', function(){
            // Show the forms for posting new content
            NavigationView.postFormsWrapper.classList.remove('hidden');

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

    // Get post-forms and their fields elow
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

        // Eventlistener that triggers add artist
        PostView.buttons.addArtistButton.addEventListener('click', function(event){
            event.preventDefault(); // Stop page from refreshing on click
            PostModel.addArtist();
        })
        
        // ... Add album
        PostView.buttons.addAlbumButton.addEventListener('click', function(event){
            event.preventDefault();
            PostModel.addAlbum();
        })
        
        // ... Add track
        PostView.buttons.addTrackButton.addEventListener('click', function(event){
            event.preventDefault();
            PostModel.addTrack();
        })
    }
}

//Create a function that creates a rating input field
function createRatingInput(){

    //Create rating select field with 10 options
    let ratingInputDiv = document.createElement('div');
    let ratingInput = document.createElement('select');
    const defaultOption = document.createElement('option');
    ratingInput.appendChild(defaultOption);

	for(let i = 1; i <= 10; i++){
		let number = document.createElement('option');
		number.innerText = i;
		number.value = i;
		ratingInput.appendChild(number);
    }
    ratingInputDiv.appendChild(ratingInput)
	return ratingInput;
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
            StatusView.statusMessage.innerText = "Nice, you just contributed to FED17-Faves!";
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
        location.classList.remove('hidden');
        location.appendChild(StatusView.statusMessage);
		
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

    /* We use a keyup-eventlisteners that checks the search-input 
    and sends it along to fetchSearched */
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

            // Checks for specific genres and makes genre-search available for these
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
        // Returns source for a placeholder image
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
                // Playlists are sorted before they are displayed
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


GenreController = { 
    checkIfGenre(searchQuery) {
        switch (searchQuery) {
            case 'jazz':
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

// Fetch all the stuff!
FetchModel.fetchAll('artists');
FetchModel.fetchAll('albums');
FetchModel.fetchAll('tracks');

// Let the user switch between "views" through navbar
NavigationView.enablePostView();
NavigationView.enableHomeView();
NavigationView.enablePlaylistView();

// Generate eventlisteners for post-forms on postview
PostView.createEventListeners(); 