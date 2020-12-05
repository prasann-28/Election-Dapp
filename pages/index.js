import React from 'react'
import LoginButton from './api/LoginButton'
import ContainerExampleText from './api/container'
import EHeader from './api/HeaderLogin'
import Head from 'next/head'
import {Icon} from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css'

export default function Home() {
  return (
   <>
   <Head><title>Welcome</title></Head>
    <div className='Home'><EHeader /></div>
   <body className='intro'><ContainerExampleText/>
   
   <LoginButton/>
   <br/>
   <br/>
   <br/>
   </body>
   </>
  )
}
