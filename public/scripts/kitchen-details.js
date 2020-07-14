import {
  isLoggedIn,
  goToProfile,
  goToListings,
  logOut
} from './tools.js';

import { api } from "./getapi.js";

document.addEventListener("DOMContentLoaded", async () => {
  isLoggedIn();
  logOut();
  goToListings();
  goToProfile();
  // const kitchenId = localStorage.getItem("AIRCNC_KITCHEN_ID");
  isLoggedIn();
  goToProfile();
  goToListings();
  logOut();

  // const kitchenId = getCookie("kitchenId");
  // const actual = 'https://aircook-n-cuisine.herokuapp.com/listings/9'
  const currentURL = window.location.href;
  const kitchenId = currentURL.substring(currentURL.lastIndexOf('/') + 1);
  // console.log(kitchenId)

  try {
        let res = await fetch(`${api}kitchens/${kitchenId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem(
              "AIRCNC_ACCESS_TOKEN"
            )}`,
            "Content-Type": "application/json",
          },
        });

        if (res.status === 401) {
          window.location.href = "/";
          return;
        }

        if (!res.ok) {
          throw res;
        }

        const {
          kitchen,
          kitchenFeatures,
          starRating,
          kitchenReviews,
        } = await res.json();

        /*********************************
         *  Contains
         *    - kitchen.name
         *    - kitchen.reviews.starRating
         *    - kitchen.rate
         *********************************/
        // const roleId = localStorage.getItem("AIRCNC_CURRENT_USER_ROLE");
        document.querySelector(".kitchenDetails__row-1__info").innerHTML = `
          <div class="demo-card-event mdl-card mdl-shadow--2dp">
            <div class="kitchenDetails__info__name">
              ${kitchen.name}
            </div>
            <div class="kitchenDetails__info__description">
              Beautiful Kitchen In ${kitchen.city.cityName}
            </div>
            <div class="kitchenDetails__info__star-rating">
              ${starRating} Star Rating
            </div>
            <div class="kitchenDetails__info__rate">
              Rate: $${kitchen.rate} / hour
            </div>
            <div class="kitchenDetails__info__button">
              <button id="kitchenDetails__info-button" class="kitchenDetails__info_button-bookings">Book Now</button>
            </div>
          </div>
        `;
        // document.querySelector(".kitchenDetails__row-1__info").innerHTML = `
        //   <div class="kitchenDetails__detail-container">
        //     <div class="kitchenDetails__info__name">
        //       ${kitchen.name}
        //     </div>
        //     <div class="kitchenDetails__info__description">
        //       Beautiful Kitchen In ${kitchen.city.cityName}
        //     </div>
        //     <div class="kitchenDetails__info__star-rating">
        //       ${starRating} Star Rating
        //     </div>
        //     <div class="kitchenDetails__info__rate">
        //       Rate: $${kitchen.rate} / hour
        //     </div>
        //     <div class="kitchenDetails__info__button">
        //       <button id="kitchenDetails__info-button" class="kitchenDetails__info_button-bookings">${roleId === '1' ? 'See All Bookings' : 'Book Now'}</button>
        //     </div>
        //   </div/
        //   <div class="kitchenDetails__info__featured-img-container">
        //     <div class="kitchenDetails__info__featured-img">
        //       <img src="${kitchen.imgPath[0]}">
        //     </div>
        //   </div>
        // `;

        // <div class="kitchenDetails__detail-container">
        //   <div class="kitchenDetails__info__name">
        //     ${kitchen.name}
        //   </div>
        //   <div class="kitchenDetails__info__description">
        //     Beautiful Kitchen In ${kitchen.city.cityName}
        //   </div>
        //   <div class="kitchenDetails__info__star-rating">
        //     ${starRating} Star Rating
        //   </div>
        //   <div class="kitchenDetails__info__rate">
        //     Rate: $${kitchen.rate} / hour
        //   </div>
        //   <div class="kitchenDetails__info__button">
        //     <button id="kitchenDetails__info-button" class="kitchenDetails__info_button-bookings">${roleId === '1' ? 'See All Bookings' : 'Book Now'}</button>
        //   </div>
        // </div/
        // <div class="kitchenDetails__info__featured-img-container">
        //   <div class="kitchenDetails__info__featured-img">
        //     <img src="${kitchen.imgPath[0]}">
        //   </div>
        // </div>

        // document.querySelector(".kitchenDetails__row-1__featured-img").innerHTML = `
        //   <img src="${kitchen.imgPath[0]}">
        // `;

        // const options = {
        //   count: kitchen.imgPath.length,
        //   move: 1,
        //   dots: true,
        //   rewind: true,
        //   autoplay: 0,
        //   animation: 500,
        // };

        // const carousel = new latte.Carousel("#carousel", options);

        // carousel.trigger("next");
        // carousel.trigger("previous");

        let imgs = "";
        kitchen.imgPath.forEach((img) => {
          // console.log(img);
          imgs += `
            <div class="kitchenDetails__kitchen-img">
              <img class="kitchenDetails__images" src="${img}">
            </div>`
        });

        document.querySelector(
          ".kitchenDetails__row-2__images"
        ).innerHTML = imgs;

      //   document.querySelector(".kitchenDetails__row-3").innerHTML = `
      // <div class="kitchenDetails__row-3__host-text">
      //   Hosted by ${kitchen.user.firstName}
      // </div>
      // <div class="kitchenDetails__row-3__description-text">
      //   "${kitchen.description}"
      // </div>`;

        let features = "";
        kitchenFeatures.forEach(({ feature }) => {
          // console.log(feature.imgPath);
          features += `
      <div class="kitchenDetails__feature-container">
        <div class="kitchenDetails__feature-img">
          <img class="kitchenDetails__feature__img" src="${feature.imgPath}">
        </div>
        <div class="kitchenDetails__feature">
          ${feature.feature}
        </div>
      </div>
      `;
        });

        document.querySelector(
          ".kitchenDetails__row-4__features"
        ).innerHTML = features;

        // console.log(kitchenReviews);
        let kitchenReviewHTML = "";
        kitchenReviews.forEach((kitchenReview) => {
          // kitchenReviewHTML += `
          // <div class="kitchenDetails__review-name">
          //   ${kitchenReview.User.firstName} ${kitchenReview.User.lastName[0]}.
          // </div>
          // <div class="kitchenDetails__review">
          //   <div class="kitchenDetails__review-comment">${kitchenReview.comment}</li>
          // </div>`
          kitchenReviewHTML += `
        <li class="mdl-list__item mdl-list__item--three-line">
          <span class="mdl-list__item-primary-content">
            <i class="material-icons mdl-list__item-avatar">person</i>
            <span>${kitchenReview.User.firstName} ${kitchenReview.User.lastName[0]}
              <span class="mdl-list__item-text-body">
                ${kitchenReview.comment}
              </span>
            </span>
          </span>
          <span class="mdl-list__item-secondary-content">
            <a class="mdl-list__item-secondary-action" href="#"><i class="material-icons">star</i></a>
          </span>
        </li>
      `;
        });

        document.querySelector(
          ".kitchenDetails__row-5__reviews"
        ).innerHTML = kitchenReviewHTML;
      } catch (err) {
    console.error(err);
  }


});

document.getElementById("kitchenDetails__info-button")
addEventListener("click", (ev) => {
  if (ev.target.id === "kitchenDetails__info-button") {
    const currentURL = window.location.href;
    const kitchenId = currentURL.substring(currentURL.lastIndexOf('/') + 1);
    window.location.href = `/listings/${kitchenId}/checkout`;
  } else {
    return;
  }
});
// };

