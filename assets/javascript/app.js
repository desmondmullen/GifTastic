$(document).ready(function () {
    var theButtons = ['typing cat', 'piano cat', 'sleepy cat', 'sneaky cat', 'cat fail', 'cat win', 'sleepy kitten', 'sneaky kitten', 'kitten fail', 'kitten win'];
    var theFavorites = [];
    var theLastSearch = theButtons[0];
    var theOffset = 0;

    $('#buttons').append($('<button>').attr({ id: 'Favorites', class: 'btn btn-info favorites' }).html("<span class='glyphicon glyphicon-heart'></span> Favorites")); //runs once to make a Favorites button

    function makeButton(theButton) {
        $('#buttons').append($('<button>').attr({ id: theButton, class: 'btn btn-info query-button' }).text(theButton));
    }

    for (let n = 0; n < theButtons.length; n++) {
        makeButton(theButtons[n]);
    };

    $('.query-button').click(function (event) {
        getGifs(event.target.id, true);
    });

    $(document).on('click', '.glyphicon', function (event) {
        let theIDtoFavorite = $(this).attr('data-id');
        if ($(this).attr('class') === 'glyphicon glyphicon-heart-empty') {
            $(this).attr({ 'class': 'glyphicon glyphicon-heart' });
            theFavorites.push(theIDtoFavorite);
        } else {
            $(this).attr({ 'class': 'glyphicon glyphicon-heart-empty' });
            theFavorites.splice(theFavorites.indexOf(theIDtoFavorite), 1);
        }
    });

    $('.favorites').click(function (event) {
        getFavoriteGifs()
    });

    $('#add-new-button').click(function () {
        makeNewButton()
    });

    $('#more-button').click(function () {
        getGifs(theLastSearch, false);
    });

    $("#new-button-text").on('keypress', function (event) {
        if (event.which == 13) {
            makeNewButton()
        }
    });

    function makeNewButton() {
        let theButtonName = $('#new-button-text').val().trim();
        if (theButtonName !== "") {
            $('#new-button-text').val("");
            makeButton(theButtonName);
            getGifs(theButtonName, true);
        }
    }

    function getGifs(theGifsToGet, clearTheSlate) {
        theGifsToGet = theGifsToGet.split(' ').join('+'); //to take care of any spaces
        let theRating = document.querySelector("input[name='rating']:checked").value;
        if (clearTheSlate === true) {
            theOffset = 0;
        };
        let theQuery = 'https://api.giphy.com/v1/gifs/search?q=' + theGifsToGet + '&rating=' + theRating + '&limit=10&offset=' + theOffset + '&api_key=l1WgOAzyUj9zBJQAGD6fSPdBmHLszb5w';
        $.ajax({
            url: theQuery,
            method: 'GET'
        }).then(function (response) {
            theLastSearch = theGifsToGet;
            $('#last-search').text('last search: ' + theLastSearch + ', rating: ' + theRating);
            if (clearTheSlate === true) {
                $('#gifs-portfolio').empty();
            };
            parseTheResponse(response)
        });
    }

    function getFavoriteGifs() {
        theGifsToGet = theFavorites.join(",");
        let theQuery = 'https://api.giphy.com/v1/gifs?ids=' + theGifsToGet + '&api_key=l1WgOAzyUj9zBJQAGD6fSPdBmHLszb5w';
        $.ajax({
            url: theQuery,
            method: 'GET'
        }).then(function (response) {
            theLastSearch = theGifsToGet;
            $('#last-search').text('last search (favorites): ' + theLastSearch);
            $('#gifs-portfolio').empty();
            parseTheResponse(response)
        });
    }

    function parseTheResponse(response) {
        for (let n = 0; n < response.data.length; n++) {
            theOffset += response.data.length;
            let theID = response.data[n].id;
            let theName = response.data[n].title;
            theName = theName.substr(0, theName.indexOf(" GIF"));
            let theRating = response.data[n].rating;
            let theFixedWidthURL = response.data[n].embed_url;
            let theFixedWidthStill = response.data[n].images.fixed_width_still.url;
            $('#gifs-portfolio').append("<div class='gif-holder'><div class='gif-info'>" + theName + " <span class='glyphicon glyphicon-heart-empty' data-id='" + theID + "'></span></div><div class='gif-rating'>Rating: " + theRating + "</div><div class='img-and-iframe'><img src='" + theFixedWidthStill + "'><iframe src='" + theFixedWidthURL + "'></iframe></div></div>");
        }
    }

    getGifs(theLastSearch, true);
});
