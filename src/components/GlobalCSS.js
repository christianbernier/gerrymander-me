import React from "react";
import {css, Global} from "@emotion/core";
import {Helmet} from "react-helmet-async";

export default () => {
  return(
    <>
      <Helmet>
        <title>GerrymanderMe!</title>
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="GerrymanderMe!" />
        <meta property="og:title" content="GerrymanderMe!" />
        <meta property="og:description" content="Help a corrupt government gerrymander districts as fast as possible!" />
        <meta property="twitter:card" content="summary_large_image" />
        {/* <meta property="og:image" content="https://cdn.glitch.com/d0248aaf-2315-4c71-a38d-f7d60856f1f7%2FShare%20Image.png?v=1584911180910"/> */}
        <meta property="description" content="Help a corrupt government gerrymander districts as fast as possible!"/>
      </Helmet>
      <Global
        styles={css`
          @import url('https://rsms.me/inter/inter.css');

          :root{
            --dark-background: #2D3748;
            --font-white: #F7FAFC;
            font-family: "Inter", Arial, Helvetica, sans-serif;
          }

          body{
            padding: 0;
            margin: 0;
            background-color: #F7FAFC;
          }

          p{
            color: var(--dark-background)
          }

          .fare{
            font-size: 18px;
            font-weight: 450;
            margin-top: -5px;
          }

        `}
      />
    </>
  )
}