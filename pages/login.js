import Head from 'next/head'
import React, { Component } from 'react'
import Web3 from 'web3'
import Election from '../build/contracts/Election.json'
import { Button, Form, Segment, Input } from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css'
import 'next/router'


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
        event.preventDefault()
        
          await this.state.election.methods.authenticate(this.state.id, this.state.password).send({from: this.state.account})
          
          let _id = await this.state.election.methods.voters(this.state.account).call()
          
          if(this.state.id == _id.id && this.state.password == _id.password){
            window.alert("Redirecting")
            window.location.href = "./voter/voting" 
          }
          else{
          if( _id.exists ){
            window.alert('Incorrect credentials')
          }
          else{
            window.alert('Register first')
            window.alert(_id.exists)
            window.location.href = "./register"
          }
        }
          
       };
      
      render() {
        return (
          <>
          <Head><title>Login Page</title></Head>
          <Segment basic inverted padded='very' raised size='massive'>
            <h1><b>Login here to continue Voting</b></h1></Segment>
          
          <Form unstackable className='LoginForm' onSubmit={this.onSubmit} >
          <Form.Group widths={2}>
          <Form.Input label='Identity Number' placeholder='Enter your ID' value={this.state.id} onChange={event => this.setState({id: event.target.value})} required/>
          <Form.Input label='Enter Password' placeholder='Password' type='text' value={this.state.password} onChange={event => this.setState({password:event.target.value})} required />
          </Form.Group>
          <Form.Checkbox label='I agree to the Terms and Conditions' required error />
          <Button type='submit'>Submit</Button>
          </Form>        
        <h1>{this.state.manager}</h1>
          </>
        );
      } 
}