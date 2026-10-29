// ============================================================
// SPORTS ACADEMY - COMPLETE JAVASCRIPT
// PART 1
// ============================================================

let selectedSport = "";
let selectedPlan = "";
let selectedAmount = "";
let currentSport = "";
let currentRegistrationId = null;
let currentSlide = 0;

// Prevent duplicate form submissions
let registrationSubmitting = false;
let slotBookingSubmitting = false;


// ============================================================
// SPORTS DATA
// ============================================================

const sportsData = {

    football: {
        name: "Football",
        title: "Football Academy",
        tagline: "Professional Football Training & Development",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS8YD13nCfjlOYZGR9V2AicIfyeZro9Sz9DCOa4cdTHRA&s=10=",
        address: "Sports Football Ground, Pallavaram 200 Feet Radial Rd, Chennai - 600043"
    },

    basketball: {
        name: "Basketball",
        title: "Basketball Academy",
        tagline: "Professional Basketball Training & Development",
        image: "https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=1200",
        address: "Sports Basketball Court, Pallavaram 200 Feet Radial Rd, Chennai - 600043"
    },

    cricket: {
        name: "Cricket",
        title: "Cricket Academy",
        tagline: "Professional Cricket Training & Development",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTlTKL3AHLFa1rh2UdQMvSlZMZhDvaz99MNqvZ1KuxVnw&s=10",
        address: "Sports Cricket Oval & Nets, Pallavaram 200 Feet Radial Rd, Chennai - 600043"
    },

    volleyball: {
        name: "Volleyball",
        title: "Volleyball Academy",
        tagline: "Professional Volleyball Training & Development",
        image: "https://t4.ftcdn.net/jpg/13/07/35/63/360_F_1307356346_YACAeReHvtctvUEHdAoPbBq0843C0i5s.jpg",
        address: "Sports Volleyball Court, Pallavaram 200 Feet Radial Rd, Chennai - 600043"
    },

    swimming: {
        name: "Swimming",
        title: "Swimming Academy",
        tagline: "Professional Swimming Training & Development",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS53uxWJWlPfGExg59ALkbz6jVcgASSPA22E3WvskNOyQ&s=10",
        address: "Sports Swimming Pool, Pallavaram 200 Feet Radial Rd, Chennai - 600043"
    },

    skating: {
        name: "Skating",
        title: "Skating Academy",
        tagline: "Professional Skating Training & Development",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcShXlelrzPlgNWsLtYHPW7XA1bKKQ_Wlm0__IKtyCfs5w&s=10",
        address: "Sports Skating Arena, Pallavaram 200 Feet Radial Rd, Chennai - 600043"
    },

    chess: {
        name: "Chess",
        title: "Chess Academy",
        tagline: "Professional Chess Training & Development",
        image: "https://images.unsplash.com/photo-1529699211952-734e80c4d42b?q=80&w=1200",
        address: "Sports Chess Academy Hall, Pallavaram 200 Feet Radial Rd, Chennai - 600043"
    }

};


// ============================================================
// SLOT DATA
// ============================================================

const slotsDatabase = {

    Cricket: [
        ["06:00 AM - 08:00 AM", "Morning Practice", "₹500"],
        ["08:30 AM - 10:30 AM", "Skill Training", "₹500"],
        ["04:00 PM - 06:00 PM", "Batting & Bowling", "₹600"],
        ["06:30 PM - 08:30 PM", "Match Practice", "₹700"],
        ["08:30 PM - 10:00 PM", "Night Practice", "₹600"]
    ],

    Football: [
        ["06:00 AM - 08:00 AM", "Morning Training", "₹500"],
        ["08:30 AM - 10:30 AM", "Skill Training", "₹500"],
        ["04:00 PM - 06:00 PM", "Evening Training", "₹600"],
        ["06:30 PM - 08:30 PM", "Match Practice", "₹700"],
        ["08:30 PM - 10:00 PM", "Night Practice", "₹600"]
    ],

    Chess: [
        ["06:00 AM - 08:00 AM", "Morning Analysis", "₹400"],
        ["08:30 AM - 10:30 AM", "Grandmaster Training", "₹500"],
        ["04:00 PM - 06:00 PM", "Strategy Session", "₹500"],
        ["06:30 PM - 08:30 PM", "Tournament Practice", "₹600"],
        ["08:30 PM - 10:00 PM", "Advanced Analysis", "₹600"]
    ],

    Basketball: [
        ["06:00 AM - 08:00 AM", "Morning Training", "₹500"],
        ["08:30 AM - 10:30 AM", "Skill Training", "₹500"],
        ["04:00 PM - 06:00 PM", "Court Practice", "₹600"],
        ["06:30 PM - 08:30 PM", "Match Practice", "₹700"],
        ["08:30 PM - 10:00 PM", "Night Practice", "₹600"]
    ],

    Volleyball: [
        ["06:00 AM - 08:00 AM", "Morning Practice", "₹500"],
        ["08:30 AM - 10:30 AM", "Skill Training", "₹500"],
        ["04:00 PM - 06:00 PM", "Court Practice", "₹600"],
        ["06:30 PM - 08:30 PM", "Match Practice", "₹700"],
        ["08:30 PM - 10:00 PM", "Night Practice", "₹600"]
    ],

    Swimming: [
        ["06:00 AM - 08:00 AM", "Morning Batch", "₹500"],
        ["08:30 AM - 10:30 AM", "Training Batch", "₹500"],
        ["04:00 PM - 06:00 PM", "Evening Batch", "₹600"],
        ["06:30 PM - 08:30 PM", "Advanced Batch", "₹700"],
        ["08:30 PM - 10:00 PM", "Night Batch", "₹600"]
    ],

    Skating: [
        ["06:00 AM - 08:00 AM", "Morning Batch", "₹500"],
        ["08:30 AM - 10:30 AM", "Skill Training", "₹500"],
        ["04:00 PM - 06:00 PM", "Evening Training", "₹600"],
        ["06:30 PM - 08:30 PM", "Speed Training", "₹700"],
        ["08:30 PM - 10:00 PM", "Night Practice", "₹600"]
    ]

};


// ============================================================
// PAGE NAVIGATION
// ============================================================

function hideAllPages() {

    const pages = [
        "main-page",
        "features-page",
        "slots-page",
        "sport-detail-page",
        "register-page",
        "slot-booking-page"
    ];

    pages.forEach(function(id) {

        const page = document.getElementById(id);

        if (page) {
            page.style.display = "none";
        }

    });
}


// ============================================================
// PAGE ANIMATION
// ============================================================

function animatePage(page) {

    if (!page) return;

    page.classList.remove("page-enter-animation");

    void page.offsetWidth;

    page.classList.add("page-enter-animation");
}


// ============================================================
// SHOW PAGE
// ============================================================

function showPage(pageName) {

    hideAllPages();

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

    let pageId = "";

    if (pageName === "home") {
        pageId = "main-page";
    }

    else if (pageName === "features") {
        pageId = "features-page";
    }

    else if (pageName === "slots") {
        pageId = "slots-page";
    }

    else if (pageName === "register") {
        pageId = "register-page";
    }

    else if (pageName === "sport-detail") {
        pageId = "sport-detail-page";
    }

    else if (pageName === "slot-booking") {
        pageId = "slot-booking-page";
    }

    else {
        return;
    }

    const page = document.getElementById(pageId);

    if (!page) {
        console.error("Page not found:", pageId);
        return;
    }

    if (
        pageId === "register-page" ||
        pageId === "slot-booking-page"
    ) {
        page.style.display = "flex";
    }

    else {
        page.style.display = "block";
    }

    animatePage(page);

    closeDropdown();
    closeMobileNav();

    if (pageName === "register") {
        loadRegistrationPlan();
    }

    if (pageName === "slot-booking") {
        loadUserIntoSlotForm();
    }
}


// ============================================================
// MOBILE NAVIGATION
// ============================================================

function toggleMobileNav() {

    const navList =
        document.getElementById("navList");

    if (!navList) return;

    navList.classList.toggle("mobile-active");
}


function closeMobileNav() {

    const navList =
        document.getElementById("navList");

    if (navList) {
        navList.classList.remove("mobile-active");
    }
}


// ============================================================
// DROPDOWN
// ============================================================

function toggleDropdown(event) {

    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }

    const menu =
        document.getElementById("dropdownMenu");

    const chevron =
        document.getElementById("chevron");

    if (!menu) return;

    menu.classList.toggle("show-menu");

    if (chevron) {
        chevron.classList.toggle("rotate-chevron");
    }
}


function closeDropdown() {

    const menu =
        document.getElementById("dropdownMenu");

    const chevron =
        document.getElementById("chevron");

    if (menu) {
        menu.classList.remove("show-menu");
    }

    if (chevron) {
        chevron.classList.remove("rotate-chevron");
    }
}


document.addEventListener("click", function(event) {

    const dropdown =
        document.querySelector(".dropdown");

    if (
        dropdown &&
        !dropdown.contains(event.target)
    ) {
        closeDropdown();
    }

});


// ============================================================
// SPORTS SLIDER — UPDATED FUNCTION
// ============================================================

function slideCards(direction) {
    const track = document.getElementById("sportsTrack");

    if (!track) {
        console.error("sportsTrack element not found");
        return;
    }

    const cards = track.querySelectorAll(".sport-card");

    if (cards.length === 0) {
        console.error("No sport cards found");
        return;
    }

    let visibleCards = 3;

    if (window.innerWidth <= 768) {
        visibleCards = 1;
    } else if (window.innerWidth <= 992) {
        visibleCards = 2;
    }

    const cardWidth = cards[0].getBoundingClientRect().width;
    const gap = parseFloat(getComputedStyle(track).gap) || 0;
    const step = cardWidth + gap;
    const maxSlide = Math.max(0, cards.length - visibleCards);

    if (direction === "right" || direction === 1) {
        currentSlide = currentSlide >= maxSlide
            ? 0
            : currentSlide + 1;
    } else if (direction === "left" || direction === -1) {
        currentSlide = currentSlide <= 0
            ? maxSlide
            : currentSlide - 1;
    } else {
        return;
    }

    track.style.transform =
        `translateX(-${currentSlide * step}px)`;
}
// ============================================================
// SPORT DETAIL
// ============================================================

function openSportDetail(sport) {

    const key =
        String(sport).toLowerCase();

    const data =
        sportsData[key];

    if (!data) {

        alert("Sport details not found.");

        return;
    }

    currentSport = key;

    hideAllPages();

    const page =
        document.getElementById(
            "sport-detail-page"
        );

    if (!page) return;

    page.style.display = "block";

    const title =
        document.getElementById(
            "sportDetailTitle"
        );

    const tagline =
        document.getElementById(
            "sportDetailTagline"
        );

    const banner =
        document.getElementById(
            "sportHeroBanner"
        );

    if (title) {
        title.textContent = data.title;
    }

    if (tagline) {
        tagline.textContent = data.tagline;
    }

    if (banner) {

        banner.style.backgroundImage =
            "url('" + data.image + "')";
    }


    const facilities =
        document.getElementById(
            "facilitiesGrid"
        );

    if (facilities) {

        facilities.innerHTML = `

            <div class="highlight-box">

                <i class="fa-solid fa-building"></i>

                <h4>Professional Facility</h4>

                <p>
                    Modern ${data.name} training
                    facilities designed for regular
                    practice and athlete development.
                </p>

            </div>


            <div class="highlight-box">

                <i class="fa-solid fa-user-group"></i>

                <h4>Expert Coaching</h4>

                <p>
                    Structured coaching sessions
                    for beginner, intermediate and
                    advanced players.
                </p>

            </div>


            <div class="highlight-box">

                <i class="fa-solid fa-location-dot"></i>

                <h4>Academy Venue</h4>

                <p>
                    ${data.address}
                </p>

            </div>

        `;
    }


    loadCoaches(data.name);

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

    animatePage(page);

    closeDropdown();
    closeMobileNav();
}


// ============================================================
// COACHES
// ============================================================

function loadCoaches(sport) {

    const container =
        document.getElementById(
            "coachesContainer"
        );

    if (!container) return;

    container.innerHTML = `

        <div class="coach-card">

            <img
                class="coach-photo"
                src="https://images.unsplash.com/photo-1560253023-3ec5d502959f?q=80&w=800"
                alt="Sports Coach"
            >

            <div class="coach-info">

                <h3>
                    Senior ${sport} Coach
                </h3>

                <div class="coach-title">
                    Certified Academy Coach
                </div>

                <p>
                    Professional training,
                    technical guidance,
                    fitness development and
                    match preparation.
                </p>

            </div>

        </div>


        <div class="coach-card">

            <img
                class="coach-photo"
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800"
                alt="Academy Coach"
            >

            <div class="coach-info">

                <h3>
                    Advanced ${sport} Trainer
                </h3>

                <div class="coach-title">
                    Performance Coach
                </div>

                <p>
                    Focused coaching programs for
                    skill improvement, competition
                    preparation and athlete progression.
                </p>

            </div>

        </div>

    `;
}


// ============================================================
// SLOT MENU
// ============================================================

function viewSportSlots(sport) {

    const sportName =
        String(sport);

    currentSport =
        sportName;

    const menu =
        document.getElementById(
            "slots-menu-view"
        );

    const display =
        document.getElementById(
            "sport-slots-display"
        );

    if (!menu || !display) return;

    menu.style.display = "none";

    display.style.display = "block";


    const title =
        document.getElementById(
            "currentSportSlotTitle"
        );

    const address =
        document.getElementById(
            "currentSportAddress"
        );

    const data =
        sportsData[
            sportName.toLowerCase()
        ];


    if (title) {

        title.textContent =
            sportName +
            " Academy Slots";
    }


    if (address && data) {

        address.textContent =
            data.address;
    }


    createSlotCards(
        sportName
    );


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

    animatePage(display);
}


// ============================================================
// CREATE SLOT CARDS
// ============================================================

function createSlotCards(sport) {

    const container =
        document.getElementById(
            "slotsContainer"
        );

    if (!container) return;


    const matchingKey =
        Object.keys(slotsDatabase)
            .find(function(item) {

                return (
                    item.toLowerCase() ===
                    String(sport).toLowerCase()
                );

            });


    const slots =
        slotsDatabase[sport] ||
        slotsDatabase[matchingKey] ||
        [];


    container.innerHTML = "";


    slots.forEach(function(slot, index) {

        const card =
            document.createElement("div");

        card.className =
            "slot-card";


        card.innerHTML = `

            <img
                class="slot-thumb"
                src="${getSportImage(sport)}"
                alt="${sport}"
            >


            <span class="slot-badge">
                Available
            </span>


            <div class="slot-body">

                <div>

                    <h3>
                        ${sport} Session ${index + 1}
                    </h3>


                    <p>
                        Professional academy
                        training session.
                    </p>


                    <div class="slot-meta">

                        <span>
                            <i class="fa-solid fa-clock"></i>
                            ${slot[0]}
                        </span>

                        <span>
                            <i class="fa-solid fa-calendar-check"></i>
                            Daily Session
                        </span>

                        <span>
                            <i class="fa-solid fa-location-dot"></i>
                            Academy Ground
                        </span>

                    </div>


                    <div class="slot-price">
                        ${slot[2]} / Session
                    </div>

                </div>


                <button
                    type="button"
                    class="slot-book-btn"
                    onclick="openSlotBooking(
                        '${escapeJS(sport)}',
                        '${escapeJS(slot[0])}',
                        '${escapeJS(slot[2])}'
                    )"
                >
                    Book This Slot
                </button>

            </div>

        `;


        container.appendChild(card);

    });
}


// ============================================================
// SPORT IMAGE
// ============================================================

function getSportImage(sport) {

    const data =
        sportsData[
            String(sport).toLowerCase()
        ];

    return data
        ? data.image
        : "";
}


// ============================================================
// ESCAPE JAVASCRIPT
// ============================================================

function escapeJS(value) {

    return String(value)
        .replace(/\\/g, "\\\\")
        .replace(/'/g, "\\'");
}


// ============================================================
// BACK TO SLOT MENU
// ============================================================

function backToSlotsMenu() {

    const menu =
        document.getElementById(
            "slots-menu-view"
        );

    const display =
        document.getElementById(
            "sport-slots-display"
        );


    if (display) {
        display.style.display = "none";
    }


    if (menu) {
        menu.style.display = "block";
    }


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}
// ============================================================
// SPORTS ACADEMY - COMPLETE JAVASCRIPT
// PART 2
// ============================================================


// ============================================================
// OPEN SLOT BOOKING
// ============================================================

function openSlotBooking(sport, time, amount) {

    selectedSport = String(sport || "");
    selectedAmount = String(amount || "");

    selectedPlan = "";

    currentSport =
        selectedSport.toLowerCase();


    // --------------------------------------------------------
    // Open fresh booking page
    // --------------------------------------------------------

    hideAllPages();

    const page =
        document.getElementById(
            "slot-booking-page"
        );

    if (!page) return;

    page.style.display = "flex";

    animatePage(page);


    // --------------------------------------------------------
    // Fresh booking:
    // Do NOT keep previous user's personal details
    // --------------------------------------------------------

    clearSlotUserFields();


    // --------------------------------------------------------
    // Automatically fill sport
    // --------------------------------------------------------

    setValue(
        "slotSportSelect",
        selectedSport
    );


    // --------------------------------------------------------
    // Automatically fill slot amount
    // --------------------------------------------------------

    setValue(
        "slotAmount",
        selectedAmount
    );


    // --------------------------------------------------------
    // Automatically fill selected time
    // --------------------------------------------------------

    setValue(
        "slotTime",
        time
    );


    // --------------------------------------------------------
    // Automatically fill venue
    // --------------------------------------------------------

    const sportData =
        sportsData[
            selectedSport.toLowerCase()
        ];


    if (sportData) {

        setValue(
            "slotGroundVenue",
            sportData.address
        );

    }

    else {

        setValue(
            "slotGroundVenue",
            "Sports Academy, Pallavaram 200 Feet Radial Rd, Chennai - 600043"
        );

    }


    // --------------------------------------------------------
    // Set today's date
    // --------------------------------------------------------

    const dateInput =
        document.getElementById(
            "slotDate"
        );

    if (dateInput) {

        const today =
            new Date();

        const year =
            today.getFullYear();

        const month =
            String(
                today.getMonth() + 1
            ).padStart(2, "0");

        const day =
            String(
                today.getDate()
            ).padStart(2, "0");


        const todayString =
            `${year}-${month}-${day}`;


        dateInput.min =
            todayString;


        if (!dateInput.value) {
            dateInput.value =
                todayString;
        }

    }


    updateSlotMonth();


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });


    closeDropdown();
    closeMobileNav();
}


// ============================================================
// CLEAR SLOT USER DETAILS
// ============================================================

function clearSlotUserFields() {

    const fields = [
        "slotName",
        "slotGender",
        "slotPhone",
        "slotEmail",
        "slotAddress"
    ];


    fields.forEach(function(id) {

        const element =
            document.getElementById(id);

        if (element) {
            element.value = "";
        }

    });


    // These are booking-specific fields,
    // so they will be filled again by selection.

    const dateInput =
        document.getElementById("slotDate");

    if (dateInput) {
        dateInput.value = "";
    }


    const monthInput =
        document.getElementById("slotMonth");

    if (monthInput) {
        monthInput.value = "";
    }


    const yearInput =
        document.getElementById("slotYear");

    if (yearInput) {
        yearInput.value = "";
    }

}


// ============================================================
// MEMBERSHIP PLAN SELECTION
// ============================================================

function selectMembershipPlan(amount) {

    selectedAmount =
        String(amount || "");


    // --------------------------------------------------------
    // Detect current sport
    // --------------------------------------------------------

    let sport =
        currentSport ||
        selectedSport ||
        "";


    // If current page doesn't have sport,
    // try localStorage.

    if (!sport) {

        sport =
            localStorage.getItem(
                "selectedSport"
            ) || "";

    }


    // Default sport

    if (!sport) {
        sport = "football";
    }


    selectedSport =
        String(sport).toLowerCase();


    // --------------------------------------------------------
    // Detect plan name
    // --------------------------------------------------------

    selectedPlan =
        getPlanFromAmount(
            selectedAmount
        );


    // --------------------------------------------------------
    // Store selected values
    // --------------------------------------------------------

    localStorage.setItem(
        "selectedSport",
        selectedSport
    );

    localStorage.setItem(
        "selectedPlan",
        selectedPlan
    );

    localStorage.setItem(
        "selectedAmount",
        selectedAmount
    );


    // --------------------------------------------------------
    // Open registration page
    // --------------------------------------------------------

    showPage("register");


    // --------------------------------------------------------
    // Fill values AFTER page opens
    // --------------------------------------------------------

    setTimeout(function() {

        setValue(
            "regAmount",
            selectedAmount
        );


        setValue(
            "sport",
            selectedSport
        );


        // If sport field is a select,
        // make sure matching option is selected.

        const sportField =
            document.getElementById(
                "sport"
            );


        if (sportField) {

            sportField.value =
                selectedSport;

        }


        // Update visible plan text if available.

        const selectedPlanText =
            document.getElementById(
                "selectedPlanText"
            );


        if (selectedPlanText) {

            selectedPlanText.textContent =
                selectedPlan;

        }

    }, 50);

}


// ============================================================
// GET PLAN NAME FROM AMOUNT
// ============================================================

function getPlanFromAmount(amount) {

    const value =
        String(amount || "")
            .replace(/,/g, "")
            .replace(/[₹\s]/g, "");


    if (value === "1499") {
        return "Weekly Pass";
    }


    if (value === "4999") {
        return "Monthly Master";
    }


    if (value === "12499") {
        return "Quarterly Pro";
    }


    return "";
}


// ============================================================
// LOAD REGISTRATION PLAN
// ============================================================

function loadRegistrationPlan() {

    const savedSport =
        localStorage.getItem(
            "selectedSport"
        );


    const savedPlan =
        localStorage.getItem(
            "selectedPlan"
        );


    const savedAmount =
        localStorage.getItem(
            "selectedAmount"
        );


    if (savedSport) {

        selectedSport =
            savedSport;

        currentSport =
            savedSport;

        setValue(
            "sport",
            savedSport
        );

    }


    if (savedPlan) {

        selectedPlan =
            savedPlan;

    }


    if (savedAmount) {

        selectedAmount =
            savedAmount;

        setValue(
            "regAmount",
            savedAmount
        );

    }


    // --------------------------------------------------------
    // If amount exists but plan doesn't,
    // automatically determine plan.
    // --------------------------------------------------------

    if (
        selectedAmount &&
        !selectedPlan
    ) {

        selectedPlan =
            getPlanFromAmount(
                selectedAmount
            );

    }


    const planText =
        document.getElementById(
            "selectedPlanText"
        );


    if (
        planText &&
        selectedPlan
    ) {

        planText.textContent =
            selectedPlan;

    }

}


// ============================================================
// GENERIC SET VALUE
// ============================================================

function setValue(id, value) {

    const element =
        document.getElementById(id);

    if (!element) return;

    element.value =
        value == null
            ? ""
            : value;

}


// ============================================================
// REGISTRATION FORM SUBMIT
// ============================================================

function handleRegistrationSubmit(event) {

    if (event) {
        event.preventDefault();
    }


    if (registrationSubmitting) {
        return;
    }


    submitRegistration(event);
}


// ============================================================
// SUBMIT REGISTRATION TO FLASK
// ============================================================

async function submitRegistration(event) {

    if (event) {
        event.preventDefault();
    }


    if (registrationSubmitting) {
        return;
    }


    registrationSubmitting = true;


    const submitButton =
        document.querySelector(
            "#academyRegisterForm button[type='submit']"
        );


    const originalButtonText =
        submitButton
            ? submitButton.textContent
            : "";


    if (submitButton) {

        submitButton.disabled = true;

        submitButton.textContent =
            "Submitting...";

    }


    try {

        // ----------------------------------------------------
        // Read form values
        // ----------------------------------------------------

        const firstName =
            document.getElementById(
                "fname"
            )?.value.trim() || "";


        const lastName =
            document.getElementById(
                "lname"
            )?.value.trim() || "";


        const phone =
            document.getElementById(
                "phone"
            )?.value.trim() || "";


        const email =
            document.getElementById(
                "email"
            )?.value.trim() || "";


        const age =
            document.getElementById(
                "age"
            )?.value || "";


        const gender =
            document.getElementById(
                "gender"
            )?.value || "";


        const qualification =
            document.getElementById(
                "qualification"
            )?.value.trim() || "";


        const amount =
            document.getElementById(
                "regAmount"
            )?.value || selectedAmount;


        const height =
            document.getElementById(
                "height"
            )?.value || "";


        const weight =
            document.getElementById(
                "weight"
            )?.value || "";


        const location =
            document.getElementById(
                "location"
            )?.value.trim() || "";


        const sport =
            document.getElementById(
                "sport"
            )?.value ||
            selectedSport ||
            currentSport ||
            "";


        const experience =
            document.getElementById(
                "experience"
            )?.value.trim() || "";


        const specialReq =
            document.getElementById(
                "special_req"
            )?.value.trim() || "";


        // ----------------------------------------------------
        // Basic validation
        // ----------------------------------------------------

        if (!firstName) {

            alert(
                "Please enter your first name."
            );

            return;
        }


        if (!lastName) {

            alert(
                "Please enter your last name."
            );

            return;
        }


        if (!phone) {

            alert(
                "Please enter your phone number."
            );

            return;
        }


        if (!email) {

            alert(
                "Please enter your email."
            );

            return;
        }


        if (!age) {

            alert(
                "Please enter your age."
            );

            return;
        }


        if (!gender) {

            alert(
                "Please select your gender."
            );

            return;
        }


        if (!sport) {

            alert(
                "Please select a sport."
            );

            return;
        }


        if (!amount) {

            alert(
                "Please select a membership plan."
            );

            return;
        }


        // ----------------------------------------------------
        // Prepare JSON
        // ----------------------------------------------------

        const data = {

            first_name: firstName,

            last_name: lastName,

            phone: phone,

            email: email,

            age: age,

            gender: gender,

            qualification: qualification,

            amount: amount,

            height: height,

            weight: weight,

            location: location,

            sport: sport,

            plan:
                selectedPlan ||
                getPlanFromAmount(amount),

            experience: experience,

            special_req: specialReq

        };


        // ----------------------------------------------------
        // Send to Flask
        // ----------------------------------------------------
        console.log("Registration data:", data);
        data.amount = Number(
    String(data.amount).replace(/[₹,]/g, "").trim()
);

console.log("Clean amount:", data.amount);

        const response =
            await fetch(
                "/register",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify(data)
                }
            );


        const result =
            await response.json();


        if (!response.ok) {

            throw new Error(
                result.error ||
                result.message ||
                "Registration failed."
            );

        }


        // ----------------------------------------------------
        // Registration success
        // ----------------------------------------------------

        currentRegistrationId =
            result.id ||
            result.registration_id ||
            null;


        selectedSport =
            String(sport).toLowerCase();


        selectedAmount =
            amount;


        selectedPlan =
            data.plan;


        currentSport =
            selectedSport;


        // ----------------------------------------------------
        // Store only registration selection.
        // Slot booking will still start fresh.
        // ----------------------------------------------------

        localStorage.setItem(
            "selectedSport",
            selectedSport
        );


        localStorage.setItem(
            "selectedPlan",
            selectedPlan
        );


        localStorage.setItem(
            "selectedAmount",
            selectedAmount
        );


        // Store registration ID separately.

        if (currentRegistrationId) {

            localStorage.setItem(
                "registrationId",
                currentRegistrationId
            );

        }


        // ----------------------------------------------------
        // Success message
        // ----------------------------------------------------

        alert(
            result.message ||
            "Registration successful!"
        );


        // ----------------------------------------------------
        // Reset registration form
        // ----------------------------------------------------

        const form =
            document.getElementById(
                "academyRegisterForm"
            );


        if (form) {
            form.reset();
        }


        // ----------------------------------------------------
        // Keep selected values available
        // ----------------------------------------------------

        selectedSport =
            String(sport).toLowerCase();

        selectedAmount =
            amount;

        selectedPlan =
            data.plan;


        // ----------------------------------------------------
        // Go to home page
        // ----------------------------------------------------

        showPage("home");


    }

    catch (error) {

        console.error(
            "Registration Error:",
            error
        );


        alert(
            "Registration Failed: " +
            error.message
        );

    }

    finally {

        registrationSubmitting = false;


        if (submitButton) {

            submitButton.disabled =
                false;

            submitButton.textContent =
                originalButtonText ||
                "Register Now";

        }

    }

}


// ============================================================
// LOAD USER INTO SLOT FORM
// ============================================================
// NOTE:
// New slot booking intentionally starts with fresh personal
// details. Sport / amount / time / venue are filled by
// openSlotBooking().
// ============================================================

function loadUserIntoSlotForm() {

    // Do not automatically copy old personal information.
    // This prevents old user details from appearing in a new
    // booking.

    return;

}


// ============================================================
// UPDATE SLOT MONTH / YEAR
// ============================================================

function updateSlotMonth() {

    const dateInput =
        document.getElementById(
            "slotDate"
        );


    if (!dateInput) return;


    const dateValue =
        dateInput.value;


    if (!dateValue) {
        return;
    }


    const date =
        new Date(
            dateValue + "T00:00:00"
        );


    if (isNaN(date.getTime())) {
        return;
    }


    const monthNames = [

        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"

    ];


    setValue(
        "slotMonth",
        monthNames[
            date.getMonth()
        ]
    );


    setValue(
        "slotYear",
        date.getFullYear()
    );

}


// ============================================================
// DATE CHANGE LISTENER
// ============================================================

document.addEventListener(
    "change",
    function(event) {

        if (
            event.target &&
            event.target.id === "slotDate"
        ) {

            updateSlotMonth();

        }

    }
);


// ============================================================
// SLOT BOOKING FORM SUBMIT
// ============================================================

function handleSlotRegisterSubmit(event) {

    if (event) {
        event.preventDefault();
    }


    if (slotBookingSubmitting) {
        return;
    }


    submitSlotBooking(event);
}


// ============================================================
// SUBMIT SLOT BOOKING TO FLASK
// ============================================================

async function submitSlotBooking(event) {

    if (event) {
        event.preventDefault();
    }


    if (slotBookingSubmitting) {
        return;
    }


    slotBookingSubmitting = true;


    const submitButton =
        document.querySelector(
            "#slotBookingForm button[type='submit']"
        );


    const originalButtonText =
        submitButton
            ? submitButton.textContent
            : "";


    if (submitButton) {

        submitButton.disabled = true;

        submitButton.textContent =
            "Booking...";

    }


    try {

        // ----------------------------------------------------
        // Read values
        // ----------------------------------------------------

        const name =
            document.getElementById(
                "slotName"
            )?.value.trim() || "";


        const gender =
            document.getElementById(
                "slotGender"
            )?.value || "";


        const sport =
            document.getElementById(
                "slotSportSelect"
            )?.value.trim() ||
            selectedSport ||
            "";


        const amount =
            document.getElementById(
                "slotAmount"
            )?.value ||
            selectedAmount ||
            "";


        const venue =
            document.getElementById(
                "slotGroundVenue"
            )?.value.trim() || "";


        const bookingDate =
            document.getElementById(
                "slotDate"
            )?.value || "";


        const bookingTime =
            document.getElementById(
                "slotTime"
            )?.value || "";


        const monthName =
            document.getElementById(
                "slotMonth"
            )?.value || "";


        const bookingYear =
            document.getElementById(
                "slotYear"
            )?.value || "";


        const phone =
            document.getElementById(
                "slotPhone"
            )?.value.trim() || "";


        const email =
            document.getElementById(
                "slotEmail"
            )?.value.trim() || "";


        const address =
            document.getElementById(
                "slotAddress"
            )?.value.trim() || "";


        // ----------------------------------------------------
        // Validation
        // ----------------------------------------------------

        if (!name) {

            alert(
                "Please enter your name."
            );

            return;
        }


        if (!gender) {

            alert(
                "Please select your gender."
            );

            return;
        }


        if (!sport) {

            alert(
                "Sport is missing. Please select a slot again."
            );

            return;
        }


        if (!amount) {

            alert(
                "Slot amount is missing."
            );

            return;
        }


        if (!bookingDate) {

            alert(
                "Please select booking date."
            );

            return;
        }


        if (!bookingTime) {

            alert(
                "Booking time is missing."
            );

            return;
        }


        if (!phone) {

            alert(
                "Please enter your phone number."
            );

            return;
        }


        if (!email) {

            alert(
                "Please enter your email."
            );

            return;
        }


        // ----------------------------------------------------
        // Automatically calculate month/year
        // ----------------------------------------------------

        if (!monthName || !bookingYear) {

            const date =
                new Date(
                    bookingDate +
                    "T00:00:00"
                );


            if (!isNaN(date.getTime())) {

                const monthNames = [

                    "January",
                    "February",
                    "March",
                    "April",
                    "May",
                    "June",
                    "July",
                    "August",
                    "September",
                    "October",
                    "November",
                    "December"

                ];


                const finalMonth =
                    monthNames[
                        date.getMonth()
                    ];


                const finalYear =
                    date.getFullYear();


                setValue(
                    "slotMonth",
                    finalMonth
                );


                setValue(
                    "slotYear",
                    finalYear
                );

            }

        }


        // ----------------------------------------------------
        // Prepare booking data
        // ----------------------------------------------------

        const data = {

            name: name,

            gender: gender,

            sport: sport,

            plan:
                selectedPlan ||
                getPlanFromAmount(amount),

            amount: amount,

            venue: venue,

            booking_date:
                bookingDate,

            booking_time:
                bookingTime,

            month_name:
                document.getElementById(
                    "slotMonth"
                )?.value || monthName,

            booking_year:
                document.getElementById(
                    "slotYear"
                )?.value || bookingYear,

            phone: phone,

            email: email,

            address: address

        };


        // ----------------------------------------------------
        // Send to Flask
        // ----------------------------------------------------
        console.log("Registration data:", data);
        data.amount = Number(
    String(data.amount).replace(/[₹,]/g, "").trim()
);

console.log("Clean amount:", data.amount);

        const response =
            await fetch(
                "/slot-book",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify(data)
                }
            );


        const result =
            await response.json();


        if (!response.ok) {

            throw new Error(
                result.error ||
                result.message ||
                "Slot booking failed."
            );

        }


        // ----------------------------------------------------
        // Success
        // ----------------------------------------------------

        alert(
            result.message ||
            "Slot booked successfully!"
        );


        // ----------------------------------------------------
        // Reset form
        // ----------------------------------------------------

        const form =
            document.getElementById(
                "slotBookingForm"
            );


        if (form) {
            form.reset();
        }


        // ----------------------------------------------------
        // Clear selected booking data
        // ----------------------------------------------------

        selectedSport = "";
        selectedPlan = "";
        selectedAmount = "";
        currentSport = "";
        currentRegistrationId = null;


        localStorage.removeItem(
            "selectedSport"
        );

        localStorage.removeItem(
            "selectedPlan"
        );

        localStorage.removeItem(
            "selectedAmount"
        );

        localStorage.removeItem(
            "registrationId"
        );


        // ----------------------------------------------------
        // Go back to slots page
        // ----------------------------------------------------

        showPage("slots");


        // Make sure slot menu is visible.

        const slotMenu =
            document.getElementById(
                "slots-menu-view"
            );

        const slotDisplay =
            document.getElementById(
                "sport-slots-display"
            );


        if (slotMenu) {
            slotMenu.style.display = "block";
        }


        if (slotDisplay) {
            slotDisplay.style.display = "none";
        }

    }

    catch (error) {

        console.error(
            "Slot Booking Error:",
            error
        );


        alert(
            "Slot Booking Failed: " +
            error.message
        );

    }

    finally {

        slotBookingSubmitting =
            false;


        if (submitButton) {

            submitButton.disabled =
                false;

            submitButton.textContent =
                originalButtonText ||
                "Book Slot";

        }

    }

}
// ============================================================
// SPORTS ACADEMY - COMPLETE JAVASCRIPT
// PART 3 - AI ASSISTANT + DATE + INITIALIZATION
// ============================================================


// ============================================================
// AI CHAT - OPEN / CLOSE
// ============================================================

function toggleAIChat() {
    const chat = document.getElementById("aiChatBox");

    if (!chat) {
        console.error("AI Chat Box not found!");
        return;
    }

    if (chat.classList.contains("open-chat")) {
        chat.classList.remove("open-chat");
    } else {
        chat.classList.add("open-chat");
    }
}


// ============================================================
// AI CHAT - ENTER KEY
// ============================================================

function handleAIPressKey(event) {

    if (!event) return;

    if (
        event.key === "Enter" &&
        !event.shiftKey
    ) {

        event.preventDefault();

        sendAIMessage();

    }

}


// ============================================================
// SEND AI MESSAGE
// ============================================================

function sendAIMessage() {

    const input =
        document.getElementById(
            "aiUserInput"
        );


    const chatBody =
        document.getElementById(
            "aiChatBody"
        );


    if (!input || !chatBody) {
        return;
    }


    const message =
        input.value.trim();


    if (!message) {
        return;
    }


    // --------------------------------------------------------
    // User message
    // --------------------------------------------------------

    const userMessage =
        document.createElement("div");


    userMessage.className =
        "ai-message user-message";


    userMessage.innerHTML =
        escapeHTML(message);


    chatBody.appendChild(
        userMessage
    );


    input.value = "";


    // --------------------------------------------------------
    // Scroll down
    // --------------------------------------------------------

    chatBody.scrollTop =
        chatBody.scrollHeight;


    // --------------------------------------------------------
    // Typing indicator
    // --------------------------------------------------------

    const typing =
        document.createElement("div");


    typing.className =
        "ai-message bot-message";


    typing.id =
        "aiTypingIndicator";


    typing.innerHTML =
        `<span class="ai-typing">
            Typing...
        </span>`;


    chatBody.appendChild(
        typing
    );


    chatBody.scrollTop =
        chatBody.scrollHeight;


    // --------------------------------------------------------
    // Generate reply
    // --------------------------------------------------------

    setTimeout(function() {

        const typingElement =
            document.getElementById(
                "aiTypingIndicator"
            );


        if (typingElement) {
            typingElement.remove();
        }


        const reply =
            getAIReply(message);


        const botMessage =
            document.createElement("div");


        botMessage.className =
            "ai-message bot-message";


        botMessage.innerHTML =
            escapeHTML(reply)
                .replace(/\n/g, "<br>");


        chatBody.appendChild(
            botMessage
        );


        chatBody.scrollTop =
            chatBody.scrollHeight;


    }, 500);

}


// ============================================================
// AI REPLY
// ============================================================
// This is a local predefined assistant.
// It does NOT call OpenAI / ChatGPT API.
// ============================================================

function getAIReply(message) {

    const text =
        String(message || "")
            .toLowerCase()
            .trim();


    // --------------------------------------------------------
    // Hello
    // --------------------------------------------------------

    if (
        text.includes("hello") ||
        text.includes("hi") ||
        text.includes("hey") ||
        text.includes("vanakkam")
    ) {

        return (
            "Hi! 👋 Welcome to Sports Academy.\n\n" +
            "I can help you with:\n" +
            "• Sports\n" +
            "• Membership plans\n" +
            "• Registration\n" +
            "• Slot booking\n" +
            "• Training information"
        );

    }


    // --------------------------------------------------------
    // Registration
    // --------------------------------------------------------

    if (
        text.includes("register") ||
        text.includes("registration") ||
        text.includes("join") ||
        text.includes("admission")
    ) {

        return (
            "Registration is easy! 📝\n\n" +
            "1. Open the Register Now page.\n" +
            "2. Select your sport.\n" +
            "3. Select a membership plan.\n" +
            "4. Enter your details.\n" +
            "5. Submit the registration form.\n\n" +
            "The selected sport and plan amount will be filled automatically."
        );

    }


    // --------------------------------------------------------
    // Slot
    // --------------------------------------------------------

    if (
        text.includes("slot") ||
        text.includes("booking") ||
        text.includes("book")
    ) {

        return (
            "You can book a sports training slot from the Slots section. 🏟️\n\n" +
            "Choose a sport → choose a session → click Book This Slot.\n\n" +
            "Sport, amount, time and venue will be filled automatically."
        );

    }


    // --------------------------------------------------------
    // Fees
    // --------------------------------------------------------

    if (
        text.includes("fee") ||
        text.includes("fees") ||
        text.includes("price") ||
        text.includes("cost") ||
        text.includes("amount")
    ) {

        return (
            "Our current membership plans are:\n\n" +
            "Weekly Pass - ₹1,499\n" +
            "Monthly Master - ₹4,999\n" +
            "Quarterly Pro - ₹12,499\n\n" +
            "Select a plan to automatically fill the registration amount."
        );

    }


    // --------------------------------------------------------
    // Football
    // --------------------------------------------------------

    if (
        text.includes("football")
    ) {

        return (
            "⚽ Football Academy offers structured training, " +
            "skill development, fitness sessions and match practice."
        );

    }


    // --------------------------------------------------------
    // Cricket
    // --------------------------------------------------------

    if (
        text.includes("cricket")
    ) {

        return (
            "🏏 Cricket Academy provides batting, bowling, " +
            "fielding and match-practice sessions."
        );

    }


    // --------------------------------------------------------
    // Basketball
    // --------------------------------------------------------

    if (
        text.includes("basketball")
    ) {

        return (
            "🏀 Basketball training includes skill development, " +
            "court practice, fitness and match preparation."
        );

    }


    // --------------------------------------------------------
    // Volleyball
    // --------------------------------------------------------

    if (
        text.includes("volleyball")
    ) {

        return (
            "🏐 Volleyball training includes serving, passing, " +
            "attacking, defence and match practice."
        );

    }


    // --------------------------------------------------------
    // Swimming
    // --------------------------------------------------------

    if (
        text.includes("swimming") ||
        text.includes("pool")
    ) {

        return (
            "🏊 Swimming sessions are available in different " +
            "training batches for skill development and fitness."
        );

    }


    // --------------------------------------------------------
    // Skating
    // --------------------------------------------------------

    if (
        text.includes("skating")
    ) {

        return (
            "⛸️ Skating training includes balance, speed, " +
            "technique and performance development."
        );

    }


    // --------------------------------------------------------
    // Chess
    // --------------------------------------------------------

    if (
        text.includes("chess")
    ) {

        return (
            "♟️ Chess training focuses on strategy, tactics, " +
            "game analysis and tournament preparation."
        );

    }


    // --------------------------------------------------------
    // Location
    // --------------------------------------------------------

    if (
        text.includes("location") ||
        text.includes("address") ||
        text.includes("where")
    ) {

        return (
            "📍 Sports Academy is located at:\n\n" +
            "Pallavaram 200 Feet Radial Rd,\n" +
            "Chennai - 600043."
        );

    }


    // --------------------------------------------------------
    // Coach
    // --------------------------------------------------------

    if (
        text.includes("coach") ||
        text.includes("trainer")
    ) {

        return (
            "Our academy provides structured coaching " +
            "with experienced trainers and sport-specific " +
            "training programs."
        );

    }


    // --------------------------------------------------------
    // Help
    // --------------------------------------------------------

    if (
        text.includes("help") ||
        text.includes("what can you do")
    ) {

        return (
            "I can help you with:\n\n" +
            "⚽ Sports information\n" +
            "💳 Membership fees\n" +
            "📝 Registration\n" +
            "🏟️ Slot booking\n" +
            "📍 Academy location\n" +
            "👨‍🏫 Coaching information"
        );

    }


    // --------------------------------------------------------
    // Default
    // --------------------------------------------------------

    return (
        "Sorry, I didn't understand that. 😊\n\n" +
        "Try asking about sports, registration, " +
        "membership fees, slot booking or academy location."
    );

}


// ============================================================
// ESCAPE HTML
// ============================================================

function escapeHTML(value) {

    return String(value || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


// ============================================================
// SETUP DATE INPUT
// ============================================================

function setupDateInput() {

    const dateInput =
        document.getElementById(
            "slotDate"
        );


    if (!dateInput) {
        return;
    }


    const today =
        new Date();


    const year =
        today.getFullYear();


    const month =
        String(
            today.getMonth() + 1
        ).padStart(2, "0");


    const day =
        String(
            today.getDate()
        ).padStart(2, "0");


    const todayString =
        `${year}-${month}-${day}`;


    dateInput.min =
        todayString;


    // --------------------------------------------------------
    // Update month/year whenever date changes
    // --------------------------------------------------------

    dateInput.addEventListener(
        "change",
        function() {

            updateSlotMonth();

        }
    );

}


// ============================================================
// RESIZE HANDLER
// ============================================================

window.addEventListener(
    "resize",
    function() {

        const track =
            document.getElementById(
                "sportsTrack"
            );


        if (!track) {
            return;
        }


        currentSlide = 0;

        track.style.transform =
            "translateX(0)";

    }
);


// ============================================================
// ESC KEY
// ============================================================

document.addEventListener(
    "keydown",
    function(event) {

        if (
            event.key === "Escape"
        ) {

            closeDropdown();
            closeMobileNav();

        }

    }
);


// ============================================================
// DOM CONTENT LOADED
// ============================================================

document.addEventListener(
    "DOMContentLoaded",
    function() {

        console.log(
            "Sports Academy JavaScript Loaded Successfully"
        );


        // ----------------------------------------------------
        // Setup date
        // ----------------------------------------------------

        setupDateInput();


        // ----------------------------------------------------
        // Registration plan
        // ----------------------------------------------------

        loadRegistrationPlan();


        // ----------------------------------------------------
        // Fresh slot booking fields
        // ----------------------------------------------------

        clearSlotUserFields();


        // ----------------------------------------------------
        // Hide all pages first
        // ----------------------------------------------------

        hideAllPages();


        // ----------------------------------------------------
        // Show home page
        // ----------------------------------------------------

        const home =
            document.getElementById(
                "main-page"
            );


        if (home) {

            home.style.display =
                "block";

        }


        // ----------------------------------------------------
        // Registration form
        // ----------------------------------------------------

        const registrationForm =
            document.getElementById(
                "academyRegisterForm"
            );


        if (registrationForm) {

            registrationForm.addEventListener(
                "submit",
                handleRegistrationSubmit
            );

        }


        // ----------------------------------------------------
        // Slot booking form
        // ----------------------------------------------------

        const slotForm =
            document.getElementById(
                "slotBookingForm"
            );


        if (slotForm) {

            slotForm.addEventListener(
                "submit",
                handleSlotRegisterSubmit
            );

        }


        // ----------------------------------------------------
        // Mobile nav links
        // ----------------------------------------------------

        const navList =
            document.getElementById(
                "navList"
            );


        if (navList) {

            navList
                .querySelectorAll("a")
                .forEach(function(link) {

                    link.addEventListener(
                        "click",
                        function() {

                            closeMobileNav();

                        }
                    );

                });

        }


        // ----------------------------------------------------
        // AI input
        // ----------------------------------------------------

        const aiInput =
            document.getElementById(
                "aiUserInput"
            );


        if (aiInput) {

            aiInput.addEventListener(
                "keydown",
                handleAIPressKey
            );

        }


        // ----------------------------------------------------
        // Close AI chat when clicking outside
        // ----------------------------------------------------

        document.addEventListener(
            "click",
            function(event) {

                const chatBox =
                    document.getElementById(
                        "aiChatBox"
                    );


                const aiTrigger =
                    document.querySelector(
                        ".ai-trigger"
                    );


                if (
                    !chatBox ||
                    !chatBox.classList.contains(
                        "active"
                    )
                ) {

                    return;

                }


                if (
                    !chatBox.contains(
                        event.target
                    ) &&
                    !(
                        aiTrigger &&
                        aiTrigger.contains(
                            event.target
                        )
                    )
                ) {

                    chatBox.classList.remove(
                        "active"
                    );

                }

            }
        );


        // ----------------------------------------------------
        // Prevent accidental double form submission
        // ----------------------------------------------------

        window.registrationSubmitting =
            false;

        window.slotBookingSubmitting =
            false;


    }
);


// ============================================================
// PAGE LOAD SAFETY
// ============================================================

window.addEventListener(
    "load",
    function() {

        // Make sure home page is visible
        // if no page is currently visible.

        const home =
            document.getElementById(
                "main-page"
            );


        const visiblePage =
            document.querySelector(
                "#main-page[style*='display: block'], " +
                "#features-page[style*='display: block'], " +
                "#slots-page[style*='display: block'], " +
                "#sport-detail-page[style*='display: block'], " +
                "#register-page[style*='display: flex'], " +
                "#slot-booking-page[style*='display: flex']"
            );


        if (
            home &&
            !visiblePage
        ) {

            home.style.display =
                "block";

        }

    }
);

/* =========================================================
   script.js
   END OF FILE LA PASTE PANNU
   ========================================================= */

function showRegistrationReceipt(data, registrationId) {

    const overlay = document.getElementById(
        "registrationReceiptOverlay"
    );

    const content = document.getElementById(
        "registrationReceiptContent"
    );

    if (!overlay || !content) {
        return;
    }

    const details = [
        ["Registration ID", registrationId],
        [
            "Name",
            `${data.first_name || ""} ${data.last_name || ""}`
        ],
        ["Phone", data.phone || ""],
        ["Email", data.email || ""],
        ["Age", data.age || ""],
        ["Gender", data.gender || ""],
        ["Qualification", data.qualification || ""],
        ["Sport", data.sport || ""],
        ["Plan", data.plan || "-"],
        ["Amount", data.amount || ""],
        ["Height", data.height || "-"],
        ["Weight", data.weight || "-"],
        ["Location", data.location || ""],
        ["Experience", data.experience || "-"],
        ["Special Request", data.special_req || "-"]
    ];

    content.innerHTML = details.map(item => {

        return `
            <div class="registration-detail-row">

                <div class="registration-detail-label">
                    ${escapeReceiptHTML(item[0])}
                </div>

                <div class="registration-detail-value">
                    ${escapeReceiptHTML(item[1])}
                </div>

            </div>
        `;

    }).join("");

    overlay.classList.add("active");
}


function escapeReceiptHTML(value) {

    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


function closeRegistrationReceipt() {

    const overlay = document.getElementById(
        "registrationReceiptOverlay"
    );

    if (overlay) {
        overlay.classList.remove("active");
    }
}


function printRegistrationReceipt() {

    window.print();
}


/* =========================================================
   EXISTING REGISTRATION SUCCESS RESPONSE
   =========================================================

   UNGA EXISTING handleRegistrationSubmit()
   / submitRegistration() SUCCESS BLOCK-LA

   OLD:

   alert("Registration completed successfully");

   ITHA REPLACE PANNU:
   ========================================================= */

async function showRegistrationSuccessFromResponse(
    response,
    formData
) {

    if (!response || !response.success) {
        alert(
            response?.message ||
            "Registration failed"
        );
        return;
    }

    showRegistrationReceipt(
        formData,
        response.registration_id
    );

    if (response.email_sent) {

        console.log(
            "A4 registration photo sent to email successfully."
        );

    } else {

        console.log(
            "Registration saved, but email was not sent:",
            response.email_message
        );
    }
}
// ============================================================
// FINAL PAGE NAVIGATION FIX
// ============================================================

function showPage(pageName) {

    const pages = [
        "main-page",
        "features-page",
        "slots-page",
        "sport-detail-page",
        "register-page",
        "slot-booking-page"
    ];

    pages.forEach(function(id) {
        const page = document.getElementById(id);

        if (page) {
            page.style.display = "none";
            page.classList.remove("page-enter-animation");
        }
    });

    let pageId = "";

    if (pageName === "home") {
        pageId = "main-page";
    }
    else if (pageName === "features") {
        pageId = "features-page";
    }
    else if (pageName === "slots") {
        pageId = "slots-page";
    }
    else if (pageName === "register") {
        pageId = "register-page";
    }
    else if (pageName === "sport-detail") {
        pageId = "sport-detail-page";
    }
    else if (pageName === "slot-booking") {
        pageId = "slot-booking-page";
    }

    if (!pageId) {
        console.error("Unknown page:", pageName);
        return;
    }

    const page = document.getElementById(pageId);

    if (!page) {
        console.error("Page not found:", pageId);
        return;
    }

    if (
        pageId === "register-page" ||
        pageId === "slot-booking-page"
    ) {
        page.style.display = "flex";
    }
    else {
        page.style.display = "block";
    }

    page.classList.add("page-enter-animation");

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

    if (pageName === "register") {
        if (typeof loadRegistrationPlan === "function") {
            loadRegistrationPlan();
        }
    }

    if (pageName === "slot-booking") {
        if (typeof loadUserIntoSlotForm === "function") {
            loadUserIntoSlotForm();
        }
    }
}


// ============================================================
// FINAL AI FIX
// ============================================================

function toggleAIChat() {
    const chat = document.getElementById("aiChatBox");

    if (!chat) {
        console.error("AI Chat Box not found! Check the HTML ID.");
        return;
    }

    chat.classList.toggle("open-chat");
}


// ============================================================
// INITIAL PAGE
// ============================================================

document.addEventListener("DOMContentLoaded", function() {

    const pages = [
        "main-page",
        "features-page",
        "slots-page",
        "sport-detail-page",
        "register-page",
        "slot-booking-page"
    ];

    pages.forEach(function(id) {

        const page = document.getElementById(id);

        if (page) {
            page.style.display = "none";
        }

    });

    const home = document.getElementById("main-page");

    if (home) {
        home.style.display = "block";
        home.classList.add("page-enter-animation");
    }

});

// ============================================================
// END OF SPORTS ACADEMY JAVASCRIPT
// ============================================================