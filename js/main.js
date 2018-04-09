
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

//FetchModel.fetchAll('artists');
FetchModel.fetchAll('albums');
//FetchModel.fetchAll('tracks');

// let sortedArtists = FetchModel.fetchSortedArtists();

NavigationView.enablePostView();
NavigationView.enableHomeView();

// TO DO: Maybe make creating eventlisteners self-invoked?
PostView.createEventListeners(); 
SearchController.createEventListener();