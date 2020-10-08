import Head from 'next/head'
import styles from '../styles/Home.module.css'
import React, { Component } from 'react'
import Web3 from 'web3'
import Election from '../abis/Election'
//import Navbar from '../public/Navbar'
//import Main from './Main'
import '../styles/globals.css'

class App extends Component {

  async componentDidMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
  }

  async loadBlockchainData() {
    const web3 = window.web3;

    const accounts = await web3.eth.getAccounts();
    this.setState({ account: accounts[0] });
    console.log(await web3.eth.getAccounts())
    const networkId = await web3.eth.net.getId();
    
    
    //Loads Election contract
    const electionData = Election.networks[networkId];
    if(electionData){
      
      const election = new web3.eth.Contract(Election.abi, electionData.address);
      this.setState({election});
      
      let manager = await election.methods.manager().call();
      let votersCount = await election.methods.votersCount().call()
      let candidatesCount = await election.methods.candidatesCount().call()
      let winner = await election.methods.winner().call()
      this.setState({manager, votersCount, candidatesCount, winner})
      //this.setState({})
  } else {
    window.alert('Not deployed to network');
  }
  this.setState({loading: false});

 }

  
  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }

  constructor(props) {
    super(props)
    this.state = {
      Election: {},
      manager: '', 
      loading: true,
      votersCount: '',
      account: '',
      candidatesCount: '',
      winner: ''

    }
  }

};
export default App;
