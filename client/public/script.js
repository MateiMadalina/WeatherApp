const cities = [
  "Havana",
  "Tokyo",
  "London",
  "Berlin",
  "Prague",
  "Glasgow",
  "Budapest",
  "Vienna",
  "Warsaw",
  "Amsterdam",
];

document.body.insertAdjacentHTML(
  "afterbegin",
  `<div id="fav_btn">
      <span>Add city to Favorites:</span>
      <button>+</button>
  </div>`
);

const rootElement = document.getElementById("root");
const spinner = document.getElementById("spinner");

rootElement.insertAdjacentHTML(
  "afterbegin",
  `<form autocomplete="off">
        <label for="input">Pick a City:</label>
        <div id="autofill">            
            <input type="text" id="input">
        </div>
    </form>`
);

const inputElement = document.getElementById("input");
const favoriteBtn = document.querySelector("button");

let citiesAddedToFavorites = [];
let uniqueFavCities = [];

const getUrls = (name) => {
  let dataUrl = `http://api.weatherapi.com/v1/current.json?key=b54d788ad89546eeaf2133644232002&q=${name}&aqi=no`;
  let pictureUrl = `https://api.pexels.com/v1/search?query=${name}`;
  fetchData(dataUrl);
  fetchPictureData(pictureUrl);
};

const autocompleteAndDisplay = (input, list) => {
  input.addEventListener("input", () => {
    const closeList = () => {
      const suggestions = document.getElementById("suggestions");
      const section = document.querySelector("section");
      if (suggestions) {
        suggestions.parentNode.removeChild(suggestions);
        if (section) {
          section.remove();
          rootElement.style.backgroundImage = "none";
        };
      };
    };
    //Close the existing list if it is open
    closeList();

    //Create a suggestions <div> and add it to the element containing the input field
    const suggestions = document.createElement("div");
    suggestions.setAttribute("id", "suggestions");
    input.parentNode.appendChild(suggestions);

    if (citiesAddedToFavorites && !input.value) {
      uniqueFavCities = [...new Set(citiesAddedToFavorites)];

      uniqueFavCities.map((listItem) => {
        let suggestion = document.createElement("div");
        suggestion.innerHTML = listItem;

        suggestion.addEventListener("click", () => {
          input.value = suggestion.innerHTML;
          getUrls(input.value);

          closeList();
        });
        suggestions.appendChild(suggestion);
      });
    };

    //If the input is empty, exit the function
    if (!input.value) return;

    //Iterate through all entries in the list and find matches
    list.map((listItem) => {
      if (listItem.toUpperCase().includes(input.value.toUpperCase())) {
        let suggestion = document.createElement("div");
        suggestion.innerHTML = listItem;

        suggestion.addEventListener("click", () => {
          input.value = suggestion.innerHTML;
          getUrls(input.value);

          favoriteBtn.addEventListener("click", () => {
            citiesAddedToFavorites.push(input.value);
          });

          closeList();
        });
        suggestions.appendChild(suggestion);
      };
    });
  });
};
autocompleteAndDisplay(inputElement, cities);

const displayPicture = (data) => {
  rootElement.style.backgroundImage = `url("${data.photos[0].src.landscape}")`;
};

const getTime = (date) => {
  let hours = new Date(date).getHours();
  let hours24 = (hours + 24) % 24;
  let minutes = new Date(date).getMinutes();
  let ampm = hours24 >= 12 ? "PM" : "AM";
  hours24 = hours24 % 12;
  hours24 = hours24 ? hours24 : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? "0" + minutes : minutes;
  let strTime = hours24 + ":" + minutes + " " + ampm;
  return strTime;
};

const displayData = (data) => {
  rootElement.insertAdjacentHTML(
    "beforeend",
    `<section>
        <h1>${data.location.name}</h1>
        <h3>Current Weather</h3>
        <p>${getTime(data.location.localtime)}</p>
        <div id="temp">
          <div>
            <img src="${data.current.condition.icon}">
            <p>${data.current.temp_c}&#8451;</p>
          </div>
          <div>
            <p>${data.current.condition.text}</p>
            <p>Feels like: ${data.current.feelslike_c}&#8451;</p> 
            <p>Humidity: ${data.current.humidity}&#x25;</p>
            <p>UV: ${data.current.uv}</p>
          </div>
        </div>
    </section>`
  );
};

const catchError = (error) => {
  error = "There was an error";
  rootElement.insertAdjacentHTML(
    "beforeend",
    `<section>
         <h1>${error}</h1>
    </section>`
  );
};

const fetchPictureData = async (url) => {
  try {
    const initialPictureData = await fetch(url, {
      headers: {
        Authorization:
          "tCcD7GhjDDRcVKJG7QVLPq5K2dLWsIUgGnxYVSYY3GgU9xpCNvRUiuSw",
      },
    });
    const pictureData = await initialPictureData.json();
    displayPicture(pictureData);
  } catch (error) {
    catchError(error);
  };
};

const fetchData = async (url) => {
  try {
    spinner.removeAttribute("hidden");
    const initialData = await fetch(url);
    const data = await initialData.json();
    displayData(data);
    spinner.setAttribute("hidden", "");
  } catch (error) {
    catchError(error);
  };
};
