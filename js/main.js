const apiKey = `key=flat_eric`;
const baseUrl = `https://folksa.ga/api`; 




/******************************************************
 ******************** CONTROLLERS *********************
 ******************************************************/

 const SearchController = {
    searchButton: document.getElementById('searchButton'),

    //The "general search"
    createEventListener (){
        searchButton.addEventListener('click', function(){
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

SearchController.createEventListener();



const GenderController = {
    excludeMaleArtists(artist){
        let artists = artist.filter(artist => artist.gender !== 'male');
        return artists;
    }
}


/*******************************************************
 *********************** MODELS ************************
 *******************************************************/

//TEMPORARY CONSTS FOR FETCH URL
const id = '5aae2dd4b9791d0344d8f719';
const category = 'albums';
const searchQuery = 'shakira';

const FetchModel = {
	fetchAll(category){
		return fetch(`${baseUrl}/${category}?${apiKey}`)
			.then(response => response.json())
			.then(response => console.log(response))
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
            .then(response => console.log(category, response))
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


/******************************************************
 *********************** VIEWS ************************
 ******************************************************/

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
		albumDiv.innerHTML = `
			<h3>${album.title}</h3> 
			by <h4>${album.artists}</h4>
			<p>Genres: ${album.genres}</p>`;
		AlbumView.grid.appendChild(albumDiv);
	}
}



const SearchView = {
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
        const ul = document.createElement('ul');

        for (let artist of artists){
            let listItem = document.createElement('li');

            listItem.innerText = artist.name;
            //+ display image

            //make link/eventlistener with artist.id around both name and image

            ul.appendChild(listItem);
        }

        SearchView.output.appendChild(ul);
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

/********************************************************
 ******************** RUN FUNCTIONS *********************
 *******************************************************/

FetchModel.fetchAll('albums');

//FetchModel.fetchOne('albums', '5aae2dd4b9791d0344d8f719');