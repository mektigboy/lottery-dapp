import React, { Component } from "react";
// import logo from './logo.svg';
import "./App.css";
import web3 from "./web3";
import lottery from "./lottery";

class App extends Component {
  // web3.eth.getAccounts().then(console.log);

  // constructor(props) {
  //   super(props);

  //   this.state = { manager: '' };

  // }

  state = {
    manager: "",
    players: [],
    balance: "",
    value: "",
    message: "",
  };

  async componentDidMount() {
    const manager = await lottery.methods.manager().call();
    const players = await lottery.methods.getPlayers().call();
    const balance = await web3.eth.getBalance(lottery.options.address);

    this.setState({ manager, players, balance });
  }

  onSubmit = async (event) => {
    event.preventDefault();

    const accounts = await web3.eth.getAccounts();

    this.setState({ message: "Waiting on transaction success..." });

    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei(this.state.value, "ether"),
    });

    this.setState({ message: "You have been entered!" });
  };

  render() {
    return (
      <div>
        <h1>Lottery Contract</h1>
        <p>
          This contract is managed by: <b>{this.state.manager}</b>.
        </p>
        <p>
          There are currently <b>{this.state.players.length}</b> people entered,
          competing to win{" "}
          <b>{web3.utils.fromWei(this.state.balance, "ether")} ETH</b>!
        </p>
        <hr />
        <form onSubmit={this.onSubmit}>
          <h3>Test your luck!</h3>
          <div>
            <label>
              Amount of <b>ETH</b>:
            </label>
            <input
              value={this.state.value}
              onChange={(event) => this.setState({ value: event.target.value })}
            />
            <button>Enter</button>
          </div>
        </form>
        <hr />
        <p>{this.state.message}</p>
      </div>
    );
  }
}

export default App;
