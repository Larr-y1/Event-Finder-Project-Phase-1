document.addEventListener("DOMContentLoaded", () => {
    const eventLists = document.getElementById("event-list");
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
      eventLists.innerHTML = ""; // clears the elements
      events.forEach((event) => {
        const eventCard = document.createElement("div");
        eventCard.classList.add("event-card");
        eventCard.innerHTML = `
              <h3>${event.name}</h3>
              <p>${event.date} - ${event.location}</p>
          `;
          eventLists.appendChild(eventCard);
      });
    }
  
    fetchEvents();
});
