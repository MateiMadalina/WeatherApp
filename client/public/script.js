const key = "b54d788ad89546eeaf2133644232002";
const cities = [
  "Bucharest",
  "Paris",
  "London",
  "Berlin",
  "Praha",
  "Glasgow",
  "Budapest",
  "Vienna",
  "Warsaw",
  "Amsterdam",
];
const rootElement = document.querySelector("#root");

rootElement.insertAdjacentHTML(
  "afterbegin",
  `<form autocomplete="off">
      <label for="input">Pick a City:</label>
      <div>            
          <input type="text" id="input">
      </div>
  </form>`
);

const inputElement = document.getElementById('input');

const autocompleteAndDisplay = (input, list) => {
  const closeList = () => {
      const suggestions = document.getElementById('suggestions');
      const section = document.querySelector('section');
      if (suggestions) {
          suggestions.parentNode.removeChild(suggestions);
          section.remove();
      };
  };

  input.addEventListener('input', function () {
      //Close the existing list if it is open
      closeList();

      //If the input is empty, exit the function
      if (!this.value)
          return;

      //Create a suggestions <div> and add it to the element containing the input field
      const suggestions = document.createElement('div');
      suggestions.setAttribute('id', 'suggestions');
      this.parentNode.appendChild(suggestions);

      //Iterate through all entries in the list and find matches
      list.map(listItem => {
          if(listItem.toUpperCase().includes(this.value.toUpperCase())) {
              let suggestion = document.createElement('div');
              suggestion.innerHTML = listItem;

              suggestion.addEventListener('click', function() {
              input.value = this.innerHTML;

              let currentUrl = `http://api.weatherapi.com/v1/current.json?key=b54d788ad89546eeaf2133644232002&q=${input.value}&aqi=no`
              fetchData(currentUrl);

              closeList();
              });
              suggestions.appendChild(suggestion);
          };
      });
  });
};
autocompleteAndDisplay(inputElement, cities);

const makePage = (data) => {
  rootElement.insertAdjacentHTML("beforeend", `
  <section>
      <h1>${data.location.name}</h1>
  </section>`)
};

const fetchData = async (url) => {
  try {
      const initialData = await fetch(url);
      const data = await initialData.json();
      makePage(data);
  } catch (error) {
      error = 'There was an error'
      rootElement.insertAdjacentHTML("beforeend", `
      <section>
           <h1>${error}</h1>
      </section>`);
  };
};
