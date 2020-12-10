
import React, { Component } from 'react'
import Web3 from 'web3'
import Election from '../build/contracts/Election.json'
import {Segment, Statistic, Progress, Button,Form } from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css'
import 'next/router'


export default class Result extends Component{

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
        

        let winner = await election.methods.winner().call();
        this.setState({winner: winner})
        

        

        console.log(this.state.winner)
        // if(winner.id ==0){
        //   window.alert("Result not declared yet")
        // }
        
        let winner_image = await election.methods.images(winner.id).call();
        let url = 'https://ipfs.infura.io/ipfs/'+ winner_image.imghash
        this.setState({winnerImage: url})

        let candidate1 = await election.methods.candidates(1).call()
        let candidate2 = await election.methods.candidates(2).call()
        let candidate3 = await election.methods.candidates(3).call()
        let candidate4 = await election.methods.candidates(4).call()

       
        
        let votersCount = await election.methods.votersCount().call({from: this.state.account})
        
        let candidate1percent = (candidate1.voteCount/votersCount)*100
        let candidate2percent = (candidate2.voteCount/votersCount)*100
        let candidate3percent = (candidate3.voteCount/votersCount)*100
        let candidate4percent = (candidate4.voteCount/votersCount)*100

        

        this.setState({votersCount: votersCount})
        this.setState({candidate1: candidate1})
        this.setState({candidate2: candidate2})
        this.setState({candidate3: candidate3})
        this.setState({candidate4: candidate4})

        let percentages = [candidate1percent,candidate2percent,candidate3percent, candidate4percent]
        this.setState({percentages: percentages})

        let max = 0
        for(let i=0; i < 4; i++ ){
          if(percentages[max]<percentages[i]){
            max = i
          }
        }

        this.setState({winnerPercent: percentages[max]})
        
        
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
        url: '',
        winner: [],
        winnerImage: '',
        percentages: [],
        candidate1: [],
          candidate2: [],
          candidate3: [],
          candidate4: [],
          votersCount: 0

        
      }
      
}






render() {
  return (
    <>
    <Segment basic inverted padded='very' raised size='huge' vertical>
            <h1><b>Result</b></h1></Segment>
    <body className='result'>
    <div style = {{paddingLeft: '75px', paddingTop: '35px',float:'left'}}>
    <div className="ui card"><div className="image"><img src={this.state.winnerImage}/></div><div className="content"><div className="header">{this.state.winner.name}</div><div><Statistic>
  <Statistic.Value>{this.state.winner.voteCount}/{this.state.votersCount}</Statistic.Value>
    <Statistic.Label>Votes</Statistic.Label>
  </Statistic></div><div className="description">{this.state.winner.agenda}</div></div></div>
    </div>
    <div style = {{ paddingLeft: '500px', paddingRight: '250px',paddingTop:'35px'}}>
    <Segment inverted>
    <Progress percent={this.state.percentages[0]} inverted color='red' progress />
    <Progress percent={this.state.percentages[1]} inverted color='violet' progress />
    <Progress percent={this.state.percentages[2]} inverted color='yellow' progress />
    <Progress percent={this.state.percentages[3]} inverted color='blue' progress />
  </Segment>
</div>
<div style={{paddingTop: '50px',paddingLeft:'150px'}}>

  <button className="ui red button" style={{marginRight: '4rem'}} >{this.state.candidate1.name}</button>
  <button className="ui violet button" style={{marginRight: '4rem'}}>{this.state.candidate2.name}</button>
  <button className="ui yellow button" style={{marginRight: '4rem'}}>{this.state.candidate3.name}</button>
  <button className="ui blue button" >{this.state.candidate4.name}</button>
 
</div>

<br/>
<br/>
<br/>
<br/>
<br/>
<br/>
<br/>
<br/>
<br/>
<br/>
<br/>

</body>
    </>
  )
}
}
