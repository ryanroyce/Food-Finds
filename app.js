$(document).ready(function () {
   
    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyDECKdlUUwWo_jL0z_teQaPLBcSiwqRcIs",
        authDomain: "food-project-4b9c6.firebaseapp.com",
        databaseURL: "https://food-project-4b9c6.firebaseio.com",
        projectId: "food-project-4b9c6",
        storageBucket: "food-project-4b9c6.appspot.com",
        messagingSenderId: "103528475709"
    };

    firebase.initializeApp(config);

    //Firebase database declaration
    var database = firebase.database();

    $("#modal").modal("show");

    //code for pop up modal
    //capture the button click
    $("#submit").on("click", function (event) {
        event.preventDefault();

        // grabs input
        var orangeFormname = $("#orangeForm-name").val().trim();
        var orangeFormemail = $("#orangeForm-email").val().trim();

        var newUser = {
            name: orangeFormname,
            email: orangeFormemail
        };

        // uploads user data to the database
        database.ref().push(newUser);

        // clears all of the text-boxes
        $("#orangeForm-name").val("");
        $("#orangeForm-email").val("");
    });

    // create firbase event for adding user to the database
    database.ref().on("child_added", function (childSnapshot) {
        orangeFormname = childSnapshot.val().name;
        orangeFormemail = childSnapshot.val().email;
    });

    //On Click event on the FindFood button.
    //The click on this button will trigger the search  
    $("#findFood").on("click", function () {
        event.preventDefault();

        //Call the reset function to empty the Div
        reset();

        //the search value enterd by the user
        var searchTerms = $("#food-input").val();

        //Control the value entered by the user
        //The value entered should be a string
        if (searchTerms == "") {
            //No value entered
            //A modal with a message is shown
            $("#wrongValueModal").modal("show");
        } else if (Number(searchTerms)) {
            //A number is entered
            //A modal with a message is shown
            $("#wrongValueModal").modal("show");

            //The input box is emptied
            $("#food-input").val("");

        } else {//ADD A CONTROL TO MAKE SURE IT'S A STRING 

            $('#p').text(searchTerms); // text function takes value as parameter

            //Function to get the recipes (5) from the API and display them in the Div
            function GetRecipe() {
                var search = searchTerms;
                var firstNum = 0;
                var secondNum = 6;
                var appid = "ec426dec";
                var appkey = "93ae402db25814afafd557b63c007d31";
                var queryURL = "https://api.edamam.com/search?q=" + search + "&from=" + firstNum + "&to=" + secondNum + "&app_id=" + appid + "&app_key=" + appkey;

                $.ajax({
                    url: queryURL,
                    method: "GET",
                }).then(function (response) {
                    //The 5 recipes that we will display are stocked in a variable arrar
                    var foods = response.hits;
                    for (var i = 0; i < foods.length; i++) {
                        var recipeTest = response.hits[i].recipe.label;//Title of the recipe
                        var recipeingredientLines = response.hits[i].recipe.ingredientLines;//Recipe ingredients
                        var recipeImage = response.hits[i].recipe.image;//Recipe image
                        var recipeLink = response.hits[i].recipe.url;

                        var imageDiv = $("<div class='imageDisplay'>");//We create a new div to display the recipe image
                        var pRecipeTitle = $("<h2>").text(recipeTest);
                        var pRecipeIngredients = $("<p>").text(recipeingredientLines);
                        //var hRecipeLink = $("<h>").text("Preparation");
                        var hRecipeLink = "Preparation";
                        var image = $("<img>");//New image to store the recipe image
                        image.attr("src", recipeImage);

                        //Append the recipes informations in the newly created div
                        imageDiv.append(pRecipeTitle);
                        imageDiv.append(image);
                        imageDiv.append(pRecipeIngredients);
                        imageDiv.append(hRecipeLink.link(recipeLink));

                        //Display the recipes in the div
                        $("#foodPlace").append(imageDiv);
                        //$("#foodPlace").append( `<div><img src =${recipeImage}</img></div><div> <h2>${recipeTest}</h2> <p>${recipeingredientLines}</p><div>`);
                    };
                });
            };
            GetRecipe();
        };
    });

    //Function to reset the information displayed in the recipe holder
    function reset() {
        $("#foodPlace").empty();
        $("#recipeHolder").empty();
    };

    // this is the function that is going to display a fun cooking word
    function GetFoodWord() {
        // storing all our words in an array
        var foodWords = ["al dente", "bisque", "canape", "flambe", "fricassee", "hors d'oeuvres", "julienne", "meuniere", "roux"];
        // creating a variable that will randomly pick a word (eventually to be incorporated in an onclick function)
        var randomItem = foodWords[Math.floor(Math.random() * foodWords.length)];
        var apiKey = "?key=afc7c827-8f7f-4a2e-9e2d-fe20474a337b";
        var queryURL = "https://www.dictionaryapi.com/api/v3/references/collegiate/json/" + randomItem + apiKey;

        // ajax call to the API
        $.ajax({
            url: queryURL,
            method: "GET",
        }).then(function (response) {
            // storing the words and definitions in variables
            var wordFromDictionary = response[0].hwi.hw;
            var definition = response[0].shortdef[0];

            // appends the foodWords div to display the word and definition
            $("#foodWords").html(`<div> <h2 id = "headword"> ${wordFromDictionary}</h2></div> <div> <p id ="definition"> ${definition}</p> </div>`);
        });
    };

    GetFoodWord();
    // telling the GetFoodWord function to run every 7 seconds
    setInterval(GetFoodWord, 7000);
});
