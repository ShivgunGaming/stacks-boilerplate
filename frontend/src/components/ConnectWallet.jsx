import React from "react";
import { AppConfig, showConnect, UserSession } from "@stacks/connect";
import PropTypes from "prop-types";
import Logo from "./logo.png";

// Define the app permissions required for the app
const APP_PERMISSIONS = ["store_write", "publish_data"];

// Create an instance of AppConfig with the required app permissions
const appConfig = new AppConfig(APP_PERMISSIONS);

// Create an instance of UserSession using the appConfig
export const userSession = new UserSession({ appConfig });

// Define the ConnectWallet component
const ConnectWallet = ({
  buttonTextWhenSignedIn = "Disconnect Wallet",
  buttonTextWhenSignedOut = "Connect Wallet",
}) => {
  // Function that initiates the authentication process
  const handleAuthenticate = () => {
    showConnect({
      appDetails: {
        name: "Fruits?",
        icon: Logo,
      },
      redirectTo: "/",
      onFinish: () => {
        window.location.reload();
      },
      userSession,
    });
  };

  // Function that signs the user out
  const handleDisconnect = () => {
    userSession.signUserOut("/");
  };

  // Render the "Disconnect Wallet" button if the user is signed in, otherwise render the "Connect Wallet" button
  if (userSession.isUserSignedIn()) {
    return (
      <>
        <div>
          <button className="Connect" onClick={handleDisconnect}>
            {buttonTextWhenSignedIn}
          </button>
        </div>
        <p> {/* Placeholder for additional content */} </p>
      </>
    );
  }

  return (
    <button className="Connect" onClick={handleAuthenticate}>
      {buttonTextWhenSignedOut}
    </button>
  );
};

// Define the PropTypes for the ConnectWallet component
ConnectWallet.propTypes = {
  buttonTextWhenSignedIn: PropTypes.string,
  buttonTextWhenSignedOut: PropTypes.string,
};

export default ConnectWallet;
