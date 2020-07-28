import { goToProfile, logOut, isLoggedIn, goToListings } from "./tools.js";
import { api } from "./getapi.js";

goToProfile();
logOut();
isLoggedIn();
goToListings();

const kitchenDetails = async () => {
  const currentURL = window.location.href;
  const kitchenId = currentURL.match(/\d+/g)[1];

  const res = await fetch(`${api}kitchens/${kitchenId}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("AIRCNC_ACCESS_TOKEN")}`,
    },
  });

  const { kitchen, kitchenReviews, starRating } = await res.json();
  document.querySelector(".checkout__kitchen-description").innerHTML = `
    <div class="checkout_kitchen">
      <div class="checkout__kitchen-text-container-wrapper">
        <div class="checkout__kitchen-text-container">
          <div class="checkout__kitchen-name">
            ${kitchen.name}
          </div>
          <div class="checkout__kitchen-location">
            Kitchen in ${kitchen.city.cityName}, ${kitchen.state.stateName}
          </div>
          <div class="checkout__kitchen-reviews">
            ${starRating} <i class="fa fa-star star" aria-hidden="true"></i> rating ${kitchenReviews.length} reviews
          </div>
        </div>
        <div class="checkout__kitchen-img">
          <img src="${kitchen.imgPath[0]}">
        </div>
      </div>
    </div>
  `;
};

document
  .querySelector(".checkout__submit-booking")
  .addEventListener("click", async (ev) => {
    ev.preventDefault();
    const currentURL = window.location.href;
    const kitchenId = currentURL.match(/\d+/g)[1];

    //get picture for kitchen
    const kitchenData = await fetch(`${api}kitchens/${kitchenId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("AIRCNC_ACCESS_TOKEN")}`,
        "Content-Type": "application/json",
      },
    });

    const { kitchen } = await kitchenData.json();

    let body = {
      startDate: new Date(),
      endDate: new Date(),
      kitchenId,
      hostId: kitchen.hostId,
    };

    try {
      const res = await fetch(`${api}kitchens/${kitchenId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem(
            "AIRCNC_ACCESS_TOKEN"
          )}`,
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        throw res;
      }

      window.location.href = "/profile";
    } catch (err) {
      console.error(err);
    }
  });

window.addEventListener("load", () => {
  kitchenDetails();
});
