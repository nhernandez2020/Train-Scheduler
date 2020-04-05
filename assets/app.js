window.onload = function () {
    var frequency;
    var minutesAway;
    var nextArrival;
    var first;
    var name;
    var dest;
    var counter = 0;

    // Your web app's Firebase configuration
    var firebaseConfig = {
            apiKey: "AIzaSyCSRRh1c8X7zwZaW-zCq6Hi_wMKBtYSyOk",
            authDomain: "train-scheduler-fa9f2.firebaseapp.com",
            databaseURL: "https://train-scheduler-fa9f2.firebaseio.com",
            projectId: "train-scheduler-fa9f2",
            storageBucket: "train-scheduler-fa9f2.appspot.com",
            messagingSenderId: "313125405669",
            appId: "1:313125405669:web:cdeaa1a035f3b79e25a50c",
            measurementId: "G-0R2G2NDJHE"
    };
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);

    // setting database to a variable
    const db = firebase.database().ref();

    // grabbing variables from database
    db.on("value", function (snapshot) {
        //using an if statement to stop initial submit from posting twice
        if (counter < 1) {
            //appending variables from database
            $("#body").append("<tr><td>" + snapshot.val().name + "</td><td>" + snapshot.val().dest + "</td><td>" + snapshot.val().frequency + "</td><td>" + snapshot.val().nextArrival + "</td><td>" + snapshot.val().minutesAway + "</td></tr>");
            counter += 1;
        }
    })

    // when clicking submit button
    $("#submit").on("click", function (event) {
        //setting variables from values obtained
        first = $("#first").val();
        name = $("#trainName").val();
        dest = $("#destination").val();
        frequency = $("#frequency").val();

        //calling function to compute times
        time();

        //sending variables to database
        db.set({
            name: name,
            dest: dest,
            frequency: frequency,
            nextArrival: nextArrival,
            minutesAway: minutesAway
        });

        //adding new row to table
        $("#body").append("<tr><td>" + name + "</td><td>" + dest + "</td><td>" + frequency + "</td><td>" + nextArrival + "</td><td>" + minutesAway + "</td></tr>")

    });

    // function to calculate nextArrival & minutesAway
    function time() {
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
    };

};