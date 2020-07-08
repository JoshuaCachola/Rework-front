const express = require("express");
const path = require("path");
const app = express();
require("dotenv").config()
const { api, port } = require("./config");


app.set("view engine", "pug");
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    res.locals.api = api;
    next();
})


app.get('/', (req, res) => {
    // console.log(api)
    res.render('home')
});

app.get('/listings', (req, res) => {
    res.render('listingMain');
});

app.get('/listings/create', (req, res) => {
    res.render('createKitchen');
});

app.get('/profile', (req, res) => {
    res.render('profile');
});

app.get('/dashboard', (req, res) => {
    res.render('dashboard');
});

app.get('/bookings/(:id(\\d+))', (req, res) => {
    res.render('bookings');
});

app.get('/signup', (req, res) => {
    res.render('sign-up');
});
/*******************************************
 *  Route '/kitchen/:id'
 *      GET endpoint
 *          - renders kitchen details page
 *          - API call to GET '/kitchen/:id'
 *******************************************/
app.get('/listings/:id(\\d+)', (req, res) => {
    res.cookie("kitchenId", req.params.id);
    res.render('kitchen-details');
});

app.get('/bookings/:id(\\d+)/guestReview', (req, res) => {
    res.cookie("id", req.params.id);
    res.render('guest-review');
});

app.get('/bookings/:id(\\d+)/kitchenReview', (req, res) => {
    res.cookie("bookingId", req.params.id);
    res.render('kitchen-review')
});

app.get('/bookings/:id(\\d+)', (req, res) => {
    // localStorage.setItem("AIRCNC_CURRENT_BOOKING", req.params.id)
    res.render('bookings')
});

app.get('/listings/:id(\\d+)/checkout', (req, res) => {
    res.render('listing-checkout')
});

app.listen(port, () => console.log(`Listening on port ${port}...`));
