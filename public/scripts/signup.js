const signUpForm = document.querySelector(".sign-up-form");
import { api } from "./getapi.js";

document.querySelector(".home").addEventListener('click', () => {
  window.location.href = '/'
});

document.querySelector(".help").addEventListener('click', () => {
  window.location.href = 'https://github.com/arkaneshiro/aircnc'
});

signUpForm.addEventListener("submit", async (ev) => {
  ev.preventDefault();
  console.log("HERE!!!!!!!!!!!");
  const formData = new FormData(signUpForm);
  const body = {};
  for (let data of formData.entries()) {
    const [key, value] = data;
    body[key] = value;
  }

  try {
    const res = await fetch(`${api}users`, {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw res
    }
    // if (res.status === 401) {
    //   window.location.href = "/signup"
    //   return;
    // }

    const {
      token,
      user: { id, role }
    } = await res.json();

    localStorage.setItem("AIRCNC_ACCESS_TOKEN", token);
    localStorage.setItem("AIRCNC_CURRENT_USER_ID", id);
    localStorage.setItem("AIRCNC_CURRENT_USER_ROLE", role);

    if (role === 1) {
      window.location.href = '/dashboard'
    } else {
      window.location.href = '/listings'
    }
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
