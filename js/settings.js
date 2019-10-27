var fieldNo = 1;

var groupNo = 0;

var setupDuration = 600;

var demoTimePaused = false;
var demoDuration = 300;
var demoTimeRemaining = 300;
var demoTimeLastPausedAt = 300;

var timeoutTimePaused = false;
var timeoutTimeRemaining = 300;

var goalScored = false;
var score = 0;

var penalty = 0;

updateGamePlay(0);

function saveSettings(){
    fieldNo = parseInt(document.getElementById("fieldNoText").value);

    groupNo = parseInt(document.getElementById("groupNoText").value);

    setupDuration = parseInt(document.getElementById("setupDurationText").value);

    demoDuration = parseInt(document.getElementById("demoDurationText").value);
    demoTimeRemaining = parseInt(document.getElementById("demoDurationText").value);
    demoTimeLastPausedAt = parseInt(document.getElementById("demoDurationText").value);

    timeoutTimeRemaining = parseInt(document.getElementById("timeoutDurationText").value);


    updateGamePlay(1)
}

function updateGamePlay(call_type){
    document.getElementById("demoInfo").innerHTML = "Field " + fieldNo + " | Group " + groupNo + " | ";
    
    document.getElementById("setupTimer").innerHTML = Math.floor(setupDuration/60) + " m " + Math.floor(setupDuration%60) + " s";
    document.getElementById("demoTimer").innerHTML = Math.floor(demoDuration/60) + " m " + Math.floor(demoDuration%60) + " s";
    document.getElementById("timeoutTimer").innerHTML = Math.floor(timeoutTimeRemaining/60) + " m " + Math.floor(timeoutTimeRemaining%60) + " s";

    document.getElementById("score").innerHTML = score;
    document.getElementById("goalList").innerHTML = "";

    document.getElementById("penalty").innerHTML = penalty;
    document.getElementById("penaltyList").innerHTML = "";

    if(call_type == 1){
        document.getElementById("changesReturn").innerHTML = "&nbsp Saved Changes";
        setTimeout(function(){ 
            document.getElementById('nav-gameplay-tab').click();
            document.getElementById("changesReturn").innerHTML = "";
            document.getElementById("groupNoText").value = "";
        }, 1000);
    }

    document.getElementById("goalButton").disabled = true;
    document.getElementById("setupTimerStart").disabled = false;
    document.getElementById("demoTimerPause").disabled = true;
    document.getElementById("demoTimerStart").disabled = true;
    document.getElementById("timeoutTimerPause").disabled = true;
    document.getElementById("timeoutTimerStart").disabled = true;

}

function resetField(){
    demoTimePaused = true;
    timeoutTimePaused = true;
    
    setTimeout(function(){ 
        groupNo = 0;

        setupDuration = 600;

        demoTimePaused = false;
        demoDuration = 300;
        demoTimeRemaining = 300;
        demoTimeLastPausedAt = 300;

        timeoutTimePaused = false;
        timeoutTimeRemaining = 300;

        goalScored = false;
        score = 0;

        penalty = 0;

        updateGamePlay(0);

        vids.forEach(function(url) {
            window.URL.revokeObjectURL(url);
        });
        vids = [];
        recordedVids = 1;
        document.getElementById('accordion').innerHTML = "";
        document.getElementById('recordedVideos').style = "display: none;";
        
        document.getElementById('nav-settings-tab').click();
    }, 200);
}