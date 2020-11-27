import React from 'react'
import { Button, Card, Image } from 'semantic-ui-react'


const VoteCard =  (props) => (
  <div className="ui card" style={{alignSelf: "center"}}>
    <div className="image">
      <img src={props.imgsrc} style ={{width:'290px', height: '290px'}}/>
    </div>
    <div className="content">
<div className="header">{props.candidateName}</div>
      <div className="meta"><span className="date">{props.party}</span></div>
      <div className="description">{props.candidateAgenda}</div>
      </div>
      <div style={{paddingBottom : "1rem"}}>
      <Button positive onClick={props.onClick}>Cast Vote</Button>
        </div>
  </div>
)

export default VoteCard