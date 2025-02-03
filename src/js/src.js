import carPlaceholder from "./../img/car-placeholder.jpg";

// ******************** HELPER FUNCTIONS ********************
/**
 * Normalizes a car reg number by inserting a space before the last three characters.
 *
 * @function normaliseCarReg
 * @param {string} reg - The car reg number.
 * @returns {string} The normalized reg number with a space before the last three chars.
 */
function normaliseCarReg(reg) {
  return reg.slice(0, -3) + " " + reg.slice(-3);
}

/**
 * Normalizes a date from the format "YYYY-MM-DD" to "DD-MM-YYYY".
 *
 * @function normaliseDate
 * @param {string} inputDate - The date string in "YYYY-MM-DD" format.
 * @returns {string} The normalized date string in "DD-MM-YYYY" format.
 */
function normaliseDate(inputDate) {
  const [year, month, day] = inputDate.split("-");
  return `${day}-${month}-${year}`;
}

async function performSearch(regNum) {
  regNum = normaliseCarReg(regNum);
  const result = await garage.add({ reg: regNum });

  if (result === -1) {
    return -1;
  }

  insertCarCard(result);
}

// ******************** MAIN CODE ********************
/**
 * Inserts a title, search bar, and a container for car information into the webpage.
 *
 * @function insertTitleAndSearchBar
 */
function insertTitleAndSearchBar() {
  // Insert title element
  document.querySelector("body").insertAdjacentHTML(
    "afterbegin",
    `<div class="title-bar">
            Vehicle Lookup
        </div>`
  );

  // Insert search input box + search button
  document.querySelector(".title-bar").insertAdjacentHTML(
    "beforeend",
    `<p></p>
      <input type="text" class="search-input" placeholder="Enter number plate..." required>
      <button class="search-button">Search</button>
      <p></p>
       `
  );

  // Insert div for the car information grid
  document
    .querySelector(".title-bar")
    .insertAdjacentHTML("afterend", `<div class="cards-container"></div>`);
}

/**
 * Sets up event listeners for the search button and search input field.
 *
 * @function setupTitleAndSearchBarEventListeners
 */
function setupTitleAndSearchBarEventListeners() {
  // Search button event listener
  document
    .querySelector(".search-button")
    .addEventListener("click", async (event) => {
      const res = await performSearch(
        document.querySelector(".search-input").value
      );
      if (res !== -1) document.querySelector(".search-input").value = "";
    });

  // Search input field "Enter" button pressed event listener
  document
    .querySelector(".search-input")
    .addEventListener("keydown", async (event) => {
      if (event.key === "Enter") {
        const res = await performSearch(event.target.value);
        if (res !== -1) document.querySelector(".search-input").value = "";
      }
    });
}

/**
 * Initializes the title and search bar by inserting the elements into the page and
 * setting up the necessary event listeners.
 *
 * @function initTitleAndSearchBar
 */
function initTitleAndSearchBar() {
  insertTitleAndSearchBar();
  setupTitleAndSearchBarEventListeners();
}

/**
 * Inserts a car card into the car information grid, displaying details about the
 * vehicle.
 *
 * @function insertCarCard
 * @param {Object} car - The car object in the form:
 *                       {reg: "<regNumber>", data: {<vehicleDataFromDvlaApi>}}
 */
function insertCarCard(car) {
  document.querySelector(".cards-container").insertAdjacentHTML(
    "afterbegin",
    `<div class="card">
      <div class="card-top">
      <div class="card-plate">${normaliseCarReg(
        car.data.registrationNumber
      )}</div>
        <img class="card-img" src=${carPlaceholder} alt="Picture of car"/>
        <div class="image-overlay">
          <div class="car-name">${
            car.data.yearOfManufacture
          } ${car.data.make.toLowerCase()}</div>
          <div class="car-subtitle">Colour: ${car.data.colour.toLowerCase()}</div>
        </div>
      </div>

      <div class="car-bottom">
        <div class="specs-grid">
          <div class="spec-item">
            <div class="spec-label">Fuel Type</div>
            <div class="spec-value spec-value--fuel">${car.data.fuelType.toLowerCase()}</div>
          </div>

          <div class="spec-item">
            <div class="spec-label">MOT Expiry Date</div>
            <div class="spec-value spec-value--mot">${normaliseDate(
              car.data.motExpiryDate
            )}</div>
          </div>

          <div class="spec-item">
            <div class="spec-label">Engine Capacity</div>
            <div class="spec-value spec-value--engine">${
              car.data.engineCapacity
            } cc</div>
          </div>

          <div class="spec-item">
            <div class="spec-label">CO2 Emissions</div>
            <div class="spec-value spec-value--co2">${
              car.data.co2Emissions
            } g/km</div>
          </div>
        </div>
      </div>
    </div>`
  );
}

/**
 * Initializes the car cards by retrieving all stored cars from the garage
 * and inserting them into the car information grid.
 *
 * @function initCards
 */
function initCards() {
  const cars = garage.getAll();
  for (const car of cars) {
    insertCarCard(car);
  }
}

function start() {
  initTitleAndSearchBar();
  initCards();
}

window.addEventListener("garage-loaded", start, false);
