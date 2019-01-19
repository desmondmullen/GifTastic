$(document).ready(function () {
    var theButtons = ['typing cat', 'piano cat', 'sleepy cat', 'sneaky cat', 'cat fail', 'cat win', 'sleepy kitten', 'sneaky kitten', 'kitten fail', 'kitten win'];
    var theFavorites = [];
    var theLastSearch = theButtons[0];
    var theOffset = 0;

    if (window.matchMedia("(max-width: 670px)").matches) { //make this heading shorter on mobiles, otherwise leave it as it is hard-wired
        $('#ratings-heading').html('Max. Rating: &nbsp;&nbsp;');
    };

    function makeButton(theButton) {
        $('#buttons').append($('<button>').attr({ id: theButton, class: 'btn btn-info query-button' }).text(theButton));
    }

    function resetButtons() {
        $('#buttons').html($('<button>').attr({ id: 'favorites', class: 'btn btn-info favorites' }).html("<span class='glyphicon glyphicon-heart'></span> Favorites")); //runs once to make a Favorites button
        for (let n = 0; n < theButtons.length; n++) {
            makeButton(theButtons[n]);
        };
    };
    resetButtons();

    $(document).on('click', '.query-button', function (event) {
        let theButton = event.target.id
        if (event.originalEvent.getModifierState('Alt')) {//if the alt or option key is pressed then
            if (confirm('Click OK to delete the \"' + theButton + '\" button')) {
                theButtons.splice(theButtons.indexOf(theButton), 1);
                resetButtons();
            };
        } else {
            getGifs(theButton, true);
        };
    });

    $(document).on('click', '.glyphicon', function (event) { //favorites
        let theIDtoFavorite = $(this).attr('data-id');
        if ($(this).attr('class') === 'glyphicon glyphicon-heart-empty') {
            $(this).attr({ 'class': 'glyphicon glyphicon-heart' });
            theFavorites.push(theIDtoFavorite);
        } else {
            $(this).attr({ 'class': 'glyphicon glyphicon-heart-empty' });
            theFavorites.splice(theFavorites.indexOf(theIDtoFavorite), 1);
        }
        setCookies();
    });

    $(document).on('click', '.favorites', function (event) {
        getFavoriteGifs();
    });

    $('#search-button').click(function () {
        doSearchWithoutButton();
    });

    $('#add-new-button').click(function () {
        makeNewButton();
    });

    $('#more-button').click(function () {
        getGifs(theLastSearch, false);
    });

    $("#search-text").on('keypress', function (event) {
        if (event.which == 13) {
            doSearchWithoutButton();
        }
    });

    $("#new-button-text").on('keypress', function (event) {
        if (event.which == 13) {
            makeNewButton();
        }
    });

    function doSearchWithoutButton() { //doesn't create a new button
        let theSearchString = $('#search-text').val().trim();
        if (theSearchString !== "") {
            $('#search-text').val("");
            getGifs(theSearchString, true);
        }
    }

    function makeNewButton() {
        let theButtonName = $('#new-button-text').val().trim();
        if (theButtonName !== "") {
            theButtons.push(theButtonName);
            $('#new-button-text').val("");
            makeButton(theButtonName);
            getGifs(theButtonName, true);
        }
    }

    function getGifs(theGifsToGet, clearTheSlate) {
        theGifsToGet = theGifsToGet.split(' ').join('+'); //to take care of any spaces
        let theRating = document.querySelector("input[name='rating']:checked").value.toUpperCase();
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
            $('#more-button').attr({ 'style': 'opacity: 1' });
        });
    };

    function getFavoriteGifs() {
        if (theFavorites.length < 1) {
            $('#gifs-portfolio').html('<br><br><h1>You have no saved favorites at this time.<br>Click the heart outline on any gif to make it a favorite.</h1>');
            $('#more-button').attr({ 'style': 'opacity: 0' });
        } else {
            theGifsToGet = theFavorites.join(",");
            let theQuery = 'https://api.giphy.com/v1/gifs?ids=' + theGifsToGet + '&api_key=l1WgOAzyUj9zBJQAGD6fSPdBmHLszb5w';
            $.ajax({
                url: theQuery,
                method: 'GET'
            }).then(function (response) {
                theLastSearch = theGifsToGet;
                $('#last-search').text('last search (favorites, by ID): ' + theLastSearch);
                $('#gifs-portfolio').empty();
                parseTheResponse(response)
                $('#more-button').attr({ 'style': 'opacity: 0' });
            });
        };
    };

    function parseTheResponse(response) {
        for (let n = 0; n < response.data.length; n++) {
            theOffset += response.data.length;
            let theID = response.data[n].id;
            let theName = response.data[n].title;
            theName = theName.substr(0, theName.indexOf(" GIF"));
            theName = theName.substr(0, 26);
            let theRating = response.data[n].rating.toUpperCase();
            let theFixedWidthURL = response.data[n].embed_url;
            let theFixedWidthStill = response.data[n].images.fixed_width_still.url;
            if (theFavorites.indexOf(theID) > -1) { //then we show the favorited heart
                $('#gifs-portfolio').append("<div class='gif-holder'><div class='img-and-iframe'><img src='" + theFixedWidthStill + "'><iframe src='" + theFixedWidthURL + "'></iframe></div><div class='gif-info'>" + theName + " <span class='glyphicon glyphicon-heart' data-id='" + theID + "'> </span></div><div class='gif-rating'>Rated: " + theRating + "</div></div>");
            } else { //then we show the non-favorited heart
                $('#gifs-portfolio').append("<div class='gif-holder'><div class='img-and-iframe'><img src='" + theFixedWidthStill + "'><iframe src='" + theFixedWidthURL + "'></iframe></div><div class='gif-info'>" + theName + " <span class='glyphicon glyphicon-heart-empty' data-id='" + theID + "'> </span></div><div class='gif-rating'>Rated: " + theRating + "</div></div>");
            }
        }
    }

    function setCookies() {
        theFavoritesCookieString = 'favorites=' + theFavorites.join(",") + '; expires=Wed, 1 Jan 2025 12:00:00 UTC; path=/;';
        document.cookie = theFavoritesCookieString;
        theButtonsCookieString = 'buttons=' + theFavorites.join(",") + '; expires=Wed, 1 Jan 2025 12:00:00 UTC; path=/;';
        document.cookie = theButtonsCookieString;
        getCookies();
    };

    function getCookies() {
        if (document.cookie != '') {
            theString = (document.cookie).split('; ');
            for (let n = 0; n < theString.length; n++) {
                if (theString[n].startsWith('favorites')) {
                    theFavorites = ((theString[n].split('='))[1]).split(',');
                    console.log('favorites: ' + theFavorites);
                };
                if (theString[n].startsWith('buttons')) {
                    theButtons = ((theString[n].split('='))[1]).split(',');
                    console.log('buttons: ' + theButtons);
                };
            };
        };
    };

    // function getCookies() {
    //     console.log(document.cookie);
    //     if (document.cookie != '') {
    //         let theCookies = (document.cookie).split('; ');
    //         let theFavoritesCookie = theCookies[theCookies.indexOf('favorites')];
    //         let theButtonsCookie = theCookies[theCookies.indexOf('buttons')];
    //         console.log('favorites: ' + theFavoritesCookie);
    //         console.log('buttons: ' + theButtonsCookie);
    //         theFavoritesCookie = theFavoritesCookie.split('=');
    //         theFavoritesCookie = theFavoritesCookie[1];
    //         theButtonsCookie = theButtonsCookie.split('=');
    //         theButtonsCookie = theButtonsCookie[1];
    //         console.log('favorites: ' + theFavoritesCookie);
    //         console.log('buttons: ' + theButtonsCookie);
    //         // let theCookie = document.cookie.substr(10);
    //         // if (theCookie != '') {
    //         //     theFavorites = theCookie.split(',');
    //         // };
    //     };
    // };

    getCookies();
    getGifs(theLastSearch, true);
});
