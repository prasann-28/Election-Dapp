import React from 'react'
import { Button, Form } from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css'

const Loading = () => (
  <Form loading>
    <Form.Input label='Email' placeholder='joe@schmoe.com' />
    <Button>Submit</Button>
  </Form>
)

export default Loading