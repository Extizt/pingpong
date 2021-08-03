const p1 = {
    score: 0,
    button: document.querySelector('#p1Button'),
    display: document.querySelector('#p1Display')
}
const p2 = {
    score: 0,
    button: document.querySelector('#p2Button'),
    display: document.querySelector('#p2Display')
}

const winningScoreSelect = document.querySelector('#winningScore');
const resetButton = document.querySelector('#reset');

let winningScore = 3;
let isGameOver = false;
let tieBreakerTo = 3;

winningScoreSelect.addEventListener('change', function () {
    winningScore = parseInt(this.value);
    tieBreakerTo = winningScore;
    reset();
    console.log(winningScoreSelect.selectedOptions[0]);
});

function updateScore(player, opponent) {
    if(!isGameOver) {
        player.display.innerText = `${++player.score}`;
        let scoreDiff = Math.abs(player.score - opponent.score);

        if(player.score === winningScore && scoreDiff >= 2) {
            isGameOver = true;
            player.display.classList.toggle('text-success');
            opponent.display.classList.toggle('text-danger');
            player.button.classList.toggle('disabled');
            opponent.button.classList.toggle('disabled');
        }
        else if(player.score === winningScore && scoreDiff < 2) {
            if(opponent.score != winningScore - 1)
                tieBreakerTo++;
        }
        else if((player.score === (winningScore - 1) && opponent.score === (winningScore - 1))) {
            tieBreakerTo = player.score + 2;
        }
        else if((player.score > winningScore || opponent.score > winningScore) && scoreDiff < 2) {
            if(scoreDiff === 0) {
                if((tieBreakerTo - player.score) === 1)
                    tieBreakerTo += 1;
                else
                    tieBreakerTo++;
            }
            else
                tieBreakerTo = Math.max(player.score, opponent.score) + 1;
        }
        else if((player.score > winningScore || opponent.score > winningScore) && scoreDiff >= 2) {
            isGameOver = true;
            player.display.classList.toggle('text-success');
            opponent.display.classList.toggle('text-danger');
            player.button.classList.toggle('disabled');
            opponent.button.classList.toggle('disabled');
        }
    }

    if(tieBreakerTo != winningScore) {
        winningScoreSelect.selectedOptions[0].innerText = `Tie BREAK to ${tieBreakerTo}`;
        winningScoreSelect.classList.add('bg-danger', 'text-light', 'bold');
    }
}

p1Button.addEventListener('click', () => {
    updateScore(p1, p2);
    if(isGameOver)
        displayWinner();
});
p2Button.addEventListener('click', () => {
    updateScore(p2, p1);
    if(isGameOver)
        displayWinner();
});

resetButton.addEventListener('click', reset);

function reset() {
    for(let p of [p1,p2]) {
        p.score = 0;
        p.display.textContent = 0;
        p.display.classList.remove('text-success', 'text-danger', 'bold');
        p.button.classList.remove('disabled');
    }
    isGameOver = false;
    tieBreakerTo = winningScore;
    winningScoreSelect.classList.remove('bg-danger', 'text-light');
    winningScoreSelect.selectedOptions[0].innerText = winningScoreSelect.selectedOptions[0].value;
}

document.addEventListener('keydown', function(e) {
    if(e.code === "ArrowLeft")
        updateScore(p1, p2);
    if(e.code === "ArrowRight")
        updateScore(p2, p1);
    if(e.code === "Space")
        reset();
});
