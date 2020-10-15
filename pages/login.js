import Head from 'next/head'
import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import Web3 from 'web3'
import Link from 'next/link'
import Election from '../build/contracts/Election.json'

export default class Login extends Component {
    async componentWillMount() {
        await this.loadWeb3()
        await this.loadBlockchainData()
      }
    
      async loadBlockchainData() {
        const web3 = window.web3;
    
        const accounts = await web3.eth.getAccounts();
        this.setState({ account: accounts[0] });
        const networkId = await web3.eth.net.getId();
        
        
        //Loads Lottery contract
        const electionData = Election.networks[networkId];
        if(electionData){
          
          const election = new web3.eth.Contract(Election.abi, electionData.address);
          this.setState({election});
          
          let manager = await election.methods.manager().call();
         // let players = await election.methods.getPlayers().call({from: this.state.account});
         // let poolBalance = await web3.eth.getBalance(election.options.address);
         // let Balance = web3.utils.fromWei(poolBalance.toString(), 'ether')
          this.setState({manager})
         // this.setState({})
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
          election: {},
          manager: '', 
          loading: true,
          account: '0x0',
          winner: '',
          
        }
      }
    
      // onSubmit = async (event) =>{
      //   const web3 = window.web3;
      //   event.preventDefault();
      //   this.setState({message: 'Waiting for transaction to complete'})
      //  // const accounts = await web3.eth.getAccounts();
      //   await this.state.election.methods.enter().send({
      //     from: this.state.account,  value: web3.utils.toWei(this.state.value)     
      //   });
      //   this.setState({message: 'You have been entered'});
      // }
    
      // onClick = async ()=> {
      //   const web3 = window.web3;
      //   //const networkId = await web3.eth.net.getId();
        
        
      //   //Loads Lottery contract
      //   //const electionData = Lottery.networks[networkId];
      //   //const election = await Lottery.deployed();
      //   //const accounts = await web3.eth.getAccounts();
      //   await this.state.election.methods.pickWinner().send({from: this.state.account});
      //   this.setState({winner: await this.state.election.methods.winner().call()})
    
    
      // }
      
    
      render() {
        return (
          <>
          <div className='login-greet'>
            <h2>Login Here to Vote</h2>
            <form className='login-form'>
              <label>Name:
                <input type="number" name="id" id="id" />
              </label>
              <label>Password:
                <input type="password" name="password" id="password" />
              </label>
            </form>
        <h1>{this.state.account}</h1>
          </div>
          </>
        );
      }
}