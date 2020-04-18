// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyCQ-cBA316wDMdVkGKYl22dlP8d7iVdK-g",
    authDomain: "train-db66b.firebaseapp.com",
    databaseURL: "https://train-db66b.firebaseio.com",
    projectId: "train-db66b",
    storageBucket: "train-db66b.appspot.com",
    messagingSenderId: "741844955892",
    appId: "1:741844955892:web:f95d2206186215430064a1"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
console.log(firebaseConfig, firebase)

// setting database to a variable
var db = firebase.database().ref();


window.onload = function () {
    var frequency;
    var minutesAway;
    var nextArrival;
    var first;
    var name;
    var dest;
    var counter = 0;


  

    // grabbing variables from database
    db.on("child_added", function (snapshot) {
        //using an if statement to stop initial submit from posting twice
        console.log(snapshot.val())
        let train=calculateTrain(snapshot.val().first)
        // if (counter < 1) {
            //appending variables from database
            $("#body").append("<tr><td>" + snapshot.val().name + "</td><td>" + snapshot.val().dest + "</td><td>" + snapshot.val().frequency + "</td><td>" + train.nextArrival + "</td><td>" + train.minutesAway + "</td></tr>");

        // }
    })

    // when clicking submit button
    $("#submit").on("click", function (event) {
        //setting variables from values obtained
        first = $("#first").val();
        name = $("#trainName").val();
        dest = $("#destination").val();
        frequency = $("#frequency").val();

        //calling function to compute times
        // time();

        //sending variables to database
        db.push({
            name: name,
            dest: dest,
            frequency: frequency,
          
           firstArival : first
        });
        console.log({
            name: name,
            dest: dest,
            frequency: frequency,

            firstArival: first
        })
        $("#trainName").val("")
        $("#destination").val("")
        $("#first").val("")
        $("#fequency").val("")
    
        //adding new row to table
        // $("#body").append("<tr><td>" + name + "</td><td>" + dest + "</td><td>" + frequency + "</td><td>" + nextArrival + "</td><td>" + minutesAway + "</td></tr>")

    });

    // function to calculate nextArrival & minutesAway
    function calculateTrain(first) {
        // First Time (pushed back 1 year to make sure it comes before current time)
        var firstTimeConverted = moment(first, "HH:mm").subtract(1, "years");

        // Difference between the times
        var diffTime = moment().diff(moment(firstTimeConverted), "minutes");

        // Time apart set to a positive number(remainder)
        var remainder = diffTime % frequency;

        // Minute Until Train
        minutesAway = frequency - remainder;

        // Next Train
        var nextTrain = moment().add(minutesAway, "minutes");
        nextArrival = moment(nextTrain).format("hh:mm");
        return({nextArrival:nextArrival,minutesAway:minutesAway})
    };

};