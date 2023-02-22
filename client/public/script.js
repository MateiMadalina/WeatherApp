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
  `
  <div id="fav_btn">
      <span>Add city to Favorites:</span>
      <button>+</button>
  </div>`
);

const rootElement = document.querySelector("#root");
const spinner = document.querySelector("#spinner");

rootElement.insertAdjacentHTML(
  "afterbegin",
  `<form autocomplete="off">
        <label for="input">Pick a City:</label>
        <div>            
            <input type="text" id="input">
        </div>
    </form>`
);

const inputElement = document.getElementById("input");
const favBtn = document.querySelector("button");

let favoriteCities = [];
let uniqueFavCities = [];

const autocompleteAndDisplay = (input, list) => {
  input.addEventListener("input", function () {
    const closeList = () => {
      const suggestions = document.getElementById("suggestions");
      const section = document.querySelector("section");
      if (suggestions) {
        suggestions.parentNode.removeChild(suggestions);
        if (section) section.remove();
      }
    };

    //Close the existing list if it is open
    closeList();

    //Create a suggestions <div> and add it to the element containing the input field
    const suggestions = document.createElement("div");
    suggestions.setAttribute("id", "suggestions");
    this.parentNode.appendChild(suggestions);

    if (favoriteCities && !this.value) {
      uniqueFavCities = [...new Set(favoriteCities)];
      uniqueFavCities.map((listItem) => {
        let suggestion = document.createElement("div");
        suggestion.innerHTML = listItem;
        suggestions.appendChild(suggestion);
      });
    };

    //If the input is empty, exit the function
    if (!this.value) return;

    //Iterate through all entries in the list and find matches
    list.map((listItem) => {
      if (listItem.toUpperCase().includes(this.value.toUpperCase())) {
        let suggestion = document.createElement("div");
        suggestion.innerHTML = listItem;

        suggestion.addEventListener("click", function () {
          input.value = this.innerHTML;

          let dataUrl = `http://api.weatherapi.com/v1/current.json?key=b54d788ad89546eeaf2133644232002&q=${input.value}&aqi=no`;
          let pictureUrl = `https://api.pexels.com/v1/search?query=${input.value}`;
          fetchData(dataUrl);
          fetchPictureData(pictureUrl);

          favBtn.addEventListener("click", function () {
            favoriteCities.push(input.value);
          });

          closeList();
        });
        suggestions.appendChild(suggestion);
      }
    });
  });
};
autocompleteAndDisplay(inputElement, cities);

const displayPicture = (data) => {
  rootElement.style.backgroundImage = `url("${data.photos[0].src.landscape}")`;
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
    error = "There was an error";
    rootElement.insertAdjacentHTML(
      "beforeend",
      `
      <section>
           <h1>${error}</h1>
      </section>`
    );
  }
};

const getTime = (date) => {
  let hours = new Date(date).getHours();
  let hours24 = (hours + 24) % 24;
  let minutes = new Date(date).getMinutes();
  let ampm = hours24 >= 12 ? "PM" : "AM";
  hours24 = hours24 % 12;
  hours24 = hours24 ? hours24 : 12;
  minutes = minutes < 10 ? "0" + minutes : minutes;
  let strTime = hours24 + ":" + minutes + " " + ampm;
  return strTime;
};

const makePage = (data) => {
  rootElement.insertAdjacentHTML(
    "beforeend",
    `
    <section>
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

const fetchData = async (url) => {
  try {
    spinner.removeAttribute("hidden");
    const initialData = await fetch(url);
    const data = await initialData.json();
    makePage(data);
    spinner.setAttribute("hidden", "");
  } catch (error) {
    error = "There was an error";
    rootElement.insertAdjacentHTML(
      "beforeend",
      `
        <section>
             <h1>${error}</h1>
        </section>`
    );
  }
};
