import React from 'react'
import Link from 'next/link'
import { Button, Icon } from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css';


const LoginButton = () => (
  <div >
    <div style={{float: "left", paddingLeft: '28rem'}}>
    <Button animated='fade' size='huge'>
      <Button.Content visible className='intro-button'>Login</Button.Content>
      <Button.Content hidden>
      <Link href='../login'>
        <Icon name='arrow right' />
        </Link>
      </Button.Content>
    </Button></div><div style={{float: "right", paddingRight:'28rem'}}>
    <Button animated='fade' size='huge'>
      <Button.Content visible className='intro-button' >Register your account</Button.Content>
      <Button.Content hidden>
      <Link href='../register'><Icon name='chevron circle right' /></Link>
      </Button.Content>
    </Button></div>
  </div>
)

export default LoginButton