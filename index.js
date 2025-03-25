document.addEventListener("DOMContentLoaded", () => {
  const eventList = document.getElementById("event-list");
  const searchInput = document.getElementById("search");

  // Modal elements
  const modal = document.getElementById("event-modal");
  const closeModalBtn = document.querySelector(".close");
  const eventTitle = document.getElementById("event-title");
  const eventDescription = document.getElementById("event-description");
  const eventTime = document.getElementById("event-time");
  const eventLocation = document.getElementById("event-location");
  const eventPrice = document.getElementById("event-price");
  const rsvpBtn = document.getElementById("rsvp-btn");

  const API_URL = "http://localhost:3000/events";

  function fetchEvents() {
    fetch(API_URL)
      .then((response) => response.json())
      .then((events) => displayEventList(events))
      .catch((error) =>
        console.error("Error while fetching the events", error)
      );
  }

  function displayEventList(events) {
    eventList.innerHTML = ""; // clears the elements
    events.forEach((event) => {
      const eventCard = document.createElement("div");
      eventCard.classList.add("event-card");
      eventCard.dataset.id = event.id; // Store ID in dataset
      eventCard.innerHTML = `
              <h3>${event.name}</h3>
              <p>${event.date} - ${event.location}</p>
          `;
      eventList.appendChild(eventCard);
    });
  }

  // Open modal when clicking an event
  eventList.addEventListener("click", (e) => {
    // finds the nearest ancestor with the .event-card class.
    if (e.target.closest(".event-card")) {
      const eventId = e.target.closest(".event-card").dataset.id; // Gets the event's unique ID from the data-id attribute of .event-card.
      fetchEventDetails(eventId);
    }
  });

  // Fetch and display event details in modal
  function fetchEventDetails(eventId) {
    const url = `${API_URL}/${eventId}`;
    console.log("Fetching event details from:", fetch(url)); // Debugging
    fetch(url)
      .then((response) => response.json())
      .then((event) => {
        eventTitle.textContent = event.name;
        eventDescription.textContent =event.description || "No description available.";
        eventTime.textContent = event.date;
        eventLocation.textContent = event.location;
        eventPrice.textContent = event.price ? `$${event.price}` : "Free";
        rsvpBtn.dataset.id = event.id; // Store event ID in RSVP button
        modal.style.display = "block";
      });
  }

  // Close modal functionality
  closeModalBtn.addEventListener("click", () => {
    modal.style.display = "none";
  });
  
  // Listens for any click anywhere on the page.
  window.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.style.display = "none";
    }
  });

  fetchEvents();
});
