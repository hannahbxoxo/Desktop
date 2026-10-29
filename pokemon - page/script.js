var baseUrl = "https://pokeapi.co/api/v2/pokemon/";
var maxPokemonId = 1025;

function getRandomPokemon() {
let randomId = Math.floor(Math.random() * maxPokemonId) + 1;
fetchData(randomId);
}


function searchPokemon() {
let searchValue = document.getElementById("searchInput").value.trim().toLowerCase();
if (searchValue === "") {
window.alert("Please enter a Pokémon name or number.");
return;
}
fetchData(searchValue);
}

function fetchData(nameOrId) {
let url = `${baseUrl}${nameOrId}`;

fetch(url)
.then((response) => {

if (!response.ok) {
throw new Error("Pokémon not found");
}
return response.json();
})
.then((data) => displayResult(toPokemon(data)))
.catch((error) => {
console.error(`Error fetching data: ${error.message}`);
displayNotFound(nameOrId);
});
}


function toPokemon(pokemon) {
return {
id: pokemon.id,
name: pokemon.name,
picture: pokemon.sprites.other["official-artwork"].front_default || pokemon.sprites.front_default,
height: pokemon.height / 10, // API gives decimetres -> meters
weight: pokemon.weight / 10, // API gives hectograms -> kg
abilities: pokemon.abilities.map((item) => item.ability.name),
};
}

function displayResult(pokemon) {
const card = document.getElementById("pokemonCard");
// Clear the old card every time a new request is sent
card.innerHTML = "";

const img = document.createElement("img");
img.src = pokemon.picture;
img.alt = pokemon.name;
card.appendChild(img);

const name = document.createElement("h2");
name.innerHTML = pokemon.name;
card.appendChild(name);

const id = document.createElement("p");
id.innerHTML = `Number: #${pokemon.id}`;
card.appendChild(id);

const height = document.createElement("p");
height.innerHTML = `Height: ${pokemon.height} m`;
card.appendChild(height);

const weight = document.createElement("p");
weight.innerHTML = `Weight: ${pokemon.weight} kg`;
card.appendChild(weight);

const abilitiesTitle = document.createElement("h3");
abilitiesTitle.innerHTML = "Abilities";
card.appendChild(abilitiesTitle);

const abilitiesList = document.createElement("ul");
for (const ability of pokemon.abilities) {
const listItem = document.createElement("li");
listItem.innerHTML = ability;
abilitiesList.appendChild(listItem);
}
card.appendChild(abilitiesList);
}

function displayNotFound(searchValue) {
const card = document.getElementById("pokemonCard");
card.innerHTML = "";
const para = document.createElement("p");
para.innerHTML = `The Pokémon "${searchValue}" could not be found.`;
card.appendChild(para);
}