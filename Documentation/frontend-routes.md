# Frontend Routes

- /                                         Splash page
    - /login                                Login
    - /sign-up                              Sign-up
        - /listings                         Listings
        - /listings/ (something?)           Search Listings by location
            - /:id                          Listing Detail
                - /checkout                 Checkout / confirmation this page is for guests to review bookings before confirming
        - /profile                          Profile
            - /bookings/:id                 Booking Detail
                - /review                   Guest Leaves a Review for a Host
        - /dashboard                        Hosts Dashboard (profile)
            - /kitchen/:id                  Kitchen Detail, lists bookings for particular kitchen
            - /bookings/:id/review          Host Leaves a Review for a Guest
            - /bookings                     List all Bookings past & present
        - /kitchens/create                  Create a listing


## Guest Nav Bar
- Profile
- Listings
- Log out


## Host Nav Bar
- Dashboard
- Log Out
- Create Listing
