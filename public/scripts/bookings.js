const url = window.location.pathname;
const bookingId = url.substring(url.lastIndexOf('/') + 1);

if (localStorage.getItem("AIRCNC_ACCESS_TOKEN") === null) {
    window.location.href = "/";
}

// cancels booking when DOMContentLoaded
document.addEventListener("DOMContentLoaded", async () => {

    try {
        const res = await fetch(`http://localhost:8080/bookings/${bookingId}`, {
            method: "PATCH",
            headers: {
                Authorization: `Bearer ${localStorage.getItem(
                    "AIRCNC_ACCESS_TOKEN"
                )}`,
                "Content-Type": "application/json",
            },
        });
        window.location.href = `/bookings/${bookingId}`;
        return;
    } catch (e) {
        console.error(e);
    }
})

// review booking event listener
reviewButton.addEventListener("click", () => {
    // event.preventDefault()
    if (localStorage.getItem("AIRCNC_CURRENT_USER_ROLE") === "1") {
        window.location.href = `/bookings/${bookingId}/guestReview`;
        return;
    } else if (localStorage.getItem("AIRCNC_CURRENT_USER_ROLE") === "2") {
        window.location.href = `/bookings/${bookingId}/kitchenReview`;
        return;
    }

})

// DOMContentLoaded event listener, makes fetch call to GET bookings/:id from backend to display booking details
document.addEventListener("DOMContentLoaded", async () => {
    try {
        const res = await fetch(`http://localhost:8080/bookings/${bookingId}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem(
                    "AIRCNC_ACCESS_TOKEN"
                )}`,
            },
        });

        // this gets a booking from the backend, and sends the user back to /profile if the booking doesn't exist
        const { booking } = await res.json();
        if (!booking) {
            window.location.href = "/profile";
            return;
        }
        const currentBooking = booking

        // these are the queryselectors for the sections on the page, and the destructuring of the properties to be displayed
        const bookingDetail = document.querySelector(".booking-detail-container")
        const bookingImage = document.querySelector(".booking-image-container")
        const { endDate, startDate, isConfirmed, Kitchen: { id: kitchenId, name, streetAddress, imgPath } } = currentBooking

        let bookingDetailHtml = ''
        let bookingImageHtml = `<img src="${imgPath[0]}">`
        if (isConfirmed) {
            bookingDetailHtml = `
            <a class="booking-detail-kitchen-name" href="/kitchens/${kitchenId}"> ${name} </a>
            <div class="booking-detail-address"> Address: ${streetAddress} </div>
            <div class="booking-detail-confirmed"> Confirmed! </div>
            <div class="booking-detail-start"> Start Date: ${startDate} </div>
            <div class="booking-detail-end"> Start Date: ${endDate} </div>
        `
        } else if (!isConfirmed) {
            bookingDetailHtml = `
            <a class="booking-detail-kitchen-name" href="/kitchens/${kitchenId}"> ${name} </a>
            <div class="booking-detail-address"> Address: ${streetAddress} </div>
            <div class="booking-detail-cancelled"> Cancelled! </div>
            <div class="booking-detail-start"> Start Date: ${startDate} </div>
            <div class="booking-detail-end"> Start Date: ${endDate} </div>
        `
        }


        bookingDetail.innerHTML = `${bookingDetailHtml}`;
        bookingImage.innerHTML = `${bookingImageHtml}`;

    } catch (e) {
        console.error(e);
    }
});
