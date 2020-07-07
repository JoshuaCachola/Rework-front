const guestReview = document.querySelector(".guest-review-form");



guestReview.addEventListener("submit", async (ev) => {
  ev.preventDefault();
  const id = getCookie("id");
  const formData = new FormData(guestReview);
  const starRating = formData.get("starRating");
  const comment = formData.get("comment");
  const wouldHostAgain = document.getElementById("wouldHostAgain");
  const bearerToken = localStorage.getItem("AIRCNC_ACCESS_TOKEN");

  try {
    let res = await fetch(`http://localhost:8080/bookings/${id}`, {
      headers: {
        "Content-Type": "application/json"
      }
    });

    if (!res.ok) {
      throw res
    }

    const { booking } = await res.json();
    // console.log("*************************", booking);

    // console.log(booking.renterId);
    // console.log(localStorage.getItem("AIRCNC_CURRENT_USER_ID"));
    const body = {
      guestId: booking.renterId,
      starRating,
      comment,
      authorId: localStorage.getItem("AIRCNC_CURRENT_USER_ID"),
      wouldHostAgain: `${wouldHostAgain.checked ? true : false}`
    };

    res = await fetch(`http://localhost:8080/users/${booking.renterId}/reviews`, {
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
    res = await res.json();
    // console.log(res);
    window.location.href = "/listings";
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
