// Importing necessary modules and files
import React, { useState, useEffect } from "react";
import "./ContractCallVote.css";
import { useConnect } from "@stacks/connect-react";
import { StacksTestnet } from "@stacks/network";
import {
  AnchorMode,
  PostConditionMode,
  stringUtf8CV,
} from "@stacks/transactions";
import { userSession } from "./ConnectWallet";

// Defining the ContractCallVote component
const ContractCallVote = () => {
  // Using the useConnect hook to get the doContractCall function
  const { doContractCall } = useConnect();
  // Initializing state variables with default values
  const [orangeVotes, setOrangeVotes] = useState(0);
  const [appleVotes, setAppleVotes] = useState(0);
  const [userOrangeVotes, setUserOrangeVotes] = useState(
    parseInt(localStorage.getItem("userOrangeVotes")) || 0
  );
  const [userAppleVotes, setUserAppleVotes] = useState(
    parseInt(localStorage.getItem("userAppleVotes")) || 0
  );

  // Using the useEffect hook to fetch the current vote counts on mount
  useEffect(() => {
    async function fetchVotes() {
      const response = await fetch(
        "https://api.testnet.stacks.co/extended/v1/contracts/call-read/ST39MJ145BR6S8C315AG2BD61SJ16E208P1FDK3AK/example-fruit-vote-contract/vote-counts?encoded=true&arguments=[]"
      );
      const data = await response.json();
      // Logging the current vote counts to the console
      console.log("Orange Votes:", parseInt(data.result["🍊"]));
      console.log("Apple Votes:", parseInt(data.result["🍏"]));
      // Updating state variables with current vote counts
      setOrangeVotes(parseInt(data.result["🍊"]) || 0);
      setAppleVotes(parseInt(data.result["🍏"]) || 0);
    }
    fetchVotes();
  }, []);

  // Using the useEffect hook to update the user's vote count in local storage when it changes
  useEffect(() => {
    localStorage.setItem("userOrangeVotes", userOrangeVotes);
    localStorage.setItem("userAppleVotes", userAppleVotes);
  }, [userOrangeVotes, userAppleVotes]);

  // Function to update the vote counts
  async function updateVoteCounts() {
    const response = await fetch(
      "https://api.testnet.stacks.co/extended/v1/contracts/call-read/ST39MJ145BR6S8C315AG2BD61SJ16E208P1FDK3AK/example-fruit-vote-contract/vote-counts?encoded=true&arguments=[]"
    );
    const newVotes = await response.json();
    // Updating state variables with new vote counts
    setOrangeVotes(newVotes.result["🍊"] || 0);
    setAppleVotes(newVotes.result["🍏"] || 0);
  }

  // This function resets the user's votes and updates the localStorage and state accordingly
  function resetVotes() {
    // Check if the user has voted for either orange or apple
    if (
      localStorage.getItem("userOrangeVotes") > 0 ||
      localStorage.getItem("userAppleVotes") > 0
    ) {
      // Ask for confirmation before resetting the votes
      if (confirm("Are you sure you want to reset the votes ⚠️")) {
        // Reset localStorage and state for orange and apple votes
        localStorage.setItem("userOrangeVotes", 0);
        localStorage.setItem("userAppleVotes", 0);
        setUserOrangeVotes(0);
        setUserAppleVotes(0);
      }
    } else {
      // If no one has voted, display an alert
      window.alert(`No one has voted.`);
      // Reset localStorage and state for orange and apple votes
      localStorage.setItem("userOrangeVotes", 0);
      localStorage.setItem("userAppleVotes", 0);
      setUserOrangeVotes(0);
      setUserAppleVotes(0);
    }
  }

  // This function performs a contract call to the fruit vote contract with the selected pick as an argument
  async function vote(pick) {
    doContractCall({
      network: new StacksTestnet(),
      anchorMode: AnchorMode.Any,
      contractAddress: "ST39MJ145BR6S8C315AG2BD61SJ16E208P1FDK3AK",
      contractName: "example-fruit-vote-contract",
      functionName: "vote",
      functionArgs: [stringUtf8CV(pick)],
      postConditionMode: PostConditionMode.Deny,
      postConditions: [],
      onFinish: async (data) => {
        console.log("onFinish:", data);
        // Open a new tab with the transaction ID on the Stacks explorer
        window
          .open(
            `https://explorer.stacks.co/txid/${data.txId}?chain=testnet`,
            "_blank"
          )
          .focus();
        // Update the vote counts and the user's votes based on the selected pick
        updateVoteCounts();
        if (pick === "🍊") {
          setUserOrangeVotes(userOrangeVotes + 1);
        } else if (pick === "🍏") {
          setUserAppleVotes(userAppleVotes + 1);
        }
        // Display an alert with the selected pick
        window.alert(`You voted for ${pick}`);
      },
      onCancel: () => {
        console.log("onCancel:", "Transaction was canceled");
        // Display an alert if the transaction is canceled
        window.alert(`Transaction is Canceled ❌`);
      },
    });
  }

  // This code checks if the user is signed in. If not, it returns null.
  if (!userSession.isUserSignedIn()) {
    return null;
  }

  // The code below renders the voting interface and the vote results, including the winning fruit.

  // The user can vote for either "🍊" or "🍏" by clicking on the corresponding button.

  // The total number of votes for each fruit is displayed.

  // If there are no votes, a message is displayed prompting the user to start voting.

  // If there is a tie between the fruits, a message is displayed indicating a draw.

  // The reset button allows the user to reset the votes to zero.

  return (
    <div>
      <button className="Vote" onClick={() => vote("🍊")}>
        Vote for {"🍊"}
      </button>
      <button className="Vote" onClick={() => vote("🍏")}>
        Vote for {"🍏"}
      </button>

      <div className="total-Votes">
        Total Votes:
        <span className="vote-count upvote">
          <span className="vote-count-inner" data-votes={userOrangeVotes}>
            {"🍊"} {userOrangeVotes}
          </span>
        </span>{" "}
        |
        <span className="vote-count upvote">
          <span className="vote-count-inner" data-votes={userAppleVotes}>
            {"🍏"} {userAppleVotes}
          </span>
        </span>
      </div>

      <span className="winning-Fruit">
        {/* If there are no votes, display a message prompting the user to start voting */}
        {userOrangeVotes === 0 && userAppleVotes === 0 && (
          <p>Let the Voting Begin</p>
        )}

        {/* Display a message indicating the winning fruit */}
        {userOrangeVotes > userAppleVotes && (
          <p>
            Orange 🍊 is the Winner 🎉 with {userOrangeVotes}{" "}
            {userOrangeVotes === 1 ? "vote" : "votes"}!
          </p>
        )}

        {userOrangeVotes < userAppleVotes && (
          <p>
            Apple 🍏 is the Winner 🎉 with {userAppleVotes}{" "}
            {userAppleVotes === 1 ? "vote" : "votes"}!
          </p>
        )}

        {/* If there is a tie, display a message indicating a draw */}
        {userOrangeVotes === userAppleVotes && userOrangeVotes !== 0 && (
          <p>It's a tie 🤏</p>
        )}
      </span>

      {/* Allow the user to reset the votes to zero WARNING Proceed with caution as you are erasing all votes */}
      <button className="reset-Button" onClick={resetVotes}>
        Reset Votes ↻
      </button>
    </div>
  );
};

// Export the component as a default.
export default ContractCallVote;
