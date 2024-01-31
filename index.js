const express = require('express');
const app = express();
const path = require('path');
const methodOverride = require('method-override')
const bodyParser = require('body-parser');
const User = require('./models/user');
const mongoose = require('mongoose')
const bcrypt = require('bcrypt');
const session = require('express-session');

mongoose.connect('mongodb://127.0.0.1:27017/tripleWalrus')
  .then(() => {
    console.log('Connection Open')
  })
  .catch(err => {
    console.log('error connecting')
    console.log(err)
  })

let tokenValue = User.tokenValue;
// let tokenValue = 100;
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
let userName = null

//utils
const ExpressError = require('./utils/ExpressError')

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({ secret: 'thisIsNotAGoodSecret' }));

//routes
//home/main
app.get('/', async (req, res) => {
  res.render("TripleWalrus", { tokenValue, firstSpin, secondSpin, thirdSpin, lastWin, lastBet, totalWinnins, tempLastWin, tempTotalWinnins, tempTokenValue, hasWon, userName })
  firstSpin = 'Spin';
  secondSpin = 'To';
  thirdSpin = 'Play!';
  tempLastWin = lastWin
  tempTotalWinnins = totalWinnins
  tempTokenValue = tokenValue;
  hasWon = false
})

//functions

//login
async function login(req, res, user) {
  req.session.user_id = user._id
  userName = user.username
}

app.post('/', async (req, res) => {
  if (!req.session.user_id) {
    return res.redirect('/register')
  }
  buyIn = req.body.tokenInput;
  if (!buyIn || buyIn < 1 || buyIn > 5 || Number.isInteger(buyIn)) {
    // Invalid buyIn value check
    return res.redirect('/');
  }
  if (buyIn > tokenValue) {
    return res.send('out of tokens!')
    //make a custom page for when out of tokens
  }
  //get user data
  let userId = req.session.user_id
  let userData = await User.findById({ _id: userId });
  console.log(userData)
  tokenValue = userData.tokenValue - buyIn;
  // run game
  start()
  //update tokenValue, last win and total winnings and save them to the db before redirecting
  //save the new values to the db
  await User.findByIdAndUpdate(
    { _id: userId },
    {
      $set: {
        tokenValue: tokenValue,
        lastWin: lastWin,
        totalWinnins: totalWinnins
      }
    },
    { new: true }, // to return the updated document

  );
  res.redirect('/')
})

app.get('/info', (req, res) => {
  res.render('info')
})

app.get('/register', (req, res) => {
  res.render('register')
})

app.post('/register', async (req, res) => {
  const { password, username, email } = req.body;
  // Check if the username is already in use
  const existingUser = await User.findOne({ username });
  if (existingUser) {
    return res.send('Username already in use. Please choose another.');
  }
  //hashpassword
  const hash = await bcrypt.hash(password, 12);
  //save to db
  const user = new User({
    username,
    password: hash,
    email
  })
  await user.save()
  //login user after registration
  await login(req, res, user)
  res.redirect('/')
})

app.get('/login', (req, res) => {
  res.render('login')
})

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username })
    const validPassword = await bcrypt.compare(password, user.password)
    if (validPassword) {
      await login(req, res, user)
      res.redirect('/')
    } else {
      return res.send('Username or password could not be found')
    }
  } catch {
    return res.send('Username or password could not be found')
  }
})

app.post('/logout', (req, res) => {
  req.session.user_id = null;
  userName = null
  tempLastWin = 0
  tempTotalWinnins = 0
  res.redirect('/login')
})

app.get('/user', async (req, res) => {
  if (!req.session.user_id) {
    return res.redirect('/register')
  }
  let userId = req.session.user_id
  let userData = await User.findById({ _id: userId }); //get user data
  res.render('userDisplay', { user: userData })
  // res.send(userData)
})

app.get('/delete', (req, res) => {
  if (!req.session.user_id) {
    return res.redirect('/register')
  }
  res.render('deletePage')
})

app.post('/deleteConfirm', async (req, res) => {
  // find user id and delete
  const id = req.session.user_id;
  await User.findByIdAndDelete(id)
  req.session.user_id = null;
  userName = null
  res.redirect('/')
})

//for the love of god remove this route before the app is published
app.get('/dumpDb', async (req, res) => {
  try {
    const userData = await User.find({});
    res.send(userData);
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});


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
  1: '~',
  2: '~',
  3: '🍫',
  4: '🍫🍫',
  5: '~',
  6: '🍒',
  7: '~',
  8: '🍫🍫🍫',
  9: '~',
  10: '~',
  11: '🍇',
  12: '~',
  13: '~',
  14: '🍫',
  15: '🍫🍫',
  16: '~',
  17: '~',
  18: '🍒',
  19: '~',
  20: '🍫',
  21: '🍫🍫🍫',
  22: '~',
  23: '🍒',
  24: '~',
  25: '~',
  26: '🦭',
  27: '~',
  28: '~',
  29: '🍫',
  30: '🍫',
  31: '~',
  32: '🍒',
}
const vReel2 = {
  1: '~',
  2: '~',
  3: '🍫',
  4: '~',
  5: '~',
  6: '🍒',
  7: '🍒',
  8: '~',
  9: '~',
  10: '🍫🍫',
  11: '~',
  12: '~',
  13: '🍇',
  14: '~',
  15: '~',
  16: '🍫🍫🍫',
  17: '~',
  18: '🍒',
  19: '~',
  20: '~',
  21: '🍫',
  22: '🍫🍫',
  23: '~',
  24: '🍫🍫🍫',
  25: '~',
  26: '~',
  27: '🍒',
  28: '~',
  29: '🍫',
  30: '~',
  31: '~',
  32: '🦭',
}
const vReel3 = {
  1: '~',
  2: '~',
  3: '🍫',
  4: '~',
  5: '~',
  6: '🍒',
  7: '~',
  8: '~',
  9: '🍫🍫',
  10: '~',
  11: '~',
  12: '🍇',
  13: '~',
  14: '~',
  15: '🍫🍫🍫',
  16: '~',
  17: '~',
  18: '🍒',
  19: '~',
  20: '~',
  21: '🍫',
  22: '~',
  23: '🍫🍫',
  24: '~',
  25: '~',
  26: '🍒',
  27: '~',
  28: '~',
  29: '🍫🍫🍫',
  30: '~',
  31: '~',
  32: '🦭',
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

function spinReels() {
  firstSpin = vReel1[randomNumberGenerator(32)]
  secondSpin = vReel2[randomNumberGenerator(32)]
  thirdSpin = vReel3[randomNumberGenerator(32)]
}

function start() {
  tempTokenValue = tokenValue;
  spinReels()
  isWin(firstSpin, secondSpin, thirdSpin)
}