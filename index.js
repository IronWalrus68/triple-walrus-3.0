const express = require('express');
const app = express();
const path = require('path');
const methodOverride = require('method-override')
const bodyParser = require('body-parser');

let tokenValue = 100;
let buyIn = 1;
let firstSpin = 'Spin';
let secondSpin = 'To';
let thirdSpin = 'Play!';
let lastBet = 1
let lastWin = 0
let totalWinnins = 0
let tempLastWin = lastWin
let tempTokenValue = tokenValue;
let tempTotalWinnins = totalWinnins
let hasWon = false

//utils
const ExpressError = require('./utils/ExpressError')
// const catchAsync = require('../utils/catchAsync')

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

//routes
//home/main
app.get('/', (req, res) => {
    res.render("TripleWalrus", {tokenValue, firstSpin, secondSpin, thirdSpin, lastWin, lastBet, totalWinnins, tempLastWin, tempTotalWinnins, tempTokenValue, hasWon})
firstSpin = 'Spin';
secondSpin = 'To';
thirdSpin = 'Play!';
tempLastWin = lastWin
tempTotalWinnins = totalWinnins
tempTokenValue = tokenValue - buyIn;
hasWon = false
})

app.post('/', (req, res) => {
    buyIn = req.body.tokenInput;
    if (!buyIn || buyIn < 1 || buyIn > 5 || Number.isInteger(buyIn)) {
    console.log('Error: Invalid buyIn value');
    return res.redirect('/');
}
if(buyIn > tokenValue) {
    return res.send('out of tokens!')
}
    tokenValue = tokenValue - buyIn;
    // run game
    start()
    res.redirect('/')
})

//404 
app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})
//error handler
app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Something Went Wrong :(';
    res.status(statusCode).render('error', { err });
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
});

//start of game 
const vReel1 = {
    1:'~',
    2:'~',
    3:'🍫',
    4:'🍫🍫',
    5:'~',
    6:'🍒',
    7:'~',
    8:'🍫🍫🍫',
    9:'~',
    10:'~',
    11:'🍇',
    12:'~',
    13:'~',
    14:'🍫',
    15:'🍫🍫',
    16:'~',
    17:'~',
    18:'🍒',
    19:'~',
    20:'🍫',
    21:'🍫🍫🍫',
    22:'~',
    23:'🍒',
    24:'~',
    25:'~',
    26:'🦭',
    27:'~',
    28:'~',
    29:'🍫',
    30:'🍫',
    31:'~',
    32:'🍒',
}
const vReel2 = {
    1:'~',
    2:'~',
    3:'🍫',
    4:'~',
    5:'~',
    6:'🍒',
    7:'🍒',
    8:'~',
    9:'~',
    10:'🍫🍫',
    11:'~',
    12:'~',
    13:'🍇',
    14:'~',
    15:'~',
    16:'🍫🍫🍫',
    17:'~',
    18:'🍒',
    19:'~',
    20:'~',
    21:'🍫',
    22:'🍫🍫',
    23:'~',
    24:'🍫🍫🍫',
    25:'~',
    26:'~',
    27:'🍒',
    28:'~',
    29:'🍫',
    30:'~',
    31:'~',
    32:'🦭',
}
const vReel3 = {
    1:'~',
    2:'~',
    3:'🍫',
    4:'~',
    5:'~',
    6:'🍒',
    7:'~',
    8:'~',
    9:'🍫🍫',
    10:'~',
    11:'~',
    12:'🍇',
    13:'~',
    14:'~',
    15:'🍫🍫🍫',
    16:'~',
    17:'~',
    18:'🍒',
    19:'~',
    20:'~',
    21:'🍫',
    22:'~',
    23:'🍫🍫',
    24:'~',
    25:'~',
    26:'🍒',
    27:'~',
    28:'~',
    29:'🍫🍫🍫',
    30:'~',
    31:'~',
    32:'🦭',
}

//game logic
function randomNumberGenerator(num) {
    let newNum = Math.floor(Math.random() * num) + 1;
    return newNum;
}

function returnScore(scoreMultiplier) {
 // update the users score and other stats
 tokenValue = buyIn * scoreMultiplier + tokenValue;
 lastWin = buyIn * scoreMultiplier
 lastBet = buyIn
 totalWinnins = buyIn * scoreMultiplier + totalWinnins
 hasWon = true
}

function isWin(firstSpin, secondSpin, thirdSpin) {
    switch (true) {
    case firstSpin === '🦭' && secondSpin === '🦭' && thirdSpin === '🦭':
        returnScore(500);
        break;

    case firstSpin === '🍫🍫🍫' && secondSpin === '🍫🍫🍫' && thirdSpin === '🍫🍫🍫':
      returnScore(40);
      break;

    case (firstSpin === '🍫🍫🍫' && secondSpin === '🍫🍫🍫') || (secondSpin === '🍫🍫🍫' && thirdSpin === '🍫🍫🍫') || (firstSpin === '🍫🍫🍫' && thirdSpin === '🍫🍫🍫'):
      returnScore(20);
      break;

    case firstSpin === '🍫🍫' && secondSpin === '🍫🍫' && thirdSpin === '🍫🍫':
      returnScore(20);
      break;

    case (firstSpin === '🍫🍫' && secondSpin === '🍫🍫') || (secondSpin === '🍫🍫' && thirdSpin === '🍫🍫') || (firstSpin === '🍫🍫' && thirdSpin === '🍫🍫'):
      returnScore(10);
      break;

    case firstSpin === '🍫' && secondSpin === '🍫' && thirdSpin === '🍫':
      returnScore(10);
      break;

    case (firstSpin === '🍫' && secondSpin === '🍫') || (secondSpin === '🍫' && thirdSpin === '🍫') || (firstSpin === '🍫' && thirdSpin === '🍫'):
      returnScore(5);
      break;

    case firstSpin === '🍇' && secondSpin === '🍇' && thirdSpin === '🍇':
      returnScore(6);
      break;

    case (firstSpin === '🍇' && secondSpin === '🍇') || (secondSpin === '🍇' && thirdSpin === '🍇') || (firstSpin === '🍇' && thirdSpin === '🍇'):
      returnScore(4);
      break;

    case firstSpin === '🍇' || secondSpin === '🍇' || thirdSpin === '🍇':
      returnScore(2);
      break;

    case firstSpin === '🍒' && secondSpin === '🍒' && thirdSpin === '🍒':
      returnScore(3);
      break;

    case (firstSpin === '🍒' && secondSpin === '🍒') || (secondSpin === '🍒' && thirdSpin === '🍒') || (firstSpin === '🍒' && thirdSpin === '🍒'):
      returnScore(2);
      break;

    case firstSpin === '🍒' || secondSpin === '🍒' || thirdSpin === '🍒':
      returnScore(1);
      break;
    default:
    return
    }
}

function respin() {
  firstSpin = vReel1[randomNumberGenerator(32)]
  secondSpin = vReel2[randomNumberGenerator(32)]
  thirdSpin = vReel3[randomNumberGenerator(32)]
}

function start() {
    respin()
    isWin(firstSpin, secondSpin, thirdSpin)
}