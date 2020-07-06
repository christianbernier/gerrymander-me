import React from "react";
import {css} from "@emotion/core";
import Citizen from "../components/Citizen";

export default ({dimension, color, connections, population, onClick, primaryParty}) => {
  let colorToShow = "black";
  if(primaryParty === "red"){
    switch(color){
      case 0: colorToShow = "white"; break;
      case 1: colorToShow = "#ff8f8f"; break;
      case 2: colorToShow = "#8f93ff"; break;
      default: colorToShow = "black";
    }
  } else if(primaryParty === "blue"){
    switch(color){
      case 0: colorToShow = "white"; break;
      case 1: colorToShow = "#8f93ff"; break;
      case 2: colorToShow = "#ff8f8f"; break;
      default: colorToShow = "black";
    }
  }
  

  const maxBorderRadius = "40%";

  return(
    <div
      css={css`
        width: calc((70vh - (5px * ${dimension + 1})) / ${dimension});
        height: 100%;
        margin: 0 2.5px;
        display: inline-flex;
        background-color: ${colorToShow};
        border-top-left-radius: ${(connections.top || connections.left) ? "0" : maxBorderRadius};
        border-top-right-radius: ${(connections.top || connections.right) ? "0" : maxBorderRadius};
        border-bottom-left-radius: ${(connections.bottom || connections.left) ? "0" : maxBorderRadius};
        border-bottom-right-radius: ${(connections.bottom || connections.right) ? "0" : maxBorderRadius};

        flex-direction: row;
        align-items: center;
        justify-content: center;

        :first-child{
          margin-left: 5px;
        }
      `}
      onClick = {onClick}
    >
      {
        (population.length > 0) ? 
        (
          population.map(citizen => {
            return(
              <Citizen
                party = {citizen}
                primaryParty = {primaryParty}
              />
            )
          })
        ) : (
          <Citizen
            party = {0}
            primaryParty = {primaryParty}
          />
        )
        
      }
    </div>
  )
}