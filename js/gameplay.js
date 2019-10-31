// Load game sounds from files 
var whistle = new Audio('sounds/whistle.wav');
var bell = new Audio('sounds/bell.wav');
var horn = new Audio('sounds/airhorn.wav');

// Custom event to be trigger when demo time is paused
var pauseEvent = new CustomEvent('demoTimePaused');

// onStartSetupTimer()
// Setup Timer
// Loops in each 100 ms (0.1 s)
function onStartSetupTimer(){
    // Disable Start button
    document.getElementById("setupTimerStart").disabled = true;
    elapsed_seconds = 0;

    var x = setInterval(function() {
        elapsed_seconds += 0.1;
        difference = setupDuration - elapsed_seconds;

        var minutes = Math.floor(difference/60);
        var seconds = Math.floor(difference%60);

        document.getElementById("setupTimer").innerHTML = minutes + " m " + seconds + " s";

        // Reset Field stops the timer
        if(setupTimePaused){
            console.log("Setup Time Reset!")
            clearInterval(x);
        }

        // Play sounds and update HTML components
        if (difference < 0) {
            whistle.play();
            clearInterval(x);
            document.getElementById("setupTimer").innerHTML = "Expired";
            document.getElementById("demoTimerStart").disabled = false;
            document.getElementById("timeoutTimerStart").disabled = false;
        }else if (difference > (setupWarning-0.1) && difference < (setupWarning+0.1)) {
            bell.play();
        }
    }, 100);
    console.log("Started Setup Timer!")
}

// onStartDemoTimer()
// Demo Timer
// Loops in each 100 ms (0.1 s)
function onStartDemoTimer(){
    demoTimePaused = false;

    // Update button status 
    document.getElementById("demoTimerStart").disabled = true;
    document.getElementById("demoTimerPause").disabled = false;

    document.getElementById("goalButton").disabled = false;

    var duration = demoTimeRemaining;
    elapsed_seconds = 0;

    var x = setInterval(function() {
        elapsed_seconds += 0.1;
        difference = duration - elapsed_seconds;

        var minutes = Math.floor(difference/60);
        var seconds = Math.floor(difference%60);

        document.getElementById("demoTimer").innerHTML = minutes + " m " + seconds + " s";

        // Demo can be caused by Pause, Goal or Reset Field buttons
        if(demoTimePaused){
            console.log("Demo Paused");
            clearInterval(x);
            // If paused by Goal button save goal information and update score

            if(goalScored){
                var goalTime = demoDuration - difference;
                var goalRate = demoTimeLastPausedAt - difference;
                updateGoalInfo(goalTime, goalRate);
                goalScored = false;
                videoGoal = true;
            }
            demoTimeRemaining = difference;
            demoTimeLastPausedAt = difference;

            // Notify video recorder to stop recording due to a pause in demo time
            window.dispatchEvent(pauseEvent);
        }

        // Play sounds and update HTML components
        if (difference < 0) {
            whistle.play();
            clearInterval(x);
            document.getElementById("demoTimer").innerHTML = "Expired";
            document.getElementById("demoTimerStart").disabled = true;
            document.getElementById("demoTimerPause").disabled = true;
            document.getElementById("timeoutTimerStart").disabled = true;
            document.getElementById("timeoutTimerPause").disabled = true;
            document.getElementById("goalButton").disabled = true;
            window.dispatchEvent(pauseEvent);
        }else if (difference > (demoWarning-0.1) && difference < (demoWarning+0.1)) {
            console.log(difference)
            bell.play();
        }
    }, 100);
    console.log("Started Demo Timer!")
}

// onPauseDemoTimer()
// Pause button activates this function
// Updates demoTimePaused variable and updates HTML componenets 
function onPauseDemoTimer(){
    demoTimePaused = true;
    document.getElementById("demoTimerPause").disabled = true;
    document.getElementById("demoTimerStart").disabled = false;
    document.getElementById("goalButton").disabled = true;
}

// onStartTimeoutTimer()
// Timeout Timer
// Loops in each 100 ms (0.1s)
function onStartTimeoutTimer(){
    timeoutTimePaused = false;

    // Update button status
    document.getElementById("timeoutTimerStart").disabled = true;
    document.getElementById("timeoutTimerPause").disabled = false;

    var duration = timeoutTimeRemaining;
    elapsed_seconds = 0;

    var x = setInterval(function() {
        elapsed_seconds += 0.1;
        difference = duration - elapsed_seconds;

        var minutes = Math.floor(difference/60);
        var seconds = Math.floor(difference%60);

        document.getElementById("timeoutTimer").innerHTML = minutes + " m " + seconds + " s";

        // Timeout time can be paused by Pause and Reset Field buttons
        if(timeoutTimePaused){
            clearInterval(x);
            timeoutTimeRemaining = difference;
        }

        // Play sounds and update HTML components
        if (difference < 0) {
            horn.play();
            clearInterval(x);
            document.getElementById("timeoutTimer").innerHTML = "Expired";
            document.getElementById("timeoutTimerStart").disabled = true;
            document.getElementById("timeoutTimerPause").disabled = true;
        }else if (difference > (timeoutWarning-0.1) && difference < (timeoutWarning+0.1)) {
            bell.play();
        }
    }, 100);
    console.log("Started Timeout Timer!")
}

// onPauseTimeoutTimer()
// Pause button activates this function
// Updates timeoutTimePaused variable and updates HTML componenets 
function onPauseTimeoutTimer(){
    timeoutTimePaused = true;
    document.getElementById("timeoutTimerPause").disabled = true;
    document.getElementById("timeoutTimerStart").disabled = false;
}

// onGoal()
// Goal button activates this function
// Updates demoTimePaused, goalScored variables and updates HTML componenets 
function onGoal(){
    demoTimePaused = true;
    goalScored = true;
    document.getElementById("goalButton").disabled = true;
    document.getElementById("demoTimerPause").disabled = true;
    document.getElementById("demoTimerStart").disabled = false;
}

// updateGoalInfo()
// Displays goal time and rate 
function updateGoalInfo(goalTime, goalRate){
    score += 1; 
    document.getElementById("score").innerHTML = score;

    var goals = document.getElementById("goalList")
    const goal = document.createElement('li');
    goal.innerHTML = "<strong>"+"Goal "+score+"</strong>";

    const goaltime = document.createElement('ul');

    const goalts = document.createElement('li');
    goalts.innerHTML = "Scored @ "+ Math.floor(goalTime/60) + " m " + Math.floor(goalTime%60) + " s";
    goalts.innerHTML += " | Rate: " + Math.floor(goalRate/60) + " m " + Math.floor(goalRate%60) + " s";
    goaltime.appendChild(goalts);

    goals.appendChild(goal);
    goals.appendChild(goaltime);
}

// updatePenaltyInfo()
// Displays penalty info
function updatePenaltyInfo(penaltyType){
    var penalties = document.getElementById("penaltyList")
    const penaltyItem = document.createElement('li');
    
    if(penaltyType == 0){
        penalty += 1;
        penaltyItem.innerHTML = "<strong>Ball Holding</strong>";
    }else if(penaltyType == 1){
        penalty += 0.5;
        penaltyItem.innerHTML = "<strong>Minor Collision</strong>";
    }else if(penaltyType == 2){
        penalty += 1;
        penaltyItem.innerHTML = "<strong>Major Collision</strong>";
    }

    document.getElementById("penalty").innerHTML = penalty;
    penalties.appendChild(penaltyItem);
}