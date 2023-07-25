// Makes elements hidden
const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        console.log(entry)
        if (entry.isIntersecting) {
            entry.target.classList.add('show');
        } else {
            entry.target.classList.remove('show');
        }
    })
})
const hiddenElements = document.querySelectorAll('.hidden');
hiddenElements.forEach((e1) => observer.observe(e1));



// Get all elements with the class "popup-trigger"
const popupTriggers = document.querySelectorAll('.popup-trigger');

// Get all elements with the class "popup-section"
const popupSections = document.querySelectorAll('.popup-section');

// Function to hide all pop-up sections
function hideAllPopups() {
    popupSections.forEach(popupSection => {
        popupSection.style.display = 'none';
        popupSection.style.opacity = 0;
    });
}

// Function to toggle the pop-up section
function togglePopup(event) {
    // Get the target ID from the data attribute
    const targetId = event.target.dataset.target;
    // Get the pop-up section element based on the target ID
    const popupSection = document.getElementById(targetId);

    // Hide all pop-up sections before showing the clicked one
    hideAllPopups();

    // Toggle the visibility of the pop-up section
    if (popupSection.style.display === 'block') {
        popupSection.style.opacity = 0; // Set opacity to 0 to start the fade-out effect
        setTimeout(() => {
            popupSection.style.display = 'none'; // Hide the pop-up section after the fade-out effect completes
        }, 500); // Wait for 500 milliseconds (0.5 seconds) for the fade-out to complete
    } else {
        popupSection.style.display = 'block'; // Show the pop-up section
        popupSection.style.opacity = 1; // Set opacity to 1 to start the fade-in effect
    }
}

// Hide all pop-up sections initially
hideAllPopups();

// Add click event listeners to all "popup-trigger" elements
popupTriggers.forEach(trigger => {
    trigger.addEventListener('click', togglePopup);
});

// Add a scroll event listener to the window object
window.addEventListener('scroll', function () {
    // Hide all pop-up sections when the user scrolls
    popupSections.forEach(popupSection => {
        if (popupSection.style.display === 'block') {
            popupSection.style.opacity = 0; // Set opacity to 0 to start the fade-out effect
            setTimeout(() => {
                popupSection.style.display = 'none'; // Hide the pop-up section after the fade-out effect completes
            }, 1000); // Wait for 1000 milliseconds (1 second) for the fade-out to complete
        }
    });
});


// Function to check if the user has reached the bottom of the page
function isBottomReached() {
    return window.innerHeight + window.scrollY >= document.documentElement.scrollHeight;
}

// Function to show or hide the "Last Updated" text based on scroll position
function toggleLastUpdatedText() {
    const lastUpdatedText = document.getElementById('last-updated');

    if (isBottomReached()) {
        lastUpdatedText.style.opacity = 1; // Show the text when at the bottom
    } else {
        lastUpdatedText.style.opacity = 0; // Hide the text when not at the bottom
    }
}

// Check and show/hide "Last Updated" text on initial load and on scroll
window.addEventListener('scroll', toggleLastUpdatedText);



