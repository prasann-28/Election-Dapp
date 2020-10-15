import React from 'react'
import 'semantic-ui-react'
import LoginButton from './api/LoginButton'
import ContainerExampleText from './api/container'
import EHeader from './api/HeaderLogin'
import Head from 'next/head'

export default function Home() {
  return (
   <>
   <Head><title>Welcome</title></Head>
    <div className='Home'><EHeader /></div>
   <div><ContainerExampleText/></div>
   <br/>
   <br/><br/>
   <div><LoginButton/></div>
   </>
  )
}
