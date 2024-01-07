const express = require('express');
const app = express();
const path = require('path');
const methodOverride = require('method-override')

//utils
const ExpressError = require('./utils/ExpressError')
// const catchAsync = require('../utils/catchAsync')

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true}));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

//routes
//home/main
app.get('/', (req, res) => {
    res.render("TripleWalrus")
})
//404 
app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})
//error handler
app.use((err, req, res, next) => {
    const {statusCode = 500 } = err;
    if(!err.message) err.message = 'Something Went Wrong :(';
    res.status(statusCode).render('error', {err});
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
});