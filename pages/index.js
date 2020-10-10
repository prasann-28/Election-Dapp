import Head from 'next/head'
import Link from 'next/link'
import styles from '../styles/Home.module.css'
import React from 'react'
import ReactDOM from 'react-dom'




export default function Home() {
  return (
   <>
   <Head><title>Election</title></Head>
      <header><h2 className='greeting'>Welcome to the election</h2></header>
    <body>
      <div>
        <h2>Hello there</h2>
        <Link href='./login'>Click here to login</Link>
      </div>

    </body>
   
   </>
  )
}
