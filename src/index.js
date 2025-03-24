// Your code here
// Base URL for the API
const BASE_URL = "http://localhost:3000/characters";

// DOM elements
const characterBar = document.getElementById("character-bar");
const nameDisplay = document.getElementById("name");
const imageDisplay = document.getElementById("image");
const voteCountDisplay = document.getElementById("vote-count");
const votesForm = document.getElementById("votes-form");
const resetBtn = document.getElementById("reset-btn");
const characterForm = document.getElementById("character-form");

// Store the currently displayed character
let currentCharacter = null;

// Fetch all characters from db.json via GET /characters
function loadCharacters() {
  characterBar.innerHTML = ""; // Clear existing characters before fetch
  console.log("Fetching from:", BASE_URL);
  fetch(BASE_URL)
    .then((response) => {
      console.log("Response status:", response.status);
      console.log("Response ok:", response.ok);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((characters) => {
      console.log("Fetched characters:", characters);
      if (!Array.isArray(characters)) {
        throw new Error("Expected an array of characters");
      }
      characters.forEach((character) => {
        addCharacterToBar(character);
      });
    })
    .catch((error) => {
      console.error("Error fetching characters:", error);
      alert(`Failed to load characters from db.json: ${error.message}. Check if /characters endpoint exists.`);
    });
}

// Add a character to the character bar
function addCharacterToBar(character) {
  const span = document.createElement("span");
  span.textContent = character.name;
  span.addEventListener("click", () => {
    console.log("Clicked character:", character);
    displayCharacterDetails(character);
  });
  characterBar.appendChild(span);
}

// Display character details in the detailed-info section
function displayCharacterDetails(character) {
  console.log("Displaying details for:", character);
  currentCharacter = character;
  nameDisplay.textContent = character.name;
  imageDisplay.src = character.image;
  imageDisplay.alt = character.name;
  voteCountDisplay.textContent = character.votes;
}

// Update votes in db.json via PATCH /characters/:id
function updateVotesOnServer(character) {
  fetch(`${BASE_URL}/${character.id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ votes: character.votes }),
  })
    .then((response) => response.json())
    .then((updatedCharacter) => {
      currentCharacter = updatedCharacter;
      voteCountDisplay.textContent = updatedCharacter.votes;
    })
    .catch((error) => {
      console.error("Error updating votes:", error);
      alert("Failed to update votes in db.json.");
    });
}

// Handle vote form submission
votesForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!currentCharacter) return;

  const votesInput = document.getElementById("votes").value;
  const additionalVotes = parseInt(votesInput) || 0;
  currentCharacter.votes += additionalVotes;
  updateVotesOnServer(currentCharacter);
  votesForm.reset();
});

// Reset votes to 0
resetBtn.addEventListener("click", () => {
  if (!currentCharacter) return;
  currentCharacter.votes = 0;
  updateVotesOnServer(currentCharacter);
});

// Handle new character form submission
characterForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const nameInput = characterForm.querySelector("#name").value;
  const imageInput = characterForm.querySelector("#image-url").value;

  const newCharacter = {
    name: nameInput,
    image: imageInput,
    votes: 0,
  };

  fetch(BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newCharacter),
  })
    .then((response) => response.json())
    .then((savedCharacter) => {
      addCharacterToBar(savedCharacter);
      displayCharacterDetails(savedCharacter);
      characterForm.reset();
    })
    .catch((error) => {
      console.error("Error adding character:", error);
      alert("Failed to add character to db.json.");
    });
});

// Initialize the app
document.addEventListener("DOMContentLoaded", () => {
  loadCharacters();
});