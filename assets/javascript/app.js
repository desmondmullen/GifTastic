$(document).ready(function () {
    var theButtons = ['typing cats', 'piano cats', 'sleepy cats', 'sneaky cats', 'cat fails', 'cat wins', 'sleepy kittens', 'sneaky kittens', 'kitten fails', 'kitten wins'];
    var theLastSearch = theButtons[0];
    var theOffset = 0;

    function makeButton(theButton) {
        $('#buttons').append($('<button>').attr({ id: theButton, class: 'btn btn-info query-button' }).text(theButton));
    }

    for (let n = 0; n < theButtons.length; n++) {
        makeButton(theButtons[n]);
    };

    $('.query-button').click(function (event) {
        getGifs(event.target.id, true);
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
        let theButtonName = $('#new-button-text').val();
        if (theButtonName !== "") {
            $('#new-button-text').val("");
            makeButton(theButtonName);
            getGifs(theButtonName, true);
        }
    }

    //retrieve 20 at a time, keep track so we can retrieve more with a more button

    function getGifs(theGifsToGet, clearTheSlate) {
        theGifsToGet = theGifsToGet.split(' ').join('+'); //to take care of any spaces
        let theRating = document.querySelector("input[name='rating']:checked").value;
        if (clearTheSlate === true) {
            theOffset = 0;
        };
        let theQuery = 'https://api.giphy.com/v1/gifs/search?q=' + theGifsToGet + '&rating=' + theRating + '&limit=20&offset=' + theOffset + '&api_key=l1WgOAzyUj9zBJQAGD6fSPdBmHLszb5w';
        $.ajax({
            url: theQuery,
            method: 'GET'
        }).then(function (response) {
            theLastSearch = theGifsToGet;
            $('#last-search').text('last search: ' + theLastSearch + ', rating: ' + theRating);
            if (clearTheSlate === true) {
                $('#gifs-portfolio').empty();
            };
            for (let n = 0; n < response.data.length; n++) {
                theOffset += response.data.length;
                let theName = response.data[n].title;
                let theRating = response.data[n].rating;
                let theFixedWidthURL = response.data[n].embed_url;
                let theFixedWidthStill = response.data[n].images.fixed_width_still.url;
                $('#gifs-portfolio').append("<div class='gif-holder'><div class='gif-info'>" + theName + "</div><div class='gif-rating'>Rating: " + theRating + "</div><img src='" + theFixedWidthStill + "'><iframe src='" + theFixedWidthURL + "'></iframe></div>");
            }
        });
    }
    getGifs(theLastSearch, true);
});
