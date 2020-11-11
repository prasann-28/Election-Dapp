import Head from 'next/head'
import React, { Component } from 'react'
import Web3 from 'web3'
import Election from '../../build/contracts/Election.json'
import { Button, Form, Segment, Input, Icon, List, Image, Modal, Select } from 'semantic-ui-react'
import {motion} from 'framer-motion'
import 'next/router'
import 'semantic-ui-css/semantic.min.css'
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
          id : ''
        }
      }

      onSubmit = async (event) =>{
        event.preventDefault()
         let candidateName = this.state.name
         let candidateId = this.state.id

        // window.alert("Oh my GOD Rahul Gandhi v2")

        try{
          console.log(this.state.account)
          console.log(this.state.manager)
          window.alert(this.state.id)
          await this.state.election.methods.addCandidate(candidateId, candidateName).send({from: this.state.account})
          let candidate = await this.state.election.methods.candidates(candidateId).call()
          window.alert("Added Candiate is: " + candidate.name + " with id " + candidate.id)
          this.state.id++
          window.alert(this.state.id)
          window.location.reload()
        }
        catch(err){
          window.alert("Couldnt add candidate")
        }
      }
            
      setOpen = (_state) => {
        this.setState({open: _state})
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
        <Image size='medium' src='/images/wireframe/image.png' wrapped />

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
      <input placeholder='Party'value={Admin.party} onChange={event => this.setState({party: event.target.value})} required/>
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
        <Button onClick={() => setOpen(false) } primary>
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