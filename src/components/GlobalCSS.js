import React from "react";
import {css, Global} from "@emotion/core";
import {Helmet} from "react-helmet-async";

import Favicon from "../../favicon.png";
import ShareImage from "../../share-image.png";

export default () => {
  return(
    <>
      <Helmet>
        <title>GerrymanderMe!</title>
        <link rel="shortcut icon" href={Favicon} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="GerrymanderMe!" />
        <meta property="og:title" content="GerrymanderMe!" />
        <meta property="og:description" content="Help a corrupt government gerrymander districts as fast as possible!" />
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="og:image" content={ShareImage}/>
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
            background-color: #ccc;
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