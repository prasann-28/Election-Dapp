import Head from 'next/head'
import React, { Component } from 'react'
import Web3 from 'web3'
import Election from '../../build/contracts/Election.json'
import { Button, Form, Segment, Input } from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css'
import 'next/router'


export default class Admin extends Component {
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
          this.setState({election: election});
          
          let manager = await election.methods.manager().call();
          this.setState({manager: manager})

          // let voterid = await election.methods.voters(accounts[0]).call();
          // this.setState({authenticated: voterid.authenticated})
          if(manager != accounts[0])
          {this.setState({head: 'Not your regular page'})
            window.alert('not manager')
            window.location.href = '../'
          }else{
            this.setState({head: 'Admin Panel'})  
          }
          
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
          account: '',
          head: 'Admin Panel'
          
        }
      }

      // tokenCheck = async () => {
      //    let managerId = await this.state.election.methods.manager().call({from: this.state.account}) 
      //    let userId = await web3.eth.getAccounts()

      //    while(userId == ''){
      //      while(managerId == ''){
      //        managerId = this.state.manager.toString()
      //        userId = this.state.manager.toString()
      //      }
      //     }

      //     if(userId != managerId){
      //       window.alert("Not manager")
      //      // window.location.href = "../"
            
      
      render() {
        return (
          <>
          <Head><title>{this.state.head}</title></Head>
        <div>
        <h2>{this.state.manager}</h2>
        <h1>{this.state.account}</h1>
        </div>
          </>
        );
      } 
}