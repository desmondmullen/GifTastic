var queryURL = "https://api.giphy.com/v1/gifs/search?q=kitten&api_key=l1WgOAzyUj9zBJQAGD6fSPdBmHLszb5w";
$.ajax({
    url: queryURL,
    method: "GET"
}).then(function (response) {
    $("#result").empty();
    for (let n = 0; n < response.data.length; n++) {
        let theEmbedURL = response.data[n].embed_url;
        let theFixedWidthStill = response.data[n].images.fixed_width_still.url;
        $("#result").append("<div class='gif-holder'><img src='" + theFixedWidthStill + "' width='150px'><iframe src='" + theEmbedURL + "' width='150px' frameBorder='0'></iframe></div>");
    }
});
