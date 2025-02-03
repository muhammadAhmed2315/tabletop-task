# Tabletop Task

## Approach

- Initially, I attempted to make API requests directly from the JavaScript running in the browser, but I encountered issues due to the API's CORS restrictions. To resolve this, I restructured my approach by setting up two Node.js servers: one for serving static files at http://localhost:8080/ and another as a proxy server at http://127.0.0.1:5000/, which forwards requests to the DVLA API. This allows the frontend to communicate with the API indirectly, bypassing CORS limitations.
- Additionally, I discovered that the DVLA API did not provide car models or images, so I chose to omit car models entirely and use a placeholder image for all vehicles.
- To ensure a consistent user experience across different devices, I also implemented media queries, making the site responsive to various screen sizes.

## Installation
1. Navigate to repository:
   ```sh
   cd <project_directory>
   ```
2. Install dependencies:
   ```sh
   npm install
   ```

## Usage
Run the application:
```sh
npm i
npm start
```

## Environment Variables
Create a `.env` file and add necessary environment variables:
```
API_KEY=<your_dvla_api_key>
```

