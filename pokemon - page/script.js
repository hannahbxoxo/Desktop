// ===== SETTINGS =====
// The base address of the PokéAPI. We add a name or number to the end,
// e.g. https://pokeapi.co/api/v2/pokemon/25  ->  Pikachu
const API_URL = "https://pokeapi.co/api/v2/pokemon/";

// The highest regular Pokémon number (Pokédex 1–1025)
const MAX_POKEMON_ID = 1025;


// ===== GET THE HTML ELEMENTS WE NEED =====
const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");
const message = document.getElementById("message");
const cardContainer = document.getElementById("card-container");
const regenerateBtn = document.getElementById("regenerate-btn");


// ===== 1. ASK THE API FOR ONE POKÉMON =====
// "async" means this function waits for the internet without freezing the page.
// It returns the Pokémon data, or null if it wasn't found.
async function getPokemon(nameOrId) {
try {
const response = await fetch(API_URL + nameOrId);

// response.ok is false when the API answers "404 Not Found"
if (!response.ok) {
return null;
}

// Turn the answer (text) into a JavaScript object we can use
return await response.json();
} catch (error) {
// Happens e.g. when there is no internet connection
console.error(error);
return null;
}
}


// ===== 2. BUILD THE HTML CARD =====
function showCard(pokemon) {
// Picture: use the big artwork, or the small sprite if artwork is missing
const image =
pokemon.sprites.other["official-artwork"].front_default ||
pokemon.sprites.front_default;

// The API gives height in decimetres and weight in hectograms,
// so we divide by 10 to get metres and kilograms.
const heightInMeters = pokemon.height / 10;
const weightInKg = pokemon.weight / 10;

// Abilities come as a list of objects -> make a list of <li> items
const abilitiesHtml = pokemon.abilities
.map((item) => `<li>${capitalize(item.ability.name)}</li>`)
.join("");

// Put everything into the page using a template string (backticks ` `)
cardContainer.innerHTML = `
<article class="card">
<p class="card-id">#${pokemon.id}</p>
<img src="${image}" alt="${pokemon.name}">
<h2>${capitalize(pokemon.name)}</h2>
<div class="stats">
<p><strong>Height:</strong> ${heightInMeters} m</p>
<p><strong>Weight:</strong> ${weightInKg} kg</p>
</div>
<h3>Abilities</h3>
<ul>${abilitiesHtml}</ul></article>
`;
}


// ===== 3. SMALL HELPERS =====
// "pikachu" -> "Pikachu"
function capitalize(text) {
return text.charAt(0).toUpperCase() + text.slice(1);
}

// Show a message (or clear it by passing "")
function showMessage(text) {
message.textContent = text;
}


// ===== 4. RANDOM POKÉMON =====
async function showRandomPokemon() {
// Random whole number between 1 and MAX_POKEMON_ID
const randomId = Math.floor(Math.random() * MAX_POKEMON_ID) + 1;

showMessage("");
cardContainer.innerHTML = "<p>Loading...</p>";

const pokemon = await getPokemon(randomId);

if (pokemon) {
showCard(pokemon);
} else {
cardContainer.innerHTML = "";
showMessage("Something went wrong. Please try again.");
}
}


// ===== 5. SEARCH =====
searchForm.addEventListener("submit", async (event) => {
// Stop the form from reloading the page (default form behaviour)
event.preventDefault();

// Clean up the input: remove spaces, make lowercase (API needs lowercase)
let query = searchInput.value.trim().toLowerCase();

if (query === "") {
showMessage("Please type a Pokémon name or number.");
return;
}

// "025" -> "25" so numbers with leading zeros also work
if (!isNaN(query)) {
query = String(Number(query));
}

cardContainer.innerHTML = "<p>Searching...</p>";

const pokemon = await getPokemon(query);

if (pokemon) {
showMessage("");
showCard(pokemon);
} else {
cardContainer.innerHTML = "";
showMessage(`Sorry, no Pokémon called "${searchInput.value.trim()}" was found.`);
}
});


// ===== 6. CONNECT THE BUTTON + START =====
regenerateBtn.addEventListener("click", showRandomPokemon);

// Show a random Pokémon as soon as the page loads (also on every refresh)
showRandomPokemon();