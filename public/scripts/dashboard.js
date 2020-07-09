import { logOut, isLoggedIn, createListing, goToDashboard } from "./tools.js";
import { api } from "./getapi.js";
const userId = localStorage.getItem("AIRCNC_CURRENT_USER_ID");
const reviewSelector = document.getElementById("reviewSelector");
const pastBookingsContainer = document.querySelector(".pastBookings");
const currentBookingsContainer = document.querySelector(".currentBookings");
const kitchensContainer = document.querySelector(".kitchens-container");
const welcomeTextDiv = document.querySelector(".welcome-text");
const guestReview = document.querySelector(".guest-review-form");

// redirects users to /profile if they are a guest
if (localStorage.getItem("AIRCNC_CURRENT_USER_ROLE") === 2) {
    window.location.href = "/profile";
}

// event listener for cancel buttons
currentBookingsContainer.addEventListener("click", async () => {
    if ((event.target.value).startsWith("bookings/")) {
        try {
            const res = await fetch(`${api}${event.target.value}`, {
                method: "PATCH",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem(
                        "AIRCNC_ACCESS_TOKEN"
                    )}`,
                    "Content-Type": "application/json",
                },
            });
            // sends user back to profile
            window.location.href = `/profile`;
            return;
        } catch (e) {
            console.error(e);
        }
    }
})

// event listener for review form submit
guestReview.addEventListener("submit", async (ev) => {
    ev.preventDefault();
    const formData = new FormData(guestReview);
    const id = formData.get("reviewSelector");
    const starRating = formData.get("starRating");
    const comment = document.getElementById("comment").value;
    const wouldHostAgain = document.getElementById("wouldHostAgain");
    const bearerToken = localStorage.getItem("AIRCNC_ACCESS_TOKEN");

    try {
        let bookingData = await fetch(`${api}bookings/${id}`, {
            headers: {
                "Content-Type": "application/json"
            }
        });

        if (!bookingData.ok) {
            throw bookingData
        }

        const { booking } = await bookingData.json();

        const body = {
            guestId: booking.renterId,
            starRating,
            comment,
            authorId: localStorage.getItem("AIRCNC_CURRENT_USER_ID"),
            wouldHostAgain: `${wouldHostAgain.checked ? true : false}`
        };

        const res = await fetch(`${api}users/${booking.renterId}/reviews`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${bearerToken}`
            },
            body: JSON.stringify(body)
        });

        if (!res.ok) {
            throw res
        }
        // res = await res.json();
        window.location.href = "/dashboard";
    } catch (err) {
        console.log(err);
        if (err.status >= 400 && err.status < 600) {
          const errorJSON = await err.json();
          const errorsContainer = document.querySelector(".errors-container");
          let errorsHtml = [
            `
              <div class="alert alert-danger">
                  Something went wrong. Please try again.
              </div>
            `,
          ];
          const { errors } = errorJSON;
          if (errors && Array.isArray(errors)) {
            errorsHtml = errors.map(
              (message) => `
                <div class="alert alert-danger">
                    ${message}
                </div>
              `
            );
          }
          errorsContainer.innerHTML = errorsHtml.join("");
        } else {
          alert(
            "Something went wrong. Please check your internet connection and try again!"
          );
        }
      }

});



// DOMContentLoaded event listener makes fetch calls to get a hosts bookings and kitchens
document.addEventListener("DOMContentLoaded", async () => {
    isLoggedIn();
    logOut();
    createListing();
    goToDashboard();
    try {
        // fetch call to get hosts kitchens
        const res = await fetch(`${api}users/${userId}/kitchens`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem(
                    "AIRCNC_ACCESS_TOKEN"
                )}`,
                "Content-Type": "application/json",
            },
        });

        // fetch call to get hosts bookings
        const resII = await fetch(`${api}users/${userId}/kitchens/bookings`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem(
                    "AIRCNC_ACCESS_TOKEN"
                )}`,
            },
        });

        //data returned from fetch calls
        const { kitchens: hostKitchens } = await res.json();
        const { hostBookings } = await resII.json();

        // generate welcome text
        const { user } = hostKitchens[0];
        const { firstName, lastName } = user;
        const welcomeHtml = `${firstName} ${lastName}'s Kitchens and Bookings`

        // generate kitchen details
        const kitchenDetailHtml = hostKitchens.map(({
            imgPath,
            streetAddress,
            name,
            id: kitchenId,
            rate,
            kitchenFeature,
            city: { cityName },
            state: { stateName } }) => {

            let features = "";
            if (kitchenFeature) {
                kitchenFeature.forEach(({ feature }, i) => {
                    if (i === kitchenFeature.length - 1) {
                        features += `${feature.feature}`
                    } else {
                        features += `${feature.feature} •`
                    }
                });
            }
            return `
            <div class="kitchen-container" id="kitchen-${kitchenId}">
                <div class="kitchen-image-container">
                    <img src="${imgPath[0]}">
                </div>
                <div class="kitchen-detail-container">
                    <div class="kitchen-name-and-star-rating">
                        <span class="kitchen-name" > ${name} </span>
                        <span class="kitchen-star-rating" > Star Rating (${Math.floor(Math.random() * (5)) + 1})</span>
                    </div>
                    <div class="kitchen-address"> ${streetAddress}, ${cityName}, ${stateName} </div>
                    <div class="kitchen-detail"> •${features} </div>
                    <div class="kitchen-reviews-and-price">
                        <span class="kitchen-detail-reviews"> ${Math.floor(Math.random() * (100))} people would rent again </span>
                        <span class="kitchen-rate"> $${rate} </span>
                    </div>
                </div>
            </div>
            `
        });

        // divides bookings into current and past by comparing to today's date
        const pastBookings = [];
        const currentBookings = [];
        const today = new Date()

        hostBookings.forEach(booking => {
            if (Date.parse(booking.endDate) > Date.parse(today)) {
                currentBookings.push(booking)
            } else {
                pastBookings.unshift(booking)
            }
        });


        // generates HTML for each past booking
        const pastBookHtml = pastBookings.map(({
            Kitchen: { name, imgPath, streetAddress, city: { cityName: city }, state: { stateName: state } },
            isConfirmed,
            id,
            startDate,
            endDate }) => {

            let confirmation = '';
            const startYear = startDate.substring(0, 4);
            const startMonth = startDate.substring(5, 7);
            const startDay = startDate.substring(8, 10);
            const endYear = endDate.substring(0, 4);
            const endMonth = endDate.substring(5, 7);
            const endDay = endDate.substring(8, 10);


            if (isConfirmed) {
                confirmation = "Confirmed!";
            } else {
                confirmation = "Cancelled!";
            }

            return `
            <div class="past-booking-container past-booking${id}">
                <div class="past-booking-detail mdl-card mdl-shadow--4dp">
                    <div class="past-booking-kitchen-name"> ${name} </div>
                    <div class="past-booking-kitchen-address"> ${streetAddress} ${city}, ${state} </div>
                    <div class="past-booking-date"> ${startMonth}/${startDay}/${startYear} to ${endMonth}/${endDay}/${endYear} </div>
                </div>
            </div>`;
        });

        // generates HTML for each current booking
        const currentBookHtml = currentBookings.map(({
            Kitchen: { name, imgPath, streetAddress, city: { cityName: city }, state: { stateName: state } },
            isConfirmed,
            id,
            startDate,
            endDate }) => {

            let confirmation = '';
            let cancelButton = '';
            const startYear = startDate.substring(0, 4);
            const startMonth = startDate.substring(5, 7);
            const startDay = startDate.substring(8, 10);
            const endYear = endDate.substring(0, 4);
            const endMonth = endDate.substring(5, 7);
            const endDay = endDate.substring(8, 10);

            if (isConfirmed) {
                confirmation = "Confirmed!";
                cancelButton = `<button class="cancel-booking-button" value="bookings/${id}">Cancel</button>`;
            } else {
                confirmation = "Cancelled!";
            }

            return `
            <div class="current-booking-container current-booking${id}">
                <div class="current-booking-detail mdl-card mdl-shadow--4dp">
                    <div class="current-booking-kitchen-name"> ${name} </div>
                    <div class="current-booking-kitchen-address"> ${streetAddress} ${city}, ${state} </div>
                    <div class="current-booking-date"> ${startMonth}/${startDay}/${startYear} to ${endMonth}/${endDay}/${endYear} </div>
                    <div class="current-booking-confirmation"> ${confirmation} </div>
                    ${cancelButton}
                </div>
            </div>`;
        });

        //generates options for review-options
        const reviewOptionsHtml = pastBookings.map(({
            Kitchen: { name },
            isConfirmed,
            startDate,
            id }) => {

            const startYear = startDate.substring(0, 4);
            const startMonth = startDate.substring(5, 7);
            const startDay = startDate.substring(8, 10);

            if (isConfirmed) {
                return `
                <option class="review-option review-option-${id}" value="${id}"> ${name}, on: ${startMonth}/${startDay}/${startYear} </option>
                `
            }
        });

        // setting generated html to innerHTML
        kitchensContainer.innerHTML = `${kitchenDetailHtml.join("")}`;
        reviewSelector.innerHTML = `<option class="review-option review-option-desc" value="desc"> -- please choose a booking to review -- </option>${reviewOptionsHtml.join("")}`
        pastBookingsContainer.innerHTML = `<div class="past-booking-header"> <h3> Past Bookings </h3> </div> <div class="past-bookings">${pastBookHtml.join("")}</div>`;
        currentBookingsContainer.innerHTML = `<div class="current-booking-header"> <h3> Current Bookings </h3> </div> <div class="current-bookings">${currentBookHtml.join("")}</div>`;
        welcomeTextDiv.innerHTML = welcomeHtml;

    } catch (e) {
        console.error(e);
    }
});
