/**
 * Fetches vehicle information from Node.js server based on given registration number.
 *
 * @async
 * @function fetchVehicleInfo
 * @param {string} regNum - The vehicle registration number.
 * @returns {Promise<Object>} A promise that resolves to the vehicle details as an object.
 * @throws {Error} Logs an error to the console if the request fails.
 */
async function fetchVehicleInfo(regNum) {
  const url = `http://127.0.0.1:5000/api?regNum=${encodeURIComponent(regNum)}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching vehicle details:", error);
  }
}

/**
 * Represents a garage for storing car information (registration number + data pulled
 * from DVLA API).
 *
 * @constant {Object} garage
 * @property {number} count - The number of cars in the garage.
 * @property {Array<Object>} cars - An array holding car objects with registration
 *                                  numbers and associated data.
 */
const garage = {
  count: 0,
  cars: [],
};

/**
 * Provides methods to manage the garage, including adding, deleting, retrieving cars,
 * and fetching all stored cars.
 *
 * @namespace Garage
 */
export const Garage = {
  /**
   * Adds a car to the garage (if it is not already in the garage) after fetching its
   * details.
   *
   * @async
   * @function add
   * @memberof Garage
   * @param {Object} car - The car object in the form {reg: "<regNumber>"}
   * @returns {Promise<Object|number|void>} A promise resolving to the added car object
   *                                        if successful, -1 if the car already exists,
   *                                        or undefined if an error occurs.
   */
  async add(car) {
    if (!car || !car.reg) {
      console.warn("Invalid car object: Missing 'reg' property", car);
      return -1;
    }

    const normalizedReg = car.reg.toUpperCase().replace(/\s+/g, "");

    const index = garage.cars.findIndex((car) => car.reg === normalizedReg);
    if (index !== -1) {
      return -1;
    }

    const carInfo = await fetchVehicleInfo(normalizedReg);

    if (carInfo.success) {
      garage.cars.push({ reg: normalizedReg, data: carInfo.data });
      garage.count = garage.cars.length;
      return { reg: normalizedReg, data: carInfo.data };
    } else {
      console.error("***** ERROR *****");
      return -1;
    }
  },

  /**
   * Deletes a car from the garage by its registration number.
   *
   * @function delete
   * @memberof Garage
   * @param {string} reg - The registration number of the car to delete.
   * @returns {Object|null} The deleted car object if found, otherwise null.
   */
  delete(reg) {
    const normalizedReg = reg.toUpperCase().replace(/\s+/g, "");
    const index = garage.cars.findIndex((car) => car.reg === normalizedReg);
    if (index !== -1) {
      const deletedCar = garage.cars.splice(index, 1)[0];
      garage.count = garage.cars.length;
      return deletedCar;
    }
    return null;
  },

  /**
   * Retrieves a car from the garage by its registration number.
   *
   * @function get
   * @memberof Garage
   * @param {string} reg - The registration number of the car to retrieve.
   * @returns {Object|null} The car object if found, otherwise null.
   */
  get(reg) {
    const normalizedReg = reg.toUpperCase().replace(/\s+/g, "");
    return garage.cars.find((car) => car.reg === normalizedReg) || null;
  },

  /**
   * Retrieves all cars currently stored in the garage.
   *
   * @function getAll
   * @memberof Garage
   * @returns {Array<Object>} An array of all car objects stored in the garage.
   */
  getAll() {
    return garage.cars;
  },
};
