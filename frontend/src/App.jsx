import "./App.css";
import Logo from "./assets/logofive.png";
import ConnectWallet from "./components/ConnectWallet";
import ContractCallVote from "./components/ContractCallVote";
import Footer from "./components/Footer";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        {/* Render logo */}
        <a>
          <img
            src={Logo}
            className="logo logo-animation"
            alt="Fruit logo"
          />
        </a>

        {/* Render description of the app */}
        <p className="Vote-text">
          Which fruit is better, Apple 🍏 or Orange 🍊! They are both fan
          favorites but only one will prevail 👑!
        </p>

        {/* Spacing */}
        <br />

        {/* Render ConnectWallet component */}
        <ConnectWallet />

        {/* Render ContractCallVote component */}
        <ContractCallVote />

        {/* Spacing */}
        <br />

        {/* Render Footer component */}
        <Footer />
      </header>
    </div>
  );
}

export default App;
