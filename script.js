document.addEventListener("DOMContentLoaded", function () {
    
    const scheduleSection = document.getElementById("schedule-section");
    const historySection = document.getElementById("history-section");
    const predictorSection = document.getElementById("predictor-section");
    const matchScheduledMessage = document.getElementById("match-scheduled-message");


    const showSchedulerButton = document.getElementById("show-scheduler");
    const showHistoryButton = document.getElementById("show-history");
    const showPredictorButton = document.getElementById("show-predictor");


    const matchForm = document.getElementById("match-form");
    const predictForm = document.getElementById("predict-form");
    const matchDetails = document.getElementById("match-details");
    const matchHistory = document.getElementById("match-history");
    const predictionResult = document.getElementById("prediction-result");
    const predictionDetails = document.getElementById("prediction-details");


    showSchedulerButton.addEventListener("click", () => displaySection(scheduleSection));
    showHistoryButton.addEventListener("click", () => {
        displaySection(historySection);
        loadMatchHistory();
    });
    showPredictorButton.addEventListener("click", () => displaySection(predictorSection));

    
    matchForm.addEventListener("submit", function (event) {
        event.preventDefault();
        scheduleMatch();
    });

    predictForm.addEventListener("submit", function (event) {
        event.preventDefault();
        predictMatchWinner();
    });


    document.getElementById("predict-again").addEventListener("click", resetPredictionForm);


    function displaySection(section) {
        [scheduleSection, historySection, predictorSection].forEach(sec => sec.classList.add("hidden"));
        section.classList.remove("hidden");
    }

    
    function scheduleMatch() {
        const team1 = document.getElementById("team1").value.trim();
        const captain1 = document.getElementById("captain1").value.trim();
        const team2 = document.getElementById("team2").value.trim();
        const captain2 = document.getElementById("captain2").value.trim();
        const matchDate = document.getElementById("match-date").value;
        const matchTime = document.getElementById("match-time").value;
        const venue = document.getElementById("venue").value.trim();

        const matchInfo = { team1, captain1, team2, captain2, matchDate, matchTime, venue };
        saveMatchToHistory(matchInfo);
        displayMatchDetails(matchInfo);
        matchForm.reset();
    }

    
    function saveMatchToHistory(matchInfo) {
        const history = JSON.parse(localStorage.getItem("matchHistory")) || [];
        history.push(matchInfo);
        localStorage.setItem("matchHistory", JSON.stringify(history));
    }

    
    function loadMatchHistory() {
        matchHistory.innerHTML = "";
        const history = JSON.parse(localStorage.getItem("matchHistory")) || [];
        if (history.length === 0) {
            matchHistory.innerHTML = "<li>No match history available.</li>";
        } else {
            history.forEach((match, index) => {
                const listItem = document.createElement("li");
                listItem.innerHTML = `
                    <strong>Match ${index + 1}:</strong> ${match.team1} vs ${match.team2} on ${match.matchDate} at ${match.matchTime}, Venue: ${match.venue}
                    <button class="delete-button" data-index="${index}">Delete</button>
                `;
                listItem.querySelector(".delete-button").addEventListener("click", () => deleteHistory(index));
                matchHistory.appendChild(listItem);
            });
        }
    }

    
    function deleteHistory(index) {
        const history = JSON.parse(localStorage.getItem("matchHistory")) || [];
        history.splice(index, 1);
        localStorage.setItem("matchHistory", JSON.stringify(history));
        loadMatchHistory();
    }


    function displayMatchDetails(matchInfo) {
        matchDetails.innerHTML = `
            <strong>${matchInfo.team1}</strong> (Captain: ${matchInfo.captain1}) vs <strong>${matchInfo.team2}</strong> (Captain: ${matchInfo.captain2})<br>
            Date: ${matchInfo.matchDate}<br>
            Time: ${matchInfo.matchTime}<br>
            Venue: ${matchInfo.venue}
        `;
        showMatchScheduledMessage();
    }


    function showMatchScheduledMessage() {
        matchScheduledMessage.classList.remove("hidden");
        document.getElementById("schedule-again").addEventListener("click", function () {
            matchScheduledMessage.classList.add("hidden");
            scheduleSection.classList.remove("hidden");
        });
    }

    
    function predictMatchWinner() {
        const team1 = document.getElementById("team1-name").value.trim();
        const team2 = document.getElementById("team2-name").value.trim();
        const targetScore = parseInt(document.getElementById("target-score").value.trim());
        const currentScore = parseInt(document.getElementById("current-score").value.trim());
        const wicketsFallen = parseInt(document.getElementById("wickets-fallen").value.trim());
        const remainingOvers = parseInt(document.getElementById("remaining-overs").value.trim());
        const venue = document.getElementById("venue").value.trim();

        const team1WinProbability = calculateWinProbability(currentScore, targetScore, wicketsFallen, remainingOvers);
        const team2WinProbability = 100 - team1WinProbability;

        predictionDetails.innerHTML = `
            At ${venue}, with a target of ${targetScore} runs:<br>
            - ${team1} has a ${team1WinProbability.toFixed(2)}% chance of winning.<br>
            - ${team2} has a ${team2WinProbability.toFixed(2)}% chance of winning.
        `;

        predictForm.classList.add("hidden");
        predictionResult.classList.remove("hidden");
    }

    
    function calculateWinProbability(currentScore, targetScore, wicketsFallen, remainingOvers) {
        if (remainingOvers <= 0 || targetScore <= 0) {
            return 0;
        }

        const requiredRunRate = (targetScore - currentScore) / remainingOvers;
        const currentRunRate = currentScore / (50 - remainingOvers);
        const runRateFactor = currentRunRate / requiredRunRate;
        const wicketsFactor = (10 - wicketsFallen) / 10;

        const winProbability = (runRateFactor * 0.7 + wicketsFactor * 0.3) * 100;
        return Math.min(Math.max(winProbability, 0), 100);
    }

    
    function resetPredictionForm() {
        predictionDetails.innerHTML = "";
        predictionResult.classList.add("hidden");
        predictForm.classList.remove("hidden");
        predictForm.reset();
    }
});
