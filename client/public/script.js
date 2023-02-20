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
  `<div id="pick_city">
    <label>Search City: 
        <input type="text">
    </label>
</div>`
);

const enteredCities = () => {
  return cities
    .map((city) => {
      if (city.includes(inputElement.value)) {
        return `<li>${city}</li>`;
      };
    })
    .join("");
};

const inputElement = document.querySelector("input");
inputElement.addEventListener("input", () => {
  if (inputElement.value.length > 0) {
    rootElement.insertAdjacentHTML(
      "beforeend",
      `<ul>
      ${enteredCities()}
      </ul>`
    );
  };
});
