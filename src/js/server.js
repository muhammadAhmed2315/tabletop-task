// Give us networking capabilities
const fs = require("fs");
const http = require("http");
const url = require("url");

require("dotenv").config();
const apiKey = process.env.API_KEY;

/**
 * Fetches vehicle details from the DVLA API using the given registration number.
 *
 * @async
 * @function fetchVehicleDetails
 * @param {string} regNum - The vehicle registration number.
 * @returns {Promise<Object>} A promise that resolves to an object containing the
 *                            success status, data, or an error message.
 */
async function fetchVehicleDetails(regNum) {
  const url =
    "https://driver-vehicle-licensing.api.gov.uk/vehicle-enquiry/v1/vehicles";

  const options = {
    method: "POST",
    headers: {
      "x-api-key": apiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ registrationNumber: regNum }),
  };

  try {
    const response = await fetch(url, options);
    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        errorCode: response.status,
        data: data?.message || "API request failed",
      };
    }

    return {
      success: true,
      data: data,
    };
  } catch (error) {
    return {
      success: false,
      errorCode: "UNKNOWN_ERROR",
      data: error.message,
    };
  }
}

/**
 * Creates an HTTP server to handle vehicle information API requests.
 *
 * @constant {http.Server} server
 */
const server = http.createServer(async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*"); // Allow all origins (or specify 'http://localhost:8080' instead)
  const { pathname, query } = url.parse(req.url, true);

  // API endpoints
  if (pathname === "/api") {
    if (!query || !query.regNum) {
      res.writeHead(400, { "Content-Type": "application/json" });
      return res.end(
        JSON.stringify({
          error: "Missing registration number",
          status: "error",
          message:
            "Please provide a registration number using the regNum parameter",
        })
      );
    }

    res.writeHead(200, { "Content-type": "application/json" });
    const response = await fetchVehicleDetails(query.regNum);
    res.end(JSON.stringify(response));

    // Handle any undefined route to avoid hanging requests
  } else {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Not Found");
  }
});

// Starts the HTTP server
server.listen(5000, "127.0.0.1", () => {
  console.log("Listening to requests on port 5000");
});
