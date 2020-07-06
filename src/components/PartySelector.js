import React, {useState} from "react";
import {css} from "@emotion/core";

export default ({changeSelectedParty}) => {

  const [currentlySelected, setCurrentlySelected] = useState("red");

  const updateCurrentlySelectedParty = (party) => {
    setCurrentlySelected(party)
    changeSelectedParty(party);
  }

  return(
    <div
      css={css`
        width: 100%;
        height: 75px;
      `}
    >
      <div
        css={css`
          background-color: red;
          display: inline-flex;
          width: calc(50% - 14px);
          height: 100%;
          border-radius: 13px;
          border-top-right-radius: 0;
          border-bottom-right-radius: 0;
          border: ${(currentlySelected === "red") ? "7px solid #333" : "none"};
          align-items: center;
          justify-content: center;

          @media only screen and (max-width: 1310px) {
            width: 40vw;
          }
        `}
        onClick={() => updateCurrentlySelectedParty("red")}
      >
        <p
          css={css`
            font-size: 30px;
            color: white;
            font-weight: 700;
          `}
        >
          Red
        </p>
      </div>
      <div
        css={css`
          background-color: blue;
          display: inline-flex;
          width: calc(50% - 14px);
          height: 100%;
          border-radius: 13px;
          border-top-left-radius: 0;
          border-bottom-left-radius: 0;
          border: ${(currentlySelected === "blue") ? "7px solid #333" : "none"};
          align-items: center;
          justify-content: center;

          @media only screen and (max-width: 1310px) {
            width: 40vw;
          }
        `}
        onClick={() => updateCurrentlySelectedParty("blue")}
      >
        <p
          css={css`
            font-size: 30px;
            color: white;
            font-weight: 700;
          `}
        >
          Blue
        </p>
      </div>
    </div>
  )
}