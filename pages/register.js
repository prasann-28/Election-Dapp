import Head from 'next/head'
import React, { Component } from 'react'
import Web3 from 'web3'
import firebase from './fbase'
//import Link from 'next/link'
import Election from '../build/contracts/Election.json'
import { Button, Form, Segment, Input, TextArea, Select  } from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css'
import 'next/router'
//import FaceDetection from './api/camera.js'
// import Loading from './api/Loading'
// import { render } from 'react-dom'
//Declare IPFS
const ipfsClient = require('ipfs-api')
const ipfs = new ipfsClient({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' }) // leaving out the arguments will default to these values
const genderOptions = [
  { key: 'm', text: 'Male', value: 'male' },
  { key: 'f', text: 'Female', value: 'female' },
  { key: 'o', text: 'Other', value: 'other' },
]
export default class Register extends Component {
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
          
          let election = new web3.eth.Contract(Election.abi, electionData.address);
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
      
      captureFile = event => {

        event.preventDefault()
        console.log("Entered Capture File")
        const file = event.target.files[0]
        const reader = new FileReader()
        reader.readAsArrayBuffer(file)
      
        reader.onloadend = () => {
          this.setState({ buffer: Buffer(reader.result) })
          console.log('buffer ', this.state.buffer)
        }
      }
      handleClick=()=>{
        var recaptcha = new firebase.auth.RecaptchaVerifier('recaptcha');
        var number = '+91' + this.state.mobileNumber;
        firebase.auth().signInWithPhoneNumber(number, recaptcha).then( function(e) {
          var code = prompt('Enter the otp', '');
    
            
            if(code === null) return;
    
            
            e.confirm(code).then(function (result) {
                console.log(result.user);
    
                document.querySelector('label').textContent +=   result.user.phoneNumber + "Number verified";
                
            }).catch(function (error) {
                console.error( error);
                
            });
    
        })
        .catch(function (error) {
            console.error( error);
    
        });
      }
      
      constructor(props) {
        super(props)
        this.state = {
          election: {},
          manager: '', 
          loading: true,
          account: '0x0',
          winner: '',
          name:'',
          id: '',
          firstName: '',
          lastName: ''
          
        }
      }

       onSubmit = async (event) => {
        event.preventDefault()

        let f_name = this.state.firstName.concat(" ")
        let l_name = this.state.lastName
        let _name = f_name.concat(l_name)

        this.setState({name: _name})

        var result           = '';
        var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for ( var i = 0; i < 5; i++ ) {
           result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        result = result.toString()
        await this.state.election.methods.register(this.state.name, result).send({from: this.state.account})
       
        let status = await this.state.election.methods.voters(this.state.account).call({from: this.state.account})
       let _id = status.id
       let pass = status.password
       
       this.setState({id: _id, password: pass})
        if (status.exists) {
          window.alert(this.state.id)
          window.alert(this.state.password)
          window.location.href = "./login"
        }
        else{
          window.alert("Error registering")
        }
        };



      
      
      render() {
        return (
          <>
          <Head><title>Register Page</title></Head>
          <Segment basic inverted padded='very' raised size='massive' vertical>
            <h1><b>Register here to continue Voting</b></h1></Segment>
            <body className='register'>
              <div > 
              {/* If doesnt feel right remove className=box above */}
            <Form onSubmit={this.onSubmit}>
    <Form.Group widths='equal'>
      <Form.Field style={{paddingLeft:'6rem',paddingRight:'4rem'}}
        id='form-input-control-first-name'
        control={Input}
        label='First name'
        placeholder='First name'
        value={this.state.firstName}
        onChange={event => {this.setState({firstName: event.target.value}) }}
        required
      />
      
      <Form.Field style={{paddingRight: '6rem'}}
        id='form-input-control-last-name'
        control={Input}
        label='Last name'
        placeholder='Last name'
        value={this.state.lastName}
        onChange={event => {this.setState({lastName: event.target.value}) }}
        required
      />
      </Form.Group>
      <Form.Group widths='equal' style={{paddingTop:'1rem', paddingRight: '270px'}}>
      <Form.Field style={{left:'80px'}}
        control={Select}
        options={genderOptions}
        label={{ children: 'Gender', htmlFor: 'form-select-control-gender' }}
        placeholder='Gender'
        search
        searchInput={{ id: 'form-select-control-gender' }}
        required
      />
      <Form.Field style={{paddingLeft:'10rem',paddingRight:'1rem'}}
        id='form-input-control-mobile-number'
        type='text'
        control={Input}
        label='Adhaar Card'
        placeholder='Adhaar ID'
        value={this.state.aadhar}
        {...console.log(this.state.aadhar)}
        onChange={event => {this.setState({aadharID: event.target.value}) }}
        required
      />
      
      </Form.Group>
      <Form.Group widths='equal' style={{paddingTop:'1rem'}}>
     <Form.Field style={{paddingLeft:'6rem',paddingRight:'4rem'}}
        id='form-input-control-mobile-number'
        type='text'
        control={Input}
        label='Registered Mobile Number'
        placeholder='RMN'
        value={this.state.mobileNumber}
        {...console.log(this.state.mobileNumber)}
        onChange={event => {this.setState({mobileNumber: event.target.value}) }}
        required
      />
    <Form.Field style={{paddingRight: '6rem'}}
      id='form-input-control-error-email'
      type='email'
      control={Input}
      label='Email'
      placeholder='joe@schmoe.com'
      required
    /></Form.Group>
    <Form.Field style={{paddingTop:'1rem'}}
      id='form-button-control-public'
        control={Button}
      content='Confirm'
      label='Register'
      required
    />
  </Form>
  <div>
           <label></label>
        
        <div id="recaptcha"></div>

        <button onClick={this.handleClick}>Click</button>
      </div>
  </div><br/><br/><br/><br/><br/><br/><br/><br/></body>
    {/* <FaceDetection></FaceDetection> */}
          </>
        );
      } 
}
