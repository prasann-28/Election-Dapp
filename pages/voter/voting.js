import Head from 'next/head'
import React, { Component } from 'react'
import Web3 from 'web3'
//import Link from 'next/link'
import Election from '../../build/contracts/Election.json'
import { Button, Form, Segment, Input, TextArea, Select  } from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css'
import 'next/router'
// import Loading from './api/Loading'
// import { render } from 'react-dom'

export default class Login extends Component {
    async componentDidMount() {
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
          this.setState({manager})
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
          password: '',
          id: ''
          
        }
      }

       onSubmit = async (event) => {
          event.preventDefault
          
       };

       cookie = async () => {
            let voter = await this.state.election.methods.voters(this.state.account).call({from: this.state.account})

            if(!voter.authenticated){
                window.alert("Login to Continue")
                window.location.href = "../login"
                
            }
       }


      
      render() {
        return (
          <>
           <div onLoad={this.cookie}>{this.state.account}</div>
        <h2>{this.state.manager}</h2>
          </>
        );
      } 
}