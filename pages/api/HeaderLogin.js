import React from 'react'
import { Header, Segment } from 'semantic-ui-react'

const EHeader = () => (
  <Segment basic inverted raised size='small' padded='very' vertical >
    <Header as='h1'>D-Election</Header>
    <h1>Election based on Blockhain</h1>
    <h3 className='intro-h3'>Made using Truffle, ReactJS and Ganache</h3>
    </Segment>
)

export default EHeader