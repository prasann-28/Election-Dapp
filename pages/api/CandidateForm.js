import React from 'react'
import { Icon, Image, Modal, Form, Button, Checkbox, Select } from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css'

const genderOptions = [
    { key: 'm', text: 'Male', value: 'male' },
    { key: 'f', text: 'Female', value: 'female' },
    { key: 'o', text: 'Other', value: 'other' },
  ]
const CandidateForm = (props) => {
  const [open, setOpen] = React.useState(false)

  return (
    <Modal
      open={open}
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
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
          <Form>
    <Form.Field>
      <label>Candidate Name</label>
      <input placeholder='Name' />
    </Form.Field>
    <Form.Field>
      <label>Party</label>
      <input placeholder='Party' value={props.name} onChange={event =>  props.setState({name: props.name}) } required/>
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
  )
}

export default CandidateForm