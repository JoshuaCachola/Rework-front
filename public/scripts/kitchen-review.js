const kitchenReview = document.querySelector(".kitchen-review-form");

kitchenReview.addEventListener("submit", async (ev) => {
  ev.preventDefault();
  const formData = new FormData(kitchenReview);
  const starRating = formData.get("starRating");
  const comment = formData.get("comment");
  const cleanRating = formData.get("cleanRating");
  const bookingId = getCookie("bookingId");
  const authorId = localStorage.getItem("AIRCNC_CURRENT_USER_ID");
  const bearerToken = localStorage.getItem("AIRCNC_ACCESS_TOKEN");
  const wouldRentAgain = document.getElementById("wouldRentAgain");
  const featureBool = document.getElementById("featureBool");

  try {
    let res = await fetch(`http://localhost:8080/bookings/${bookingId}`, {
      headers: {
        "Content-Type": "application/json"
      }
    });

    if (!res.ok) {
      throw res;
    }

    const { booking } = await res.json();
    // if (booking.authorId !== authorId) throw Error("You cannot leave a review for this kitchen...");
    const kitchenId = booking.kitchenId;
    const body = {
      kitchenId,
      cleanRating,
      starRating,
      comment,
      authorId,
      wouldRentAgain: `${wouldRentAgain.checked ? true : false}`,
      featureBool: `${featureBool.checked ? true : false}`
    };

    res = await fetch(`http://localhost:8080/kitchens/${kitchenId}/reviews`, {
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

    res = res.json();
    // window.location.href = "/listings";
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
