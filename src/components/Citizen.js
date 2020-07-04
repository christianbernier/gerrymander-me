import React from "react";
import {css} from "@emotion/core";

export default ({party}) => {
  let colorToShow = "black";
  switch(party % 3){
    case 0: colorToShow = "white"; break;
    case 1: colorToShow = "red"; break;
    case 2: colorToShow = "blue"; break;
    default: colorToShow = "black";
  }

  return(
    <div
      css={css`
        width: 10%;
        height: 25%;
        border-radius: 5px;
        background-color: ${colorToShow};
        margin: 0 5px;
      `}
    />
  )
}