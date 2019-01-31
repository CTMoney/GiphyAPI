//api key
const api_Key = "yO9K88VoPrdjUH8vRA379FOR9vjtos3a";
//counter for variable button ID's
var buttonCounter = 1;
//repeat preventing array
let dontRepeat = [];
//static url that will be changed to variable
const embed_url = "https://i.giphy.com/media/3ohzgD1wRxpvpkDCSI/giphy.webp";
//default buttons
const default_buttons = ["wow", "mind blown", "omg"];
//dynamic upon refresh placeholder text with suggestions
const placeholders = ["cats", "hamsters", "shock", "evil", "panic", "dogs", "80s", "dancing", "finger guns", "capybara"];

//appending default buttons
for (let i = 0; i < 3; i++) {
    $("#button-dump").append(`<button class="setSearchButton btn btn-light"
            type='button' id='button-${buttonCounter}' value='${default_buttons[i]}' style="margin-left: 5px; margin-top: 3px;">${default_buttons[i]}</button>`);
}
$("#searchTerm").attr("placeholder", `What to search for... "${placeholders[Math.floor(Math.random() * (placeholders.length - 1))]}"?`);


//input on-click event
$("#add-searchTerm").on("click", function () {

    //preventing reload
    event.preventDefault();

    //saving input
    let usersSearchTerm = $("#searchTerm").val().toLowerCase().trim();

    //conditional to prevent empty buttons 
    if (usersSearchTerm !== '') {

        //conditional to prevent repeat buttons            
        if (!dontRepeat.includes(usersSearchTerm)) {

            //removing current html elements
            $("#gif-dump").html("");



            //pushing the search terms into array to prevent repeat buttons    
            dontRepeat.push(usersSearchTerm);

            //emptying search box
            $("#searchTerm").val('');

            //URL template that takes my API and users search and calls back 10 gifs with the G rating w/ the search term
            let queryURL = `https://api.giphy.com/v1/gifs/search?api_key=${api_Key}&q=${usersSearchTerm}&limit=30&offset=0&rating=G&lang=en`

            //ajax call to GET api data
            $.ajax({ url: queryURL, method: "GET" }).then(response => {
                if (response.pagination["total_count"] > 0) {

                    //template string for buttons
                    $("#button-dump").append(`<button class="setSearchButton btn btn-light"
                        type='button' id='button-${buttonCounter}' value='${usersSearchTerm}' style="margin-left: 5px; margin-top: 3px;">${usersSearchTerm}</button>`);

                    console.log(queryURL)
                    //destructuring api for cleaner calls
                    let { data, images, fixed_width, fixed_width_still, url } = response;

                    //for loop to append each of the gifs I think a forEach would be much better as it would match any number of calls and will change it to that eventually
                    for (i = 0; i < 30; i++) {
                        $("#gif-dump").prepend(`
                                <img src="${data[i].images.fixed_width.url}" class="img-thumbnail" data-still="${data[i].images.fixed_width_still.url}" data-moving="${data[i].images.fixed_width.url}" alt="...">
                            `)
                    }
                }
                else {
                    alert("We got nothing... Sorry :(")
                }
            })
            //iterating the counter only when it successfully adds a button and prepends gifs
            buttonCounter++
        }
        else {
            //todo make button glow
            alert("Press the button, dummy");
            $("#searchTerm").val('');
        }

    }



})

//allowing click events on dynamically generated html elements
$(document).on("click", ".setSearchButton", function () {

    //pulling the value of the button
    usersSearchTerm = $(this).val();

    //emptying out the current gifs
    $("#gif-dump").html("");

    //query URL template
    let queryURL = `https://api.giphy.com/v1/gifs/search?api_key=${api_Key}&q=${usersSearchTerm}&limit=30&offset=0&rating=G&lang=en`

    //ajax call to GET api data
    $.ajax({ url: queryURL, method: "GET" }).then(response => {

        //destructuring api for cleaner calls
        let { data, images, fixed_width, fixed_width_still, url } = response;


        //for loop to append each of the gifs I think a forEach would be much better as it would match any number of calls and will change it to that eventually
        for (i = 0; i < 30; i++) {
            $("#gif-dump").prepend(`
                    <img src="${data[i].images.fixed_width.url}" class="img-thumbnail" data-still="${data[i].images.fixed_width_still.url}" data-moving="${data[i].images.fixed_width.url}" alt="...">
                `)
        }
    })

})

$(document).on("click", ".img-thumbnail", function () {
    if ($(this).attr("src") == $(this).attr("data-still")) {
        let toggle_play = $(this).attr("data-moving");
        $(this).attr("src", toggle_play);
    }
    else if ($(this).attr("src") == $(this).attr("data-moving")) {
        let toggle_stop = $(this).attr("data-still");
        $(this).attr("src", toggle_stop);
    }
})
