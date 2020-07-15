import {
  goToProfile,
  logOut,
  isLoggedIn,
  goToListings
} from './tools.js';
import { api } from "./getapi.js";

goToProfile();
logOut();
isLoggedIn();
goToListings();

// let today = new Date();
// let currYear = today.getFullYear();
// let currMonth = today.getMonth();
// let firstDay = new Date(currYear, currMonth).getDay();
// const selectYear = document.getElementById("year");
// const selectMonth = document.getElementById("month");
// const endTime = document.getElementById("endTime");
// const startTime = document.getElementById("startTime");
// const monthAndYear = document.getElementById("monthAndYear");
// const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
// let dateStr;
// let getStartTime;
// let getEndTime;
// let rate;

// const daysInMonth = () => {
//   return 32 - new Date(currYear, currMonth, 32).getDate();
// };

// const setPopUpListener = () => {
//   let dates = document.querySelectorAll(".bookings__start-end-time__popup")
//   dates.forEach(date => {
//     date.addEventListener("click", ev => {
//       ev.preventDefault()
//       const day = ev.target.id.slice(-2);
//       const [month, year] = monthAndYear.innerHTML.split(" ");
//       dateStr = `${month} ${day}, ${year}`;
//       document.getElementById("set-time-form").classList.toggle("hidden");
//     });
//   });
// };

// const jump = () => {
//   currYear = parseInt(selectYear.value);
//   currMonth = parseInt(selectMonth.value);
//   showCalendar(currMonth, currYear);
//   setPopUpListener();
// };

// const showCalendar = (month, year) => {
//   let firstDay = (new Date(year, month)).getDay();

//   const table = document.getElementById("calendar-body"); // body of the calendar

//   // clears all previous cells
//   table.innerHTML = "";

//   monthAndYear.innerHTML = months[month] + " " + year;
//   selectYear.value = year;
//   selectMonth.value = month;
//   let date = 1;

//   for (let i = 0; i < 6; i++) {
//     let row = document.createElement("tr");

//     for (let j = 0; j < 7; j++) {
//       let cell, cellText;
//       if (i === 0 && j < firstDay) {
//         cell = document.createElement("td");
//         cell.setAttribute("class", "calendarTD")
//         cellText = document.createTextNode("");
//         cell.appendChild(cellText);
//         row.appendChild(cell);
//       } else if (date > daysInMonth(month, year)) {
//         break;
//       } else {
//         cell = document.createElement("td");
//         cellText = document.createTextNode(date);

//         const [month, year] = monthAndYear.innerHTML.split(" ");
//         const selectableDate = new Date(`${month} ${date} ${year}`);
//         // role = "button" aria - expanded="false" aria - controls="multiCollapseExample1"
//         if (today <= selectableDate) {
//           const setTime = document.createElement("a");
//           // setTime.setAttribute("class", "collapsed")
//           setTime.setAttribute("href", "#");
//           setTime.setAttribute("class", "bookings__start-end-time__popup");
//           // setTime.setAttribute("data-toggle", "collapse");
//           // setTime.setAttribute("role", "button");
//           // setTime.setAttribute("aria-expanded", "false");
//           // setTime.setAttribute("aria-controls", "#set-time-form");
//           setTime.setAttribute("id", `day-${date >= 10 ? date.toString() : '0' + date}`);
//           setTime.appendChild(cellText);
//           cell.appendChild(setTime);
//         } else {
//           cell.appendChild(cellText);
//         }
//         row.appendChild(cell);
//         date++;
//       }
//     }
//     table.appendChild(row);
//   }

// };

const kitchenDetails = async () => {
  const currentURL = window.location.href;
  const kitchenId = currentURL.match(/\d+/g)[1];

  const res = await fetch(`${api}kitchens/${kitchenId}`, {
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${localStorage.getItem("AIRCNC_ACCESS_TOKEN")}`
    }
  });

  const { kitchen, kitchenReviews, starRating } = await res.json();
  // console.log(kitchenReviews);
  // console.log(kitchenFeatures);

  // let featuresHTML = "";
  // kitchenFeatures.forEach(({ feature }) => {
  //   featuresHTML += `
  //   <div class="bookings-form__left-bottom__features-image">
  //     <div class="bookings-form__left-bottom__features-name">
  //       ${feature.feature}
  //     </div>
  //     <img class="bookings-form__left-bottom__features-img" src="${feature.imgPath}">
  //   </div>
  //   `;
  // });

  // document.querySelector(".bookings-form__left-bottom__features-body").innerHTML = featuresHTML;
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


  // <div class="bookings-form__left-top-container">
  //     <div class="bookings-form__left-top__kitchen-feature-img">
  //       <img class="bookings-form__left-top__kitchen-img" src="${kitchen.imgPath[0]}">
  //     </div>
  //     <div class="bookings-form__left-top__kitchen-details">
  //       <div class="bookings-form__left-top__kitchen-name">
  //         ${kitchen.name}
  //       </div>
  //       <div class="bookings-form__left-top__kitchen-location-container">
  //         <div class="bookings-form__left-top__kitchen-location">
  //           Kitchen in ${kitchen.city.cityName}, ${kitchen.state.stateName}
  //         </div>
  //         <div class="bookings-form__left-top__kitchen-star-rating">
  //           ${starRating} rating ${kitchenReviews.length} reviews
  //         </div>
  //       </div>
  //     </div>
  //   </div>

  // rate = kitchen.rate;
  // console.log(rate);
  // let imgHTML = `<img src="http://maps.googleapis.com/maps/api/staticmap?center=${kitchen.lat},${kitchen.lng}&markers=color:red%7Clabel:SS%7C${kitchen.lat},${kitchen.lng}&zoom=17&size=375x350&key=AIzaSyDscju6O6knNTt9zh71EQkt7Lk1XeejhyQ">`;
  // kitchen.imgPath.forEach((img, i) => {
  //   imgHTML += `<img id="bookings-form__img-${i + 1}" src="${img}">`;
  // });
  // document.querySelector(".bookings-form__imgs").innerHTML = imgHTML;


};

kitchenDetails();
// showCalendar(currMonth, currYear);
// setPopUpListener();

// document.getElementById("next")
//   .addEventListener("click", () => {
//     currYear = (currMonth === 11) ? currYear + 1 : currYear;
//     currMonth = (currMonth + 1) % 12;
//     showCalendar(currMonth, currYear);
//     setPopUpListener();
//   });

// document.getElementById("previous")
//   .addEventListener("click", () => {
//     currYear = (currMonth === 0) ? currYear - 1 : currYear;
//     currMonth = (currMonth === 0) ? 11 : currMonth - 1;
//     showCalendar(currMonth, currYear);
//     setPopUpListener();
//   });

// document.getElementById("month")
//   .addEventListener("change", jump);


// document.getElementById("year")
//   .addEventListener("change", jump);


// document.querySelector(".bookings__start-end-time")
//   .addEventListener("submit", async ev => {
//     ev.preventDefault();
//     getStartTime = startTime.value;
//     getEndTime = endTime.value;
//     let startDisplay = parseInt(startTime.value.slice(0, 2)) > 12 ? parseInt(startTime.value.slice(0, 2)) - 12 + ":00 PM" : getStartTime.slice(0, -3) + " AM";
//     let endDisplay = parseInt(endTime.value.slice(0, 2)) > 12 ? parseInt(endTime.value.slice(0, 2)) - 12 + ":00 PM" : getEndTime.slice(0, -3) + " AM";
//     const totalTime = parseInt(endTime.value.slice(0, 2)) - parseInt(startTime.value.slice(0, 2));
//     console.log(new Date(`${dateStr} ${startTime.value}`));
//     document.getElementById("set-time-form").classList.toggle("hidden");

//     const checkoutTotal = document.querySelector(".bookings-form__right-bottom-checkout-total");
//     checkoutTotal.innerHTML = `
//       <div class="bookings-form__right-bottom-checkout-total-container">
//         <div class="bookings-form__right-bottom-checkout-header">
//           <span class="checkout-text">Date and time of rental & fees</span>
//         </div>
//         <div class="bookings-form__right-bottom-checkout-date-time">
//           <span class="checkout-text">${dateStr} ${startDisplay} - ${endDisplay}</span>
//         </div>
//         <div class="bookings-form__right-bottom-checkout-cleaning">
//           <span class="checkout-text">Cleaning fee</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="bookings-form-span">$0.00</span>
//         </div>
//         <div class="bookings-form__right-bottom-checkout-rate">
//           <span class="checkout-text">Rate</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="bookings-form-span">$${rate}</span>
//         </div>
//         <div class="bookings-form__right-bottom-checkout-subtotal">
//           <span class="checkout-text">Rate x ${totalTime} hour(s)</span>&nbsp;&nbsp;<span class="bookings-form-span">$${rate * totalTime}</span>
//         </div>
//         <div class="bookings-form__right-bottom-checkout-due-now">
//           <span class="checkout-text">Due now</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="bookings-form-span"> $${rate * totalTime}</span>
//         </div>
//       </div>
//     `;
//   });

document.querySelector(".checkout__submit-booking")
  .addEventListener("submit", async ev => {
    console.log('is this working?');
    ev.preventDefault();
    const currentURL = window.location.href;
    const kitchenId = currentURL.match(/\d+/g)[1];
    console.log(kitchenId)

    //get picture for kitchen
    const kitchenData = await fetch(`${api}kitchens/${kitchenId}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('AIRCNC_ACCESS_TOKEN')}`,
        "Content-Type": "application/json"
      }
    });

    const { kitchen } = await kitchenData.json();
    const imgDiv = document.getElementById('bookings-form__img');
    console.log(imgDiv);
    console.log(startTime.value, endTime.value, dateStr);
    // imgDiv.innerHTML = `<img href="${kitchen.imgPath[0]}" alt="Picture of ${kitchen.name}">`

    let body = {
      startDate: new Date(),
      endDate: new Date(),
      kitchenId,
      hostId: kitchen.hostId
    };
    // if (startTime.value < endTime.value) {
    //   console.log(new Date(`${dateStr} ${startTime.value}`));
    //   body = {
    //     startDate: new Date(`${dateStr} ${startTime.value}`),
    //     endDate: new Date(`${dateStr} ${endTime.value}`),
    //     kitchenId,
    //     hostId: kitchen.hostId
    //   };

    // } else {
    //   alert("Start time cannot be after the end time...");
    //   return;
    // }

    try {
      const res = await fetch(`${api}kitchens/${kitchenId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "authorization": `Bearer ${localStorage.getItem("AIRCNC_ACCESS_TOKEN")}`,
        },
        body: JSON.stringify(body)
      });

      if (!res.ok) {
        throw res;
      }

      window.location.href = '/profile';
    } catch (err) {
      console.error(err);
    }
  });
