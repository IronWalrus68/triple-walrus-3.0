
document.addEventListener('DOMContentLoaded', function () {
    let spinButton = document.getElementById('spinButton');
    let lastWinDiv = document.getElementById("lastWin");
    let totalWinninsDiv = document.getElementById("totalWinnins");
    let tokensDiv = document.getElementById("tokens");
    let reelHoldsterDiv = document.getElementById("reelHoldster");

    setTimeout(function () {
        spinButton.removeAttribute('disabled');
        lastWinDiv.textContent = lastWin;
        totalWinninsDiv.textContent = totalWinnins;
        tokensDiv.textContent = tokenValue;
        console.log(hasWon)
        if (hasWon == 'true') {
        console.log('animation is running')
            // if (hasWon ) {
            reelHoldsterDiv.style.border = '10px dotted yellow';
            setTimeout(function () {
                reelHoldsterDiv.style.border = '10px solid black';
            }, 500);
            setTimeout(function () {
                reelHoldsterDiv.style.border = '10px dotted red';
            }, 1000);
            setTimeout(function () {
                reelHoldsterDiv.style.border = '10px solid black';
            }, 1500);
            setTimeout(function () {
                reelHoldsterDiv.style.border = '10px dotted yellow';
            }, 2000);
            setTimeout(function () {
                reelHoldsterDiv.style.border = '10px solid black';
            }, 2500);
        }
    }, 5000);
});
