import { logOut, isLoggedIn, goToProfile } from "./tools.js";
import { api } from "./getapi.js";

let markerIcon = "images/map_marker.png";
let kitchensLen;
if (localStorage.getItem("AIRCNC_CURRENT_USER_ROLE") === '1') {
  window.location.href = "/dashboard";
}

function initMap(latLngRate) {
  const infoWindow = new window.google.maps.InfoWindow({
    content: "<div>SOME TEXT</div>",
  });

  if (latLngRate) {
    const map = new google.maps.Map(
      document.getElementById('map'), {
      zoom: 12,
      center: { lat: latLngRate[0][0], lng: latLngRate[0][1] },
      disableDefaultUI: true
    });

    latLngRate.forEach(([lat, lng, rate, obj]) => {
      const marker = new google.maps.Marker({
        position: { lat, lng },
        map,
        icon: markerIcon,
        label: `$${rate}`,
        animation: google.maps.Animation.DROP
      });

      marker.addListener('click', async (e) => {
        const infoWindowNode = document.createElement('div');
        const reviewCount = obj.kitchenReview.length
        infoWindowNode.innerHTML = `
      <div class="info-window">
        <div class="info-window__picture-container">
          <div class="infow-window__name">
            ${obj.name}
          </div>
          <img class="info-window__picture" src=${obj.imgPath[0]} />

        </div>
        <div class="info-window__reviews">
          <img class="info-window__reviews-icon" src="https://img.icons8.com/fluent/48/000000/star.png"/> ${reviewCount} reviews
        </div>
        
        <div class="info-window__rate">
          <span><b>$${rate}</b> / hour</span>
        </div>
      </div>
      `
        infoWindow.setContent(infoWindowNode);
        infoWindow.open(map, marker);
      })
    });
  }
}

// <div class="info-window__features">
        //   <div>
        //     ${obj.kitchenFeature[0].feature.feature} •&nbsp
        //   </div>
        //   <div>
        //     ${obj.kitchenFeature[1].feature.feature} •&nbsp
        //   </div>
        //   <div>
        //     ${obj.kitchenFeature[2].feature.feature}
        //   </div>
        // </div>
const getListings = async (search) => {
  try {
    // const userId = localStorage.getItem("AIRCNC_USER_ID");
    // console.log(search);
    // change fetch to search and query on search params
    const res = await fetch(`${api}kitchens/search`,
      {
        method: "POST",
        headers: {
          "authorization": `Bearer ${localStorage.getItem('AIRCNC_ACCESS_TOKEN')}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ search })
      }
    );

    if (res.status === 401) {
      window.location.href = "/log-in";
      return;
    }

    if (!res.ok) {
      throw res;
    }

    // if (res.status === 401) {
    //   window.location.href = "/log-in";
    //   return;
    // }

    // if (!res.ok) {
    //   throw res;
    // }

    const { kitchens } = await res.json();
    kitchensLen = kitchens.length;
    // document.querySelector(".listings__header").innerHTML = `
    //   <p class="listings__header--bold">${kitchens.length}+ Aircnc kitchens to cook in</p>
    //   <p>A selection of kitchens to enjoy a home cooked meal at anytime</p> 
    // `;

    if (!kitchens.length) {
      alert("There are no kitchens in that city");
      return;
    }
    const kitchenListings = document.getElementById("kitchenListings");
    const latLngRate = [];
    const kitchensHTML = kitchens.map((obj, i) => {
      let kitchenImages = "";
      obj.imgPath.forEach((img, j) => {
        let kitchenImage;
        if (j !== 0) {
          kitchenImage = `<img class="carousel__photo-${i}" src="${img}">`;
        } else {
          kitchenImage = `<img class="carousel__photo-${i} initial" src="${img}">`;
        }

        kitchenImages += `
          <div class="kitchenListing__img">
            ${kitchenImage}
          </div>`;
      });

      latLngRate.push([parseFloat(obj.lat), parseFloat(obj.lng), obj.rate.toString(), obj]);

      let kitchenFeatures = obj.kitchenFeature;
      let features = "";
      if (kitchenFeatures) {
        kitchenFeatures.forEach(({ feature }, i) => {
          if (i === kitchenFeatures.length - 1) {
            features += `${feature.feature}`
          } else {
            features += `${feature.feature} •`
          }
        });
      }

      let starRatings = obj.kitchenReview;
      // console.log(starRatings);
      let avgStarRating = 0;
      let willRentAgain = 0;
      if (starRatings) {
        starRatings.forEach(rating => {
          avgStarRating += rating.starRating;
          if (rating.wouldRentAgain) {
            willRentAgain++;
          }
        });
      }

      // star rating
      // <span> Star Rating (${avgStarRating / starRatings.length ? avgStarRating / starRatings.length : 0})</span>
      // would rent again
      // ${willRentAgain} people would rent again
      return `
        <div class="kitchenListing" id="kitchen${obj.id}">
          <div class="carousel-wrapper">
            <div class="carousel-${i}">
              ${kitchenImages}
              <div class="carousel__button--next-${i}"></div>
              <div class="carousel__button--prev-${i}"></div>
            </div>
          </div>
          <div class="listing-info-container">
            <div class="kitchenListing__topLine">
              <div class="kitchenListing__userInfo">
                <a class="kitchenListing__userInfo-link" href="/listings/${
                  obj.id
                }">${obj.name}</a>
              </div>
                <div class="kitchenListing__starRating"> Star Rating (${
                  Math.floor(Math.random() * 5) + 1
                })</div>
            </div>
            <div class="kitchenListing__location">
              ${obj.streetAddress} ${obj.city.cityName} ${obj.state.stateName}
            </div>
            <div class="kitchenListing__features">
              ${features}
            </div>
            <div class="kitchenListing__bottomLine">
              <div class="kitchenListing__wouldRentAgain">
                ${Math.floor(Math.random() * 100)} people would rent again
              </div>
              <div class="kitchenListing__rate">
                $${obj.rate}
              </div>
            </div>
          </div>
        </div>`;
    });

    initMap(latLngRate);
    kitchenListings.innerHTML = kitchensHTML.join("");

    // document.querySelectorAll(".kitchenListing").forEach(kitchenListing => {
    //   kitchenListing.addEventListener('click', event => {
    //     let listing = event.currentTarget
    //     const listingId = (listing.id).substring(7);
    //     window.location.href = `./listings/${listingId}`;
    //   })
    // })
    // console.log(thing)

  } catch (err) {
    console.error(err);
  }

  for (let i = 0; i < kitchensLen; i++) {
    (function () {
      let itemClassName = `carousel__photo-${i}`;
      let items = document.getElementsByClassName(itemClassName);
      let totalItems = items.length;
      let slide = 0;
      let moving = true;

      function setInitialClasses() {
        // Targets the previous, current, and next items
        // This assumes there are at least three items.
        items[totalItems - 1].classList.add("prev");
        items[0].classList.add("active");
        items[1].classList.add("next");
      }
      // Set event listeners
      function setEventListeners() {
        let nextButton = document.getElementsByClassName(
            `carousel__button--next-${i}`
          )[0];
        let prevButton = document.getElementsByClassName(
            `carousel__button--prev-${i}`
          )[0];
        nextButton.addEventListener('click', moveNext);
        prevButton.addEventListener('click', movePrev);
      }

      // Next navigation handler
      function moveNext() {
        // Check if moving
        // console.log(itemClassName);
        if (!moving) {
          // If it's the last slide, reset to 0, else +1
          if (slide === totalItems - 1) {
            slide = 0;
          } else {
            slide++;
          }
          // Move carousel to updated slide
          moveCarouselTo(slide);
        }
      }
      // Previous navigation handler
      function movePrev() {
        // Check if moving
        if (!moving) {
          // If it's the first slide, set as the last slide, else -1
          if (slide === 0) {
            slide = totalItems - 1;
          } else {
            slide--;
          }

          // Move carousel to updated slide
          moveCarouselTo(slide);
        }
      }

      function disableInteraction() {
        // Set 'moving' to true for the same duration as our transition.
        // (0.5s = 500ms)

        moving = true;
        // setTimeout runs its function once after the given time
        setTimeout(function () {
          moving = false;
        }, 500);
      }

      function moveCarouselTo(slide) {
        // Check if carousel is moving, if not, allow interaction
        if (!moving) {
          // temporarily disable interactivity
          disableInteraction();
          // Update the "old" adjacent slides with "new" ones
          let newPrevious = slide - 1;
          let newNext = slide + 1;
          let oldPrevious = slide - 2;
          let oldNext = slide + 2;
          // Test if carousel has more than three items
          if ((totalItems - 1) > 3) {
            // Checks and updates if the new slides are out of bounds
            if (newPrevious <= 0) {
              oldPrevious = totalItems - 1;
            } else if (newNext >= totalItems - 1) {
              oldNext = 0;
            }
            // Checks and updates if slide is at the beginning/end
            if (slide === 0) {
              newPrevious = totalItems - 1;
              oldPrevious = totalItems - 2;
              oldNext = slide + 1;
            } else if (slide === totalItems - 1) {
              newPrevious = slide - 1;
              newNext = 0;
              oldNext = 1;
            }
            // Now we've worked out where we are and where we're going,
            // by adding/removing classes we'll trigger the transitions.
            // Reset old next/prev elements to default classes
            items[oldPrevious].className = itemClassName;
            items[oldNext].className = itemClassName;
            // Add new classes
            items[newPrevious].className = itemClassName + " prev";
            items[slide].className = itemClassName + " active";
            items[newNext].className = itemClassName + " next";
          } else {
            if (slide === 0) {
              newPrevious = totalItems - 1;
            } else if (slide === totalItems - 1) {
              newNext = 0;
            }
            items[newPrevious].className = itemClassName + " prev";
            items[slide].className = itemClassName + " active";
            items[newNext].className = itemClassName + " next";
          }
        }
      }

      function initCarousel() {
        setInitialClasses();
        setEventListeners();
        // Set moving to false so that the carousel becomes interactive
        moving = false;
      }

      // let itemClassName = "carousel__photo";
      // let items = document.getElementsByClassName(itemClassName);
      // let totalItems = items.length;
      // let slide = 0;
      // let moving = true;
      initCarousel();
    })();
  }
  
};

window.addEventListener("load", () => {
  getListings('San Francisco');
});

document.addEventListener("DOMContentLoaded", async () => {
  isLoggedIn();
  logOut();
  goToProfile()

  let search;
  // document.querySelector("form")
  document.getElementById("searchInput")
    .addEventListener("keypress", ev => {

      if (ev.key === 'Enter') {
        ev.preventDefault()
        search = document.getElementById("searchInput").value;
      } else {
        return;
      }

      getListings(search);
    });

});

