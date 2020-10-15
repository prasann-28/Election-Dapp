import React from 'react'
import 'semantic-ui-react'
import LoginButton from './api/LoginButton'
import ContainerExampleText from './api/container'
import EHeader from './api/HeaderLogin'

export default function Home() {
  return (
   <>
    <div className='Home'><EHeader /></div>
   <div><ContainerExampleText/></div>
   <br/>
   <br/><br/>
   <div><LoginButton/></div>
   </>
  )
}
