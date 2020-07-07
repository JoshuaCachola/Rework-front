//function to log user out

// export { logOut, isLoggedIn, goToProfile };

export function logOut() {
    document.getElementById("logout-button").addEventListener("click", () => {
        localStorage.clear();
        window.location.href = "/";
    });
}

//function to check if user is logged in
export function isLoggedIn() {
    if (localStorage.getItem("AIRCNC_ACCESS_TOKEN") === null) {
        window.location.href = "/";
    }
}

//function to go to userProfile
export function goToProfile() {
    document.getElementById("profile-button").addEventListener('click', () => {
        window.location.href = '/profile'
    });
}

export function goToListings() {
    document.getElementById("listings-button").addEventListener('click', () => {
        window.location.href = '/listings'
    });
}

export function createListing() {
    document.getElementById("create-listing-button").addEventListener('click', () => {
        window.location.href = '/listings/create'
    });
}

export function goToDashboard() {
    document.getElementById("dashboard-button").addEventListener('click', () => {
        window.location.href = '/dashboard'
    });
}
