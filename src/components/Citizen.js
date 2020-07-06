import React from "react";
import {css} from "@emotion/core";

export default ({party, primaryParty}) => {
  let colorToShow = "black";
  if(primaryParty === "red"){
    switch(party % 3){
      case 0: colorToShow = "#00000000"; break;
      case 1: colorToShow = "red"; break;
      case 2: colorToShow = "blue"; break;
      default: colorToShow = "black";
    }
  } else if(primaryParty === "blue"){
    switch(party % 3){
      case 0: colorToShow = "#00000000"; break;
      case 1: colorToShow = "blue"; break;
      case 2: colorToShow = "red"; break;
      default: colorToShow = "black";
    }
  }
  

  return(
    <div
      css={css`
        width: 5px;
        height: 20px;
        border-radius: 100px;
        background-color: ${colorToShow};
        margin: 0 2px;
      `}
    />
  )
}