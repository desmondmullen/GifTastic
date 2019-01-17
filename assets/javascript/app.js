var queryURL = "https://api.giphy.com/v1/gifs/search?q=kitten&api_key=l1WgOAzyUj9zBJQAGD6fSPdBmHLszb5w";
$.ajax({
    url: queryURL,
    method: "GET"
}).then(function (response) {
    let theEmbedURL = response.data[0].embed_url;
    let theFixedWidthStill = response.data[0].images.fixed_width_still.url;
    $("#result").html("<div><img src=\"" + theFixedWidthStill + "\" width='150px'><iframe src=\"" + theEmbedURL + "\" width='150px' frameBorder='0'></iframe></div>");
});
