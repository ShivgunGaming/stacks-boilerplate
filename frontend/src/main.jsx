// Importing React and ReactDOM
import React from "react";
import ReactDOM from "react-dom/client";

// Importing styles
import "./index.css";

// Importing App component
import App from "./App";

// Importing Connect component from @stacks/connect-react
import { Connect } from "@stacks/connect-react";

// Importing userSession from ConnectWallet component
import { userSession } from "./components/ConnectWallet";

// Creating a root for the React application
const root = ReactDOM.createRoot(document.getElementById("root"));

// Rendering the React application within the root element
root.render(
  <React.StrictMode>
    {/* Using the Connect component */}
    <Connect
      authOptions={{
        // Configuring authentication options for the Connect component
        appDetails: {
          // Setting app name and icon
          name: "Fruits?",
          icon: window.location.origin + "/logo.png",
        },
        redirectTo: "/",
        onFinish: () => {
          window.location.reload();
        },
        userSession, // Passing userSession as prop
      }}
    >
      {/* Rendering the App component within Connect */}
      <App />
    </Connect>
  </React.StrictMode>
);
