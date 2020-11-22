import React from 'react'
import { Button, Card, Image } from 'semantic-ui-react'


const VoteCard = (props) => (
  <Card.Group>
    <Card>
      <Card.Content>
        <Image className = {props.name} 
          src = {props.imgsrc}
          floated='right'
          size='medium'
          
        />
        <Card.Header>{props.candidateName}</Card.Header>
        <Card.Meta>{props.candidateParty}</Card.Meta>
        <Card.Description>
           <strong>{props.candidateAgenda}</strong>
        </Card.Description>
      </Card.Content>
      <Card.Content extra>
        <div className='ui two buttons'>
          <Button basic color='green'>
            Approve
          </Button>
        </div>
      </Card.Content>
    </Card>
  </Card.Group>
)

export default VoteCard