const express = require('express');
const app = express();
const path = require('path');
const methodOverride = require('method-override')
const bodyParser = require('body-parser');

let tokenValue = 100;
let buyIn = 1;

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
    let data = { tokens: tokenValue}
    res.render("TripleWalrus", {data:data})
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
    3:'1bar',
    4:'2bar',
    5:'~',
    6:'Cherry',
    7:'~',
    8:'3bar',
    9:'~',
    10:'~',
    11:'Grape',
    12:'~',
    13:'~',
    14:'1bar',
    15:'2bar',
    16:'~',
    17:'~',
    18:'Cherry',
    19:'~',
    20:'1bar',
    21:'3bar',
    22:'~',
    23:'Cherry',
    24:'~',
    25:'~',
    26:'Walrus',
    27:'~',
    28:'~',
    29:'1bar',
    30:'1bar',
    31:'~',
    32:'Cherry',
}
const VReel2 = {
    1:'~',
    2:'~',
    3:'1bar',
    4:'~',
    5:'~',
    6:'Cherry',
    7:'Cherry',
    8:'~',
    9:'~',
    10:'2bar',
    11:'~',
    12:'~',
    13:'Grape',
    14:'~',
    15:'~',
    16:'3bar',
    17:'~',
    18:'Cherry',
    19:'~',
    20:'~',
    21:'1bar',
    22:'2bar',
    23:'~',
    24:'3bar',
    25:'~',
    26:'~',
    27:'Cherry',
    28:'~',
    29:'1bar',
    30:'~',
    31:'~',
    32:'Walrus',
}
const VReel3 = {
    1:'~',
    2:'~',
    3:'1bar',
    4:'~',
    5:'~',
    6:'Cherry',
    7:'~',
    8:'~',
    9:'2bar',
    10:'~',
    11:'~',
    12:'Grape',
    13:'~',
    14:'~',
    15:'3bar',
    16:'~',
    17:'~',
    18:'Cherry',
    19:'~',
    20:'~',
    21:'1bar',
    22:'~',
    23:'2bar',
    24:'~',
    25:'~',
    26:'Cherry',
    27:'~',
    28:'~',
    29:'3bar',
    30:'~',
    31:'~',
    32:'Walrus',
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
}

function isWin(firstSpin, SecondSpin, ThirdSpin) {
    switch (true) {
    case firstSpin === 'Walrus' && SecondSpin === 'Walrus' && ThirdSpin === 'Walrus':
        returnScore(500);
        break;

    case firstSpin === '3bar' && SecondSpin === '3bar' && ThirdSpin === '3bar':
      returnScore(40);
      break;

    case (firstSpin === '3bar' && SecondSpin === '3bar') || (SecondSpin === '3bar' && ThirdSpin === '3bar') || (firstSpin === '3bar' && ThirdSpin === '3bar'):
      returnScore(20);
      break;

    case firstSpin === '2bar' && SecondSpin === '2bar' && ThirdSpin === '2bar':
      returnScore(20);
      break;

    case (firstSpin === '2bar' && SecondSpin === '2bar') || (SecondSpin === '2bar' && ThirdSpin === '2bar') || (firstSpin === '2bar' && ThirdSpin === '2bar'):
      returnScore(10);
      break;

    case firstSpin === '1bar' && SecondSpin === '1bar' && ThirdSpin === '1bar':
      returnScore(10);
      break;

    case (firstSpin === '1bar' && SecondSpin === '1bar') || (SecondSpin === '1bar' && ThirdSpin === '1bar') || (firstSpin === '1bar' && ThirdSpin === '1bar'):
      returnScore(5);
      break;

    case firstSpin === 'Grape' && SecondSpin === 'Grape' && ThirdSpin === 'Grape':
      returnScore(6);
      break;

    case (firstSpin === 'Grape' && SecondSpin === 'Grape') || (SecondSpin === 'Grape' && ThirdSpin === 'Grape') || (firstSpin === 'Grape' && ThirdSpin === 'Grape'):
      returnScore(4);
      break;

    case firstSpin === 'Grape' || SecondSpin === 'Grape' || ThirdSpin === 'Grape':
      returnScore(2);
      break;

    case firstSpin === 'Cherry' && SecondSpin === 'Cherry' && ThirdSpin === 'Cherry':
      returnScore(3);
      break;

    case (firstSpin === 'Cherry' && SecondSpin === 'Cherry') || (SecondSpin === 'Cherry' && ThirdSpin === 'Cherry') || (firstSpin === 'Cherry' && ThirdSpin === 'Cherry'):
      returnScore(2);
      break;

    case firstSpin === 'Cherry' || SecondSpin === 'Cherry' || ThirdSpin === 'Cherry':
      returnScore(1);
      break;
    default:
    return
    }
}
    let firstSpin = VReel1[randomNumberGenerator(32)]
    let SecondSpin = VReel2[randomNumberGenerator(32)]
    let ThirdSpin = VReel3[randomNumberGenerator(32)]

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