import type { NextPage } from "next"
import Head from "next/head"

const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>deconstruct</title>
        <meta name="description" content="deconstruct" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div
        style={{
          textAlign: "center",
          width: "100%",
          maxWidth: "680px",
          padding: "20px",
          margin: "0 auto",
        }}
      >
        <h1>deconstruct</h1>

        <h3
          style={{
            fontFamily: "monospace",
            textTransform: "lowercase",
          }}
        >
          Capture &middot; Replay &middot; Debug
        </h3>

        <p
          style={{
            width: "100%",
            maxWidth: "460px",
            margin: "0 auto",
          }}
        >
          A tool for front-end developers to debug their code from production
          and verify fixes with absolute certainity and without guesswork.
        </p>

        <p>
          see on{" "}
          <a href="https://github.com/abstractalgo/deconstruct">Github</a>
        </p>

        <hr />

        <h3>how it works?</h3>

        <ol
          style={{
            display: "inline-block",
            margin: "0, auto",
            textAlign: "left",
          }}
        >
          <li>inject recorder script &amp; capture data</li>
          <li>replay captured data &amp; debug</li>
          <li>patch your app live &amp; push fixes</li>
        </ol>
      </div>
    </div>
  )
}

export default Home
