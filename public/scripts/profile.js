const pastBookingsContainer = document.querySelector(".pastBookings");
const currentBookingsContainer = document.querySelector(".currentBookings");
const reviewSelector = document.getElementById("reviewSelector");
const kitchenReview = document.querySelector(".kitchen-review-form");
import { logOut, isLoggedIn, goToProfile, goToListings } from "./tools.js";
import { api } from "./getapi.js";

if (localStorage.getItem("AIRCNC_CURRENT_USER_ROLE") === '1') {
    window.location.href = "/dashboard";
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

// event listener for form submit
kitchenReview.addEventListener("submit", async (ev) => {
    ev.preventDefault();
    const formData = new FormData(kitchenReview);
    const starRating = formData.get("starRating");
    const comment = document.getElementById("comment").value;
    const cleanRating = formData.get("cleanRating");
    const bookingId = formData.get("reviewSelector");
    const authorId = localStorage.getItem("AIRCNC_CURRENT_USER_ID");
    const bearerToken = localStorage.getItem("AIRCNC_ACCESS_TOKEN");
    const wouldRentAgain = document.getElementById("wouldRentAgain");
    const featureBool = document.getElementById("featureBool");

    try {
        let bookingData = await fetch(`${api}bookings/${bookingId}`, {
            headers: {
                "Content-Type": "application/json"
            }
        });

        if (!bookingData.ok) {
            throw bookingData;
        }

        const { booking } = await bookingData.json();

        const kitchenId = booking.kitchenId;
        const body = {
            cleanRating,
            starRating,
            comment,
            authorId,
            wouldRentAgain: `${wouldRentAgain.checked ? true : false}`,
            featureBool: `${featureBool.checked ? true : false}`
        };
    // res = res.json();


        const res = await fetch(`${api}kitchens/${kitchenId}/reviews`, {
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

        // res = res.json();
    window.location.href = '/profile'
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

// DOMContentLoaded event listener makes fetch call to get bookings and display some form options
document.addEventListener("DOMContentLoaded", async () => {
    isLoggedIn();
    logOut();
    goToListings();

    const userId = localStorage.getItem("AIRCNC_CURRENT_USER_ID")

    //fetch call to get all bookings for a guest
    try {
        const res = await fetch(`${api}users/${userId}/bookings`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem(
                    "AIRCNC_ACCESS_TOKEN"
                )}`,
            },
        });

        if (res.status === 401) {
            window.location.href = "/listings";
            return;
        }

        const { guestBookings } = await res.json();

        const pastBookings = [];
        const currentBookings = [];
        const today = new Date()

        // divides bookings into current and past by comparing to today's date
        guestBookings.forEach(booking => {
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


            // if (isConfirmed) {
            //     confirmation = "Confirmed!";
            // } else {
            //     confirmation = "Cancelled!";
            // }

            return `
            <div class="past-booking-container past-booking${id}">
                <div class="past-booking-image-container">
                    <img class="past-booking-image" src="${imgPath[0]}">
                </div>
                <div class="past-booking-detail">
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
                <div class="current-booking-image-container">
                    <img class="current-booking-image" src="${imgPath[0]}">
                </div>
                <div class="current-booking-detail">
                    <div class="current-booking-kitchen-name"> ${name} </div>
                    <div class="current-booking-kitchen-address"> ${streetAddress} ${city}, ${state} </div>
                    <div class="current-booking-date"> ${startMonth}/${startDay}/${startYear} to ${endMonth}/${endDay}/${endYear} </div>
                    <div class="current-booking-confirmation"> ${confirmation} </div>
                    ${cancelButton}
                </div>
            </div>`;
        });


        // generates options for review-options
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


        //sets innerHTML to generated HTML
        reviewSelector.innerHTML = `<option class="review-option review-option-desc" value="desc"> -- please choose a booking to review -- </option>${reviewOptionsHtml.join("")}`
        pastBookingsContainer.innerHTML = `<div class="past-booking-header"> Past Bookings </div> <div class="past-bookings">${pastBookHtml.join("")}</div>`;
        currentBookingsContainer.innerHTML = `<div class="current-booking-header"> Current Bookings </div> <div class="current-bookings">${currentBookHtml.join("")}</div>`;

    } catch (e) {
        console.error(e);
    }
});
