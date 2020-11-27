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
   <body className='intro'><ContainerExampleText/>
   <br/>
   <br/><br/>
   <LoginButton/>
   <br/>
   <br/>
   <br/>
   </body>
   </>
  )
}
