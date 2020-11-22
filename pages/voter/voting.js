import Head from 'next/head'
import React, { Component } from 'react'
import Web3 from 'web3'
import Election from '../../build/contracts/Election.json'
import { Button, Form, Segment, Input } from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css'
import 'next/router'
import { Card, Icon, Image } from 'semantic-ui-react'
import VoteCard from '../api/VoteCard'


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
          this.setState({election: election});
          
          let manager = await election.methods.manager().call();
          this.setState({manager: manager})

          let voterid = await election.methods.voters(accounts[0]).call();
          this.setState({voter: voterid})

          let votersCount = await election.methods.votersCount().call()
         // window.alert('votersCount:'+ votersCount)

          let candidatesCount = await election.methods.candidatesCount().call()
          //window.alert(candidatesCount)
          
          if(candidatesCount==0){
            window.alert('No candidate present')
            window.location.href = "../"
          }

          let getcandidates 
          let getimages
          let imageurls

          for(let temp=parseInt(candidatesCount); temp > 0; temp--){
            getcandidates[temp] = await election.methods.candidates(temp).call();
            window.alert('getcandidates['+temp+']'+ getcandidates[temp])
            getimages[temp] = await election.methods.images(temp).call()
            imageurls[temp] = 'https://ipfs.infura.io/ipfs/' + getimages[temp].imghash.toString()
            console.log(imageurls[temp])
          }

          this.setState({candidates: getcandidates})
          this.setState({images: getimages})
          this.setState({urls: imageurls})

          if(!voterid.authenticated){
            window.alert("Login first")
            window.location.href= "../login"
          }else{
            this.setState({head: "Vote Here"})
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
          account: '0x0',
          message: '',
          head: '',
          candidates: [],
          images: [],
          urls: []
        }
      }
 

      render() {
        return (
          <>
          <Head><title>{this.state.head}</title></Head>
        <div>
        <Segment basic inverted padded='very' raised size='massive'>
            <h1><b>Vote Here</b></h1></Segment>
        <div style = {{paddingLeft: '45px'}}>
        <VoteCard imgsrc ={this.state.imageurls} candidateName ='test one' candidateParty='BJP' candidateAgenda='JSR'></VoteCard>
        </div>
        <h2>{this.state.message}</h2>
        <h1>{this.state.account}</h1>
        </div>
          </>
        );
      } 

    }