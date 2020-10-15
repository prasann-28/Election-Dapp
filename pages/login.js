import Head from 'next/head'
import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import Web3 from 'web3'
import Link from 'next/link'
import Election from '../build/contracts/Election.json'
import { Button, Form, Segment } from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css'

const LoginForm = () => (
  <Form unstackable>
    <Form.Group widths={2}>
      <Form.Input label='Identity Number' placeholder='Enter your ID' />
      <Form.Input label='Enter Password' placeholder='Password' type='password' />
    </Form.Group>
    <Form.Checkbox label='I agree to the Terms and Conditions' />
    <Button type='submit'>Submit</Button>
  </Form>
)


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
          
        }
      }

       
      
      render() {
        return (
          <>
          <Head><title>Login Page</title></Head>
          <Segment basic inverted padded='very' raised size='massive'>
            <h1><b>Login here to continue Voting</b></h1></Segment>
          <body>
          <LoginForm className='LoginForm'/>
          </body>        
          </>
        );
      }
}