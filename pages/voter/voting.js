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
         //  window.alert(candidatesCount)

          let imageCount = await election.methods.imageCount().call()
        // window.alert(imageCount)
          
          // if(candidatesCount==0){
          //   window.alert('No candidate present')
          //   window.location.href = "../"
          // }

          let candidate1 = await election.methods.candidates(1).call()
          let candidate2 = await election.methods.candidates(2).call()
          let candidate3 = await election.methods.candidates(3).call()
          let candidate4 = await election.methods.candidates(4).call()
          
         
          let image1 = await election.methods.images(1).call()
          let image2 = await election.methods.images(2).call()
          let image3 = await election.methods.images(3).call()
          let image4 = await election.methods.images(4).call()
        
          //console.log(image.imghash)
          let imageurl1 = "https://ipfs.infura.io/ipfs/" + image1.imghash
          let imageurl2 = "https://ipfs.infura.io/ipfs/" + image2.imghash
          let imageurl3 = "https://ipfs.infura.io/ipfs/" + image3.imghash
          let imageurl4 = "https://ipfs.infura.io/ipfs/" + image4.imghash


          this.setState({candidate1: candidate1})
          this.setState({candidate2: candidate2})
          this.setState({candidate3: candidate3})
          this.setState({candidate4: candidate4})


          this.setState({image1: image1})
          this.setState({image2: image2})
          this.setState({image3: image3})
          this.setState({image4: image4})


          this.setState({url1: imageurl1})
          this.setState({url2: imageurl2})
          this.setState({url3: imageurl3})
          this.setState({url4: imageurl4})

          // console.log(this.state.url1)
          // console.log(this.state.url1)
          // console.log(this.state.url1)
          

          
          // if(!voterid.authenticated){
          //   window.alert("Login first")
          //   window.location.href= "../login"
          // }else{
          //   this.setState({head: "Vote Here"})
          // }
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
          candidate1: [],
          candidate2: [],
          candidate3: [],
          candidate4: [],
          image1: [],
          image2: [],
          image3: [],
          image4: [],
          url1: '',
          url2: '',
          url3: '',
          url4: '',
          id: 0         
        }
      }

      onClick = async (cdid) => {
        try{
          // this.setState({id: cdid})
          // while(this.state.id==0){

          // }
          
          window.alert(cdid)
          let candidateid = cdid
          await this.state.election.methods.vote(cdid).send({from: this.state.account})
          let candidateVoted = await this.state.election.methods.candidates(candidateid).call()
          let voter = await this.state.election.methods.voters(this.state.account).call()

          console.log(candidateVoted.voteCount)
          console.log(voter.voted)
        }
        catch(err){
          window.alert("could not vote")
        }

       
      }

      // onMouseEnter = (_id) => {
      //   this.setState({id: _id})
      //   console.log(this.state.id)
      // }

      // onMouseLeave = () => {
      //   this.setState({id: 0})
      //   console.log(this.state.id)
      // }
 

      render() {
        return (
          <>
          <Head><title>{this.state.head}</title></Head>
        <Segment basic inverted padded='very' raised size='small' vertical>
            <h1><b>Vote Here</b></h1>
            <h3 className='intro-h3'>Cast your Vote Here</h3>
            </Segment>
        <div className='voting'>
        <div style = {{paddingLeft: '40px',float: 'left'}}>
        <VoteCard imgsrc ={this.state.url1} party='INC' candidateAgenda='Potato is Gold' candidateName={this.state.candidate1.name} onClick={() => this.onClick(this.state.candidate1.id)}
        ></VoteCard>
        </div>
        <div style = {{paddingLeft: '40px',float: 'left'}}>
        <VoteCard imgsrc ={this.state.url2} party='Republican' candidateAgenda='Make America great again' candidateName={this.state.candidate2.name} onClick={() => this.onClick(this.state.candidate2.id)}></VoteCard>
        </div>
        <div style = {{paddingLeft: '40px',float: 'left'}}>
        <VoteCard imgsrc ={this.state.url3} party='Other' candidateAgenda='Mitron...' candidateName={this.state.candidate3.name} onClick={() => this.onClick(this.state.candidate3.id)}></VoteCard>
        </div>
        <div style = {{paddingLeft: '40px',float: 'left'}}>
        <VoteCard imgsrc ={this.state.url4} candidateParty='BSP' candidateAgenda='JSR' candidateName={this.state.candidate4.name} onClick={() => this.onClick(this.state.candidate4.id)}></VoteCard>
        </div>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>

        </div>
               </>
        );
      } 

    }