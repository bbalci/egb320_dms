var whistle = new Audio('sounds/whistle.wav');
var bell = new Audio('sounds/bell.wav');
var horn = new Audio('sounds/airhorn.wav');

var pauseEvent = new CustomEvent('demoTimePaused');

function onStartSetupTimer(){
    document.getElementById("setupTimerStart").disabled = true;
    elapsed_seconds = 0;

    var x = setInterval(function() {
        elapsed_seconds += 0.1;
        difference = setupDuration - elapsed_seconds;

        var minutes = Math.floor(difference/60);
        var seconds = Math.floor(difference%60);

        document.getElementById("setupTimer").innerHTML = minutes + " m " + seconds + " s";

        if(setupTimePaused){
            console.log("Setup Time Reset!")
            clearInterval(x);
        }

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

function onStartDemoTimer(){
    demoTimePaused = false;

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

        if(demoTimePaused){
            console.log("Demo Paused");
            clearInterval(x);
            if(goalScored){
                var goalTime = demoDuration - difference;
                var goalRate = demoTimeLastPausedAt - difference;
                updateGoalInfo(goalTime, goalRate);
                goalScored = false;
                videoGoal = true;
            }
            demoTimeRemaining = difference;
            demoTimeLastPausedAt = difference;
            window.dispatchEvent(pauseEvent);
        }

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

function onPauseDemoTimer(){
    demoTimePaused = true;
    document.getElementById("demoTimerPause").disabled = true;
    document.getElementById("demoTimerStart").disabled = false;
    document.getElementById("goalButton").disabled = true;
}

function onStartTimeoutTimer(){
    timeoutTimePaused = false;

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

        if(timeoutTimePaused){
            clearInterval(x);
            timeoutTimeRemaining = difference;
        }

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

function onPauseTimeoutTimer(){
    timeoutTimePaused = true;
    document.getElementById("timeoutTimerPause").disabled = true;
    document.getElementById("timeoutTimerStart").disabled = false;
}

function onGoal(){
    demoTimePaused = true;
    goalScored = true;
    document.getElementById("goalButton").disabled = true;
    document.getElementById("demoTimerPause").disabled = true;
    document.getElementById("demoTimerStart").disabled = false;
}

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