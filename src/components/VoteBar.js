import React from "react";
import { css } from "@emotion/core";

export default ({ width, party1, party2, title, primaryParty }) => {
  let nonPrimaryParty = "green";
  switch(primaryParty){
    case "red": nonPrimaryParty = "blue"; break;
    case "blue": nonPrimaryParty = "red"; break;
    default: nonPrimaryParty = "red";
  }

  return (
    <div
      css={css`
        width: ${width};
        height: 40px;
        background-color: #222;
        border: 7px solid #333;
        border-radius: 100px;
        margin: 10px auto;

        @media only screen and (max-width: 1310px) {
          width: 90vw;
        }
      `}
    >
      <p
        css={css`
          font-size: 18px;
          font-weight: 800;
          color: white;
          z-index: 2;
          margin-top: 11px;
          width: 30%;
          width: 100%;
          text-align: center;
        `}
      >
        {title}
      </p>
      <p
        css={css`
          font-size: 18px;
          font-weight: 800;
          color: white;
          z-index: 2;
          margin-top: -39px;
          width: 30%;
          width: 100%;
          text-align: left;
          padding-left: 20px;
        `}
      >
        {Math.round(party1 * 100)}%
      </p>
      <p
        css={css`
          font-size: 18px;
          font-weight: 800;
          color: white;
          z-index: 2;
          margin-top: -39px;
          width: 30%;
          width: calc(100% - 20px);
          text-align: right;
        `}
      >
        {Math.round(party2 * 100)}%
      </p>
      <div
        css={css`
          width: calc(${width} * ${party1});
          height: 40px;
          background-color: ${primaryParty};
          z-index: 1;
          margin-top: -50px;
          border-radius: 100px;
          border-top-right-radius: 0;
          border-bottom-right-radius: 0;

          @media only screen and (max-width: 1310px) {
            width: calc(90vw * ${party1});
          }
        `}
      />
      <div
        css={css`
          width: calc(${width} * ${party2});
          height: 40px;
          background-color: ${nonPrimaryParty};
          z-index: 1;
          margin-top: -40.5px;
          border-radius: 100px;
          border-top-left-radius: 0;
          border-bottom-left-radius: 0;
          margin-left: calc(${width} - ${width} * ${party2});

          @media only screen and (max-width: 1310px) {
            width: calc(90vw * ${party2});
            margin-left: calc(90vw - 90vw * ${party2});
          }
        `}
      />
    </div>
  );
};
