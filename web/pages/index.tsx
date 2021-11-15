import type { NextPage } from 'next'
import Head from 'next/head'

const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>deconstruct</title>
        <meta name="description" content="deconstruct" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h1>deconstruct</h1>
      
      <p>Record.<br />Replay.<br />Debug.</p>
    </div>
  )
}

export default Home
