document.addEventListener("DOMContentLoaded", () => {
  const eventList = document.getElementById("event-list");
  const searchInput = document.getElementById("search");
  const categorySelect = document.getElementById("category");

  // Modal elements
  const modal = document.getElementById("event-modal");
  const closeModalBtn = document.querySelector(".close");
  const eventTitle = document.getElementById("event-title");
  const eventDescription = document.getElementById("event-description");
  const eventTime = document.getElementById("event-time");
  const eventLocation = document.getElementById("event-location");
  const eventPrice = document.getElementById("event-price");
  const rsvpBtn = document.getElementById("rsvp-btn");

  // const API_URL = "https://api.jsonbin.io/v3/b/67e2faab8960c979a5783b13";// old url
  const API_URL = "https://api.jsonbin.io/v3/b/67e531888561e97a50f3da25"; // new url with img_url key

  const loadingMessage = document.createElement("p");
  loadingMessage.textContent = "Loading Events...";
  eventList.appendChild(loadingMessage);

  function fetchEvents() {
    setTimeout(() => {
      fetch(API_URL)
        .then((response) => response.json())
        .then((data) => {
          const events = data.record.events; // Extracting only the events array
          displayEventList(events); // Call your function with the correct array
        })
        .catch((error) =>
          console.error("Error while fetching the events:", error)
        );
    }, 1000);
  }

  function displayEventList(events) {
    eventList.innerHTML = ""; // clears the elements
    events.forEach((event, index) => {
      const eventCard = document.createElement("div");
      eventCard.classList.add("event-card", "animate__animated", "animate__fadeInUp");
      eventCard.style.animationDelay = `${index * 0.2}s`; // Staggered effect
      eventCard.dataset.id = event.id; // Store ID in dataset
      eventCard.innerHTML = `
              <img src="${event.img_url}" alt="">
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

  function fetchEventDetails(eventId) {
    fetch(API_URL) // Fetch entire data
      .then((response) => response.json())
      .then((data) => {
        const events = data.record.events; // Access events array
        const event = events.find((event) => event.id == eventId); // Find event by ID
        // console.log("Fetched Event Details:", event); debugging

        // Update modal with event details
        eventTitle.textContent = event.name;
        eventDescription.textContent =
        event.description || "No description available.";
        eventTime.textContent = event.date;
        eventLocation.textContent = event.location;
        eventPrice.textContent = event.price ? `$${event.price}` : "Free";
        rsvpBtn.dataset.id = event.id; // Store event ID in RSVP button
        modal.style.display = "block";
      })
      .catch((error) => console.error("Error fetching event details:", error));
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

  // RSVP functionality
  rsvpBtn.addEventListener("click", () => {
    const eventId = rsvpBtn.dataset.id;
    rsvpToEvent(eventId);
  });

  function rsvpToEvent(eventId) {
    fetch(API_URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        let record = data.record; // Access the record object
        let event = record.events.find((event) => event.id === eventId);
        //console.log(event)
        if (!event) {
          alert("Event not found!");
          return;
        }
        event.rsvp = true; // Update RSVP field
        // Send the updated record back to jsonbin.io
        return fetch(API_URL, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "X-Bin-Versioning": "false", // Disables version control
          },
          body: JSON.stringify({ record }), // Send the entire record
        });
      })
      .then(response => response.json())
      .then((updatedData) => {
        // console.log("Updated data response from jsonbin.io:", updatedData); // debugging
        alert("🎉 RSVP confirmed!");
      })
      .catch((error) => console.error("Error RSVPing:", error));
  }

  function fetchAndFilterEvents() {
    const searchTerm = searchInput.value.toLowerCase();
    const selectedCategory = categorySelect.value;

    fetch(API_URL)
      .then((response) => response.json())
      .then((data) => {
        const events = data.record.events; //  Correctly access the array
        const filteredEvents = events.filter((event) => {
          const matchesName = event.name.toLowerCase().includes(searchTerm);
          const matchesCategory = selectedCategory === "all" || event.category.toLowerCase() === selectedCategory;
          return matchesName && matchesCategory;
        });
        displayEventList(filteredEvents);
      })
      .catch((error) => console.error("Error fetching events:", error));
  }

  // Event listeners
searchInput.addEventListener("input", fetchAndFilterEvents);
categorySelect.addEventListener("change", fetchAndFilterEvents);

fetchEvents();
});
