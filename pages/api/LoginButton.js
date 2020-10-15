import React from 'react'
import Link from 'next/link'
import { Button, Icon } from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css';


const LoginButton = () => (
  <div>
    <Button animated='fade'>
      <Button.Content visible >Login</Button.Content>
      <Button.Content hidden>
      <Link href='../login'>
        <Icon name='arrow right' />
        </Link>
      </Button.Content>
    </Button>
    <Button animated='fade'>
      <Button.Content visible>Register your account</Button.Content>
      <Button.Content hidden>
      <Link href='../register'><Icon name='chevron circle right' /></Link>
      </Button.Content>
    </Button>
  </div>
)

export default LoginButton