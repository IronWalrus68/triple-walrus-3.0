const express = require('express');
const app = express();
const path = require('path');
const methodOverride = require('method-override')
const bodyParser = require('body-parser');

let tokenValue = 100;
let buyIn = 1;
let firstSpin = 'Spin';
let SecondSpin = 'To';
let ThirdSpin = 'Play!';
let lastWin = 0
let lastBet = 1
let totalWinnins = 0
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
    res.render("TripleWalrus", {tokenValue, firstSpin, SecondSpin, ThirdSpin, lastWin, lastBet, totalWinnins})
firstSpin = 'Spin';
SecondSpin = 'To';
ThirdSpin = 'Play!';
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
    console.log(`buy in: ${buyIn}`)
    tokenValue = tokenValue - buyIn;
    // run game
    start()
    console.log(`new token value: ${tokenValue}`)
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
const VReel1 = {
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
const VReel2 = {
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
const VReel3 = {
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
 // update the users score
 console.log('Winner!')
 tokenValue = buyIn * scoreMultiplier + tokenValue;
 console.log(`Score after muliplier: ${tokenValue}`)
 lastWin = buyIn * scoreMultiplier
 lastBet = buyIn
 totalWinnins = buyIn * scoreMultiplier + totalWinnins
 hasWon = true
}

function isWin(firstSpin, SecondSpin, ThirdSpin) {
    switch (true) {
    case firstSpin === '🦭' && SecondSpin === '🦭' && ThirdSpin === '🦭':
        returnScore(500);
        break;

    case firstSpin === '🍫🍫🍫' && SecondSpin === '🍫🍫🍫' && ThirdSpin === '🍫🍫🍫':
      returnScore(40);
      break;

    case (firstSpin === '🍫🍫🍫' && SecondSpin === '🍫🍫🍫') || (SecondSpin === '🍫🍫🍫' && ThirdSpin === '🍫🍫🍫') || (firstSpin === '🍫🍫🍫' && ThirdSpin === '🍫🍫🍫'):
      returnScore(20);
      break;

    case firstSpin === '🍫🍫' && SecondSpin === '🍫🍫' && ThirdSpin === '🍫🍫':
      returnScore(20);
      break;

    case (firstSpin === '🍫🍫' && SecondSpin === '🍫🍫') || (SecondSpin === '🍫🍫' && ThirdSpin === '🍫🍫') || (firstSpin === '🍫🍫' && ThirdSpin === '🍫🍫'):
      returnScore(10);
      break;

    case firstSpin === '🍫' && SecondSpin === '🍫' && ThirdSpin === '🍫':
      returnScore(10);
      break;

    case (firstSpin === '🍫' && SecondSpin === '🍫') || (SecondSpin === '🍫' && ThirdSpin === '🍫') || (firstSpin === '🍫' && ThirdSpin === '🍫'):
      returnScore(5);
      break;

    case firstSpin === '🍇' && SecondSpin === '🍇' && ThirdSpin === '🍇':
      returnScore(6);
      break;

    case (firstSpin === '🍇' && SecondSpin === '🍇') || (SecondSpin === '🍇' && ThirdSpin === '🍇') || (firstSpin === '🍇' && ThirdSpin === '🍇'):
      returnScore(4);
      break;

    case firstSpin === '🍇' || SecondSpin === '🍇' || ThirdSpin === '🍇':
      returnScore(2);
      break;

    case firstSpin === '🍒' && SecondSpin === '🍒' && ThirdSpin === '🍒':
      returnScore(3);
      break;

    case (firstSpin === '🍒' && SecondSpin === '🍒') || (SecondSpin === '🍒' && ThirdSpin === '🍒') || (firstSpin === '🍒' && ThirdSpin === '🍒'):
      returnScore(2);
      break;

    case firstSpin === '🍒' || SecondSpin === '🍒' || ThirdSpin === '🍒':
      returnScore(1);
      break;
    default:
    return
    }
}

function respin() {
  firstSpin = VReel1[randomNumberGenerator(32)]
  SecondSpin = VReel2[randomNumberGenerator(32)]
  ThirdSpin = VReel3[randomNumberGenerator(32)]
}

function start() {
    respin()
    console.log(firstSpin)
    console.log(SecondSpin)
    console.log(ThirdSpin)
    isWin(firstSpin, SecondSpin, ThirdSpin)
}