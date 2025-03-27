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
  
    const API_URL = "http://localhost:3000/events";

    const loadingMessage = document.createElement('p');
    loadingMessage.textContent = 'Loading Events...';
    eventList.appendChild(loadingMessage);

  
    function fetchEvents() {
      setTimeout(() => {
        fetch(API_URL)
        .then((response) => response.json())
        .then((events) => displayEventList(events))
        .catch((error) =>
          console.error("Error while fetching the events", error)
        );
      }, 1000)
    }
  
    function displayEventList(events) {
      eventList.innerHTML = ""; // clears the elements
      events.forEach((event) => {
        const eventCard = document.createElement("div");
        eventCard.classList.add("event-card", "animate__animated", "animate__fadeInUp");
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
  
    // Fetch and display event details in modal
    function fetchEventDetails(eventId) {
      const url = `${API_URL}/${eventId}`;
     // console.log("Fetching event details from:", fetch(url)); // Debugging
      fetch(url)
        .then((response) => response.json())
        .then((event) => {
          eventTitle.textContent = event.name;
          eventDescription.textContent = event.description || "No description available.";
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
  
    // RSVP functionality
    rsvpBtn.addEventListener("click", () => {
      const eventId = rsvpBtn.dataset.id;
      rsvpToEvent(eventId);
    });

    
    function rsvpToEvent(eventId) {
      const fetch_url = `${API_URL}/${eventId}`;
      fetch(fetch_url, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rsvp: true }),
      })
        .then((response) => response.json())
        .then(() => alert("🎉 RSVP confirmed!"))
        .catch((error) => console.error("Error RSVPing:", error));       
    }
  
    // Function to fetch and filter events based on search term and category
    function fetchAndFilterEvents() {
      const searchTerm = searchInput.value.toLowerCase();
      const selectedCategory = categorySelect.value;
  
      fetch(API_URL)
        .then((response) => response.json())
        .then((events) => {
          const filteredEvents = events.filter((event) => {
            const matchesName = event.name.toLowerCase().includes(searchTerm);
            const matchesCategory =
              selectedCategory === "all" ||
              event.category.toLowerCase() === selectedCategory;
            return matchesName && matchesCategory;
          });
  
          displayEventList(filteredEvents);
        })
        .catch((error) => console.error("Error fetching events:", error));
    }
    // Event listener for search input
    searchInput.addEventListener("input", fetchAndFilterEvents);
    categorySelect.addEventListener("change", fetchAndFilterEvents);
  
    fetchEvents();
  }); 