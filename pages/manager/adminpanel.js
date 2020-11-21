import Head from 'next/head'
import React, { Component } from 'react'
import Web3 from 'web3'
import Election from '../../build/contracts/Election.json'
import { Button, Form, Segment, Input, Icon, List, Image, Modal, Select } from 'semantic-ui-react'
import {motion} from 'framer-motion'
import 'next/router'
import 'semantic-ui-css/semantic.min.css'
import ImageUpload from '../api/ImageUpload'
//import 'ipfs-http-client'
import 'ipfs-api'

//Declare IPFS
const ipfsClient = require('ipfs-http-client')
const ipfs = ipfsClient({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' }) // leaving out the arguments will default to these values

const genderOptions = [
  { key: 'm', text: 'Male', value: 'male' },
  { key: 'f', text: 'Female', value: 'female' },
  { key: 'o', text: 'Other', value: 'other' },
]



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

      captureFile = async (event) => {

        event.preventDefault()
        const file = event.target.files[0]
        const reader = new window.FileReader()
        reader.readAsArrayBuffer(file)
    
        reader.onloadend = () => {
          this.setState({ buffer: Buffer(reader.result) })
          console.log('buffer', this.state.buffer)
        }
      }
      uploadImage = async (description) => {
        console.log("Submitting file to ipfs...")
    
        //adding file to the IPFS
        await ipfs.add(this.state.buffer, (error, result) => {
          console.log('Ipfs result', result)
          if(error) {
            console.error(error)
            return
          }
          this.state.election.methods.uploadImage(result[0].hash, description).send({ from: this.state.account }).on('transactionHash', (hash) => {
            // this.setState({ loading: true })
            // this.setState({ loading: false })
          })
        })
      }
    
      onSubmit = async (event) =>{
        event.preventDefault()
        
        let candidateNumber = this.state.num
        // window.alert("Oh my GOD Rahul Gandhi v2")
        let candidateName = this.state.name
        try{
          candidateNumber++
          window.alert(candidateNumber)
          await this.state.election.methods.addCandidate(candidateNumber,candidateName).send({from: this.state.account})
          //window.alert(candidateNumber+1)
          let candidate = await this.state.election.methods.candidates(candidateNumber).call()
          //window.alert(candidateNumber+2)  
          this.setState({num: candidateNumber})
          //window.alert(candidateNumber+3)
          console.log(candidate.id)
          window.alert("Added successfully")
        }
        catch(err){
          window.alert("Couldnt add candidate")
        }
      }
            
      setOpen = (_state) => {
        this.setState({open: _state})
      }

      captureFile = event => {

        event.preventDefault()
        const file = event.target.files[0]
        const reader = new window.FileReader()
        reader.readAsArrayBuffer(file)
    
        reader.onloadend = () => {
          this.setState({ buffer: Buffer(reader.result) })
          console.log('buffer', this.state.buffer)
        }
      }
      uploadImage = description => {
        console.log("Submitting file to ipfs...")
    
        //adding file to the IPFS
        ipfs.add(this.state.buffer, (error, result) => {
          window.alert("Entered IPFS func")
          console.log('Ipfs result'+ result)
          if(error) {
            console.error(error)
            return
          }
    
          this.setState({ loading: true })
          this.state.election.methods.uploadImage(result[0].hash, description).send({ from: this.state.account }).on('transactionHash', (hash) => {
            this.setState({ loading: false })
          })
        })
      }

      constructor(props) {
        super(props)
        this.state = {
          election: {},
          manager: '', 
          loading: true,
          account: '',
          head: 'Admin Panel',
          name: '',
          party: '',
          open: false,
          num : 0,
          images: []
        }
        this.uploadImage = this.uploadImage.bind(this)
        this.captureFile = this.captureFile.bind(this)
  }

      


    
      render() {
        return (
          <>
          <Head><title>{this.state.head}</title></Head>
          <Segment basic inverted padded='very' raised size='huge'>
          <motion.div initial="hidden" animate="visible" variants={{
  hidden: {
    scale: .8,
    opacity: 0
  },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      delay: .4
    }
  },
}}>          
            <h1><b><Icon name='chess board' className='election-icon' size='big' />Admin Panel</b></h1>
            <h3 className='intro-h3'>You can add candidates and declare result</h3></motion.div>
            </Segment>

            <div>
            <div className='candidate-form'>
            <Modal
      open={this.state.open}
      onClose={() => this.setOpen(false)}
      onOpen={() => this.setOpen(true)}
      trigger={<Button animated = 'fade' size ='massive' >
          <Button.Content  visible className = 'button-font'>Add Candidate</Button.Content>
          <Button.Content hidden>
        <Icon name='chess queen' />
      </Button.Content>
          </Button>}
    >
      <Modal.Header>Candidate Profile</Modal.Header>
      <Modal.Content image scrolling>
     <ImageUpload  images={this.state.images} captureFile={this.captureFile} uploadImage={this.uploadImage} />
        <Modal.Description>
          {/* <p>
            This is an example of expanded content that will cause the modal's
            dimmer to scroll.
          </p> */}
          <Form onSubmit={this.onSubmit}>
    <Form.Field>
      <label>Candidate Name</label>
      <input placeholder='Name' value={this.state.name} onChange={event => this.setState({name: event.target.value})} required />
    </Form.Field>
    <Form.Field>
      <label>Party</label>
      <input placeholder='Party' value={Admin.party} onChange={event => this.setState({party: event.target.value})} required/>
    </Form.Field>
    <Form.Field
        control={Select}
        options={genderOptions}
        label={{ children: 'Gender', htmlFor: 'form-select-control-gender' }}
        placeholder='Gender'
        search
        searchInput={{ id: 'form-select-control-gender' }}
        required
      />
    <Button type='submit'>Submit</Button>
  </Form>
          
        </Modal.Description>
      </Modal.Content>
      <Modal.Actions>
        <Button onClick={() => this.setOpen(false) } primary>
          Proceed <Icon name='chevron right' />
        </Button>
      </Modal.Actions>
    </Modal>
            </div>
            <div className='candidate-form' style={{float : "right"}} >
            <Button animated='fade' size='huge'>
      <Button.Content visible >Declare Result</Button.Content>
      <Button.Content hidden>
      <Icon name='chess' />
      </Button.Content>
    </Button>
            </div>
            
            </div>

           
          </>
        );
      } 
}