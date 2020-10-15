import Head from 'next/head'
import React, { Component } from 'react'
import Web3 from 'web3'
import Link from 'next/link'
import Election from '../build/contracts/Election.json'
import { Button, Form, Segment, Input } from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css'
import 'next/router'
import { render } from 'react-dom'

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
          id:''
          
        }
      }

       onSubmit = async (event) => {
        event.preventDefault()
        
        try{
          await this.state.election.methods.authenticate(this.state.id, this.state.password).send({from: this.state.account})
        }
        // let status = await this.state.election.methods.voters(this.state.account).authenticated.call({from: this.state.account})
        
        // if(status){

          // } else{
        //   window.alert('Wrong Password')
        // }
        catch (err) {
          window.alert('Wrong id/password')
          window.location.href = "./register"
        }
        
        window.location.href('./voter/voting')
       };
      
      render() {
        return (
          <>
          <Head><title>Login Page</title></Head>
          <Segment basic inverted padded='very' raised size='massive'>
            <h1><b>Login here to continue Voting</b></h1></Segment>
          
          <Form unstackable className='LoginForm' onSubmit={this.onSubmit} >
          <Form.Group widths={2}>
          <Form.Input label='Identity Number' placeholder='Enter your ID' value={this.state.id} onChange={event => this.setState({id:event.target.value})} required/>
          <Form.Input label='Enter Password' placeholder='Password' type='password' value={this.state.password} onChange={event => this.setState({id:event.target.password})} required />
          </Form.Group>
          <Form.Checkbox label='I agree to the Terms and Conditions' required />
          <Button type='submit'>Submit</Button>
          </Form>        
          </>
        );
      } 
}