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
</div>`);
