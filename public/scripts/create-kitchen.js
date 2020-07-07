//dont forget to set hostId in body to localStorage Id
import { logOut, isLoggedIn, createListing, goToDashboard } from "./tools.js";
import { api } from "./getapi.js";
//set up the form
window.addEventListener('DOMContentLoaded', async () => {
    isLoggedIn();
    logOut();
    createListing();
    goToDashboard();
    const stateDropDown = document.getElementById('states');
    const cityDropDown = document.getElementById('cities');

    const states = await fetch(`${api}tools/states`);
    const statesData = await states.json();
    const cities = await fetch(`${api}tools/cities`);
    const citiesData = await cities.json();

    //populate state dropDown
    let stateListHTML = '';
    for (let i = 0; i < statesData.states.length; i++) {
        const state = statesData.states[i];
        stateListHTML += `<option value=${state.id}>${state.stateName}</option>`
    }
    stateDropDown.innerHTML = stateListHTML;

    //populate city drop down
    let citiesListHTML = '';
    for (let i = 0; i < citiesData.cities.length; i++) {
        const city = citiesData.cities[i];
        citiesListHTML += `<option value=${city.id}>${city.cityName}</option>`
    }
    cityDropDown.innerHTML = citiesListHTML;

    //display features to choose from
    const featuresDivLeft = document.getElementById('features__left');
    const featuresDivRight = document.getElementById('features__right');
    const features = await fetch(`${api}tools/features`)
    const featuresData = await features.json();
    //eleminates whitespace in feature for use in name attribute
    const featureNames = featuresData.features.map(feature => {
        return feature.feature.split(" ").join("");
    });

    let featuresHTMLLeft = ``;
    let featuresHTMLRight = ``;
    let extraApplianceIndex = 50000;
    for (let i = 0; i < featuresData.features.length; i++) {
        const feature = featuresData.features[i]
        if (featureNames[i] === 'ExtraAppliances') {
            featuresHTMLRight += `<div class='features__extra-appliances'>
                                <h2>${feature.feature}</h2>
                            </div>`
            extraApplianceIndex = i;
        } else if (i > extraApplianceIndex) {
            featuresHTMLRight += `<div class='features__feature'>
                            <div class='features__left'>
                                <div class='features__img features__img-${featureNames[i]}'>
                                    <img src="/images/feature-images/${featureNames[i]}.jpg" alt=${featureNames[i]}>
                                </div>
                            </div>
                            <div class='features__middle'>
                                <div class='features__text features__text-${featureNames[i]}'>
                                    <label for=${featureNames[i]}>${feature.feature}</label>
                                </div>
                            </div>
                            <div class='features__right'>
                                <div class='features__checkbox features__checkbox-${featureNames[i]}'>
                                    <input type="checkbox" id=${featureNames[i]} name=${featureNames[i]} value=${feature.id}>
                                </div>
                            </div>
                        </div>
                        `
        } else {
            featuresHTMLLeft += `<div class='features__feature'>
                            <div class='features__left'>
                                <div class='features__img features__img-${featureNames[i]}'>
                                    <img src="/images/feature-images/${featureNames[i]}.jpg" alt=${featureNames[i]}>
                                </div>
                            </div>
                            <div class='features__middle'>
                                <div class='features__text features__text-${featureNames[i]}'>
                                    <label for=${featureNames[i]}>${feature.feature}</label>
                                </div>
                            </div>
                            <div class='features__bottom'>
                                <div class='features__checkbox features__checkbox-${featureNames[i]}'>
                                    <input type="checkbox" id=${featureNames[i]} name=${featureNames[i]} value=${feature.id}>
                                </div>
                            </div>
                        </div>
                        `
        }

    }

    featuresDivLeft.innerHTML = featuresHTMLLeft;
    featuresDivRight.innerHTML = featuresHTMLRight;






    const kitchenForm = document.getElementById('kitchen-form');
    const fileInput = document.getElementById('img-upload');
    kitchenForm.addEventListener('submit', async (event) => {
        event.preventDefault();


        const secureUrlArray = [];
        const files = Array.from(fileInput.files);

        // map each file to an array of fetch requests
        let requests = files.map(file => {
            const data = new FormData();
            data.append('file', file);
            data.append('upload_preset', 'ys16oj0w');
            return fetch('https://api.cloudinary.com/v1_1/aircncaa/image/upload', {
                method: "POST",
                body: data,
            });
        });

        //use promise.All to ensure all files are uploaded
        const promiseArray = await Promise.all(requests);
        // map results of promises
        const promiseData = promiseArray.map(async result => await result.json());
        // promiseData are resolved/unresolved promises
        const responses = await Promise.all(promiseData);
        //push each url of responses to array
        responses.forEach(ele => secureUrlArray.push(ele.secure_url));

        // after image uploading start sending data to back end
        try {
            const formData = new FormData(kitchenForm);
            const kitchenBody = {
                name: formData.get('name'),
                stateId: parseInt(formData.get('state'), 10),
                cityId: parseInt(formData.get('city'), 10),
                streetAddress: formData.get('address'),
                description: formData.get('description'),
                hostId: parseInt(localStorage.getItem('AIRCNC_CURRENT_USER_ID'), 10), // change for future
                imgPath: secureUrlArray,
                rate: parseInt(formData.get('rate'), 10)
            }

            const createKitchen = await fetch(`${api}kitchens`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('AIRCNC_ACCESS_TOKEN')}`
                },
                method: 'POST',
                body: JSON.stringify(kitchenBody)
            });
            if (!createKitchen.ok) {
                throw createKitchen;
            }
            const createKitchenInfo = await createKitchen.json();
            const kitchenId = createKitchenInfo.kitchen.id;


            //logic to check if check boxes have beeen checked
            for (let i = 0; i < featureNames.length; i++) {
                let checkBox = document.getElementById(featureNames[i]);
                console.log(checkBox);
                if (featureNames[i] === 'ExtraAppliances') continue;
                if (checkBox.checked) {

                    const featureBody = {
                        kitchenId,
                        featureId: parseInt(formData.get(featureNames[i]))
                    }

                    const feature = await fetch(`${api}kitchenfeatures`, {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${localStorage.getItem('AIRCNC_ACCESS_TOKEN')}`
                        },
                        method: 'POST',
                        body: JSON.stringify(featureBody)
                    });
                    const featureResponse = await feature.json();
                }
            }
            window.location.href = '/dashboard';
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


});
