import React, { useState, useEffect } from "react";
import { css } from "@emotion/core";
import Tile from "../components/Tile";
import GlobalCSS from "../components/GlobalCSS";

export default () => {
  const gridDimension = 5;
  const populationGoal = 8;

  const [grid, setGrid] = useState([]);
  const [selectedTiles, setSelectedTiles] = useState([]);
  const [districts, setDistricts] = useState([]);

  useEffect(() => {
    //init grid
    let tempGrid = [];
    for (let i = 0; i < gridDimension; i++) {
      tempGrid[i] = [];
      for (let j = 0; j < gridDimension; j++) {
        tempGrid[i][j] = {
          connections: {
            top: false,
            bottom: false,
            left: false,
            right: false
          },
          color: 0,
          population: []
        };

        tempGrid[i][j].population.push(Math.floor(Math.random() * 2) + 1);

        const populationOfTile = Math.floor(Math.random() * 4);
        for(let a = 0; a < populationOfTile; a++){
          tempGrid[i][j].population.push(Math.floor(Math.random() * 2) + 1);
        }
      }
    }

    setGrid(tempGrid);
  }, []);

  function addSelection(x, y){
    let gridNow = JSON.parse(JSON.stringify(grid));
    let selectionsNow = JSON.parse(JSON.stringify(selectedTiles));

    selectionsNow.push({x, y});

    setGrid(gridNow);

    if(selectionsNow.length === 2){
      const diffInX = Math.abs(selectionsNow[0].x - selectionsNow[1].x);
      const diffInY = Math.abs(selectionsNow[0].y - selectionsNow[1].y);

      if((diffInX ^ diffInY) === 1){
        if(diffInY === 0){ //vertical
          if(selectionsNow[0].x > selectionsNow[1].x){
            gridNow[selectionsNow[0].x][selectionsNow[0].y].connections.top = true;
            gridNow[selectionsNow[1].x][selectionsNow[1].y].connections.bottom = true;
          } else{
            gridNow[selectionsNow[0].x][selectionsNow[0].y].connections.bottom = true;
            gridNow[selectionsNow[1].x][selectionsNow[1].y].connections.top = true;
          }
        } else{ //horizontal
          if(selectionsNow[0].y > selectionsNow[1].y){
            gridNow[selectionsNow[0].x][selectionsNow[0].y].connections.left = true;
            gridNow[selectionsNow[1].x][selectionsNow[1].y].connections.right = true;
          } else{
            gridNow[selectionsNow[0].x][selectionsNow[0].y].connections.right = true;
            gridNow[selectionsNow[1].x][selectionsNow[1].y].connections.left = true;
          }
        }

        let districtsNow = JSON.parse(JSON.stringify(districts));
        let alreadyInDistrict = false;
        let duplicateDistrict = false;
        let districtIn = -1;
        let newTile = -1;

        for(let d = 0; d < districtsNow.length; d++){
          let tilesInDistrict = 0;
          for(let t = 0; t < districtsNow[d].tilesIncluded.length; t++){
            const xPos = districtsNow[d].tilesIncluded[t].x;
            const yPos = districtsNow[d].tilesIncluded[t].y;

            if(xPos === selectionsNow[0].x && yPos === selectionsNow[0].y){
              alreadyInDistrict = true;
              districtIn = d;
              newTile = 1;
              tilesInDistrict++;
            }
            
            if(xPos === selectionsNow[1].x && yPos === selectionsNow[1].y){
              alreadyInDistrict = true;
              districtIn = d;
              newTile = 0;
              tilesInDistrict++;
            }

            if(tilesInDistrict > 1){
              duplicateDistrict = true;

              let tileToRemove = -1;

              if(diffInY === 0){ //vertical
                if(selectionsNow[0].x > selectionsNow[1].x){
                  gridNow[selectionsNow[0].x][selectionsNow[0].y].connections.top = false;
                  gridNow[selectionsNow[1].x][selectionsNow[1].y].connections.bottom = false;

                  if(gridNow[selectionsNow[0].x][selectionsNow[0].y].connections.right || gridNow[selectionsNow[0].x][selectionsNow[0].y].connections.left  || gridNow[selectionsNow[0].x][selectionsNow[0].y].connections.bottom){
                    tileToRemove = 1;
                  } else{
                    tileToRemove = 0;
                  }
                } else{
                  gridNow[selectionsNow[0].x][selectionsNow[0].y].connections.bottom = false;
                  gridNow[selectionsNow[1].x][selectionsNow[1].y].connections.top = false;

                  if(gridNow[selectionsNow[0].x][selectionsNow[0].y].connections.right || gridNow[selectionsNow[0].x][selectionsNow[0].y].connections.left  || gridNow[selectionsNow[0].x][selectionsNow[0].y].connections.top){
                    tileToRemove = 1;
                  } else{
                    tileToRemove = 0;
                  }
                }
              } else{ //horizontal
                if(selectionsNow[0].y > selectionsNow[1].y){
                  gridNow[selectionsNow[0].x][selectionsNow[0].y].connections.left = false;
                  gridNow[selectionsNow[1].x][selectionsNow[1].y].connections.right = false;

                  if(gridNow[selectionsNow[0].x][selectionsNow[0].y].connections.right || gridNow[selectionsNow[0].x][selectionsNow[0].y].connections.top  || gridNow[selectionsNow[0].x][selectionsNow[0].y].connections.bottom){
                    tileToRemove = 1;
                  } else{
                    tileToRemove = 0;
                  }
                } else{
                  gridNow[selectionsNow[0].x][selectionsNow[0].y].connections.right = false;
                  gridNow[selectionsNow[1].x][selectionsNow[1].y].connections.left = false;

                  if(gridNow[selectionsNow[0].x][selectionsNow[0].y].connections.left || gridNow[selectionsNow[0].x][selectionsNow[0].y].connections.top  || gridNow[selectionsNow[0].x][selectionsNow[0].y].connections.bottom){
                    tileToRemove = 1;
                  } else{
                    tileToRemove = 0;
                  }
                }
              }

              for(let p = 0; p < districtsNow[districtIn].tilesIncluded.length; p++){
                if(districtsNow[districtIn].tilesIncluded[p].x === selectionsNow[tileToRemove].x && districtsNow[districtIn].tilesIncluded[p].y === selectionsNow[tileToRemove].y){
                  districtsNow[districtIn].tilesIncluded.splice(p, 1);
                  districtsNow[districtIn].totalPopulation -= gridNow[selectionsNow[tileToRemove].x][selectionsNow[tileToRemove].y].population.length;

                  gridNow[selectionsNow[tileToRemove].x][selectionsNow[tileToRemove].y].color = 0;

                  districtsNow[districtIn].everyDistrictCitizen = [];

                  for(const tile of districtsNow[districtIn].tilesIncluded){
                    districtsNow[districtIn].everyDistrictCitizen = districtsNow[districtIn].everyDistrictCitizen.concat(gridNow[tile.x][tile.y].population);
                  }
        
                  let districtParty = 0;
                  if(districtsNow[districtIn].totalPopulation === populationGoal){
                    let party1s = 0, party2s = 0;
                    for(const citizen of districtsNow[districtIn].everyDistrictCitizen){
                      switch(citizen){
                        case 1: party1s++; break;
                        case 2: party2s++; break;
                        default: break;
                      }
                    }
        
                    if(party1s > party2s){
                      districtParty = 1;
                    } else if(party2s > party1s){
                      districtParty = 2;
                    }
                  }
        
                  districtsNow[districtIn].party = districtParty;
                  for(const tileInCompleteDistrict of districtsNow[districtIn].tilesIncluded){
                    gridNow[tileInCompleteDistrict.x][tileInCompleteDistrict.y].color = districtParty;
                  }
                }
              }

            }
          }
        }

        if(!alreadyInDistrict && !duplicateDistrict){
          let combinedCitizens = [];
          for(const citizen of gridNow[selectionsNow[0].x][selectionsNow[0].y].population){
            combinedCitizens.push(citizen);
          }

          for(const citizen of gridNow[selectionsNow[1].x][selectionsNow[1].y].population){
            combinedCitizens.push(citizen);
          }

          const districtPopulation = gridNow[selectionsNow[0].x][selectionsNow[0].y].population.length + gridNow[selectionsNow[1].x][selectionsNow[1].y].population.length;
          let districtParty = 0;
          if(districtPopulation === populationGoal){
            let party1s = 0, party2s = 0;
            for(const citizen of combinedCitizens){
              switch(citizen){
                case 1: party1s++; break;
                case 2: party2s++; break;
                default: break;
              }
            }

            if(party1s > party2s){
              districtParty = 1;
            } else if(party2s > party1s){
              districtParty = 2;
            }
          }

          gridNow[selectionsNow[0].x][selectionsNow[0].y].color = districtParty;
          gridNow[selectionsNow[1].x][selectionsNow[1].y].color = districtParty;

          districtsNow.push({
            tilesIncluded: [
              {
                x: selectionsNow[0].x,
                y: selectionsNow[0].y
              },
              {
                x: selectionsNow[1].x,
                y: selectionsNow[1].y
              }
            ],
            totalPopulation: districtPopulation,
            everyDistrictCitizen: combinedCitizens,
            party: districtParty
          });

          
        } else if(!duplicateDistrict){
          districtsNow[districtIn].tilesIncluded.push({
            x: selectionsNow[newTile].x,
            y: selectionsNow[newTile].y
          });
          districtsNow[districtIn].totalPopulation += gridNow[selectionsNow[newTile].x][selectionsNow[newTile].y].population.length;
          for(const citizen of gridNow[selectionsNow[newTile].x][selectionsNow[newTile].y].population){
            districtsNow[districtIn].everyDistrictCitizen.push(citizen);
          }

          let districtParty = 0;
          if(districtsNow[districtIn].totalPopulation === populationGoal){
            let party1s = 0, party2s = 0;
            for(const citizen of districtsNow[districtIn].everyDistrictCitizen){
              switch(citizen){
                case 1: party1s++; break;
                case 2: party2s++; break;
                default: break;
              }
            }

            if(party1s > party2s){
              districtParty = 1;
            } else if(party2s > party1s){
              districtParty = 2;
            }
          }

          districtsNow[districtIn].party = districtParty;
          for(const tileInCompleteDistrict of districtsNow[districtIn].tilesIncluded){
            gridNow[tileInCompleteDistrict.x][tileInCompleteDistrict.y].color = districtParty;
          }
        }

        console.log(districtsNow);
        setDistricts(districtsNow);
      }
  
      setSelectedTiles([]);
    } else{
      setSelectedTiles(selectionsNow);
    }

    
  }

  return (
    <>
      <GlobalCSS/>
      <div
        css={css`
          width: 80vh;
          max-width: 1000px;
          height: 80vh;
          max-height: 1000px;
          margin: 0 auto;
          border: 7px solid #333;
          border-radius: 20px;
          background-color: #111;
        `}
      >
        {grid.map((row, rowIndex) => {
          return (
            <div
              css = {css`
                height: calc((80vh - (5px * ${gridDimension + 1})) / ${gridDimension});
                margin: 5px 0;

                :last-of-type{
                  border-bottom: none;
                }
              `}
            >
              {row.map((tile, tileIndex) => {
                return(
                  <>
                    <Tile
                      dimension = {gridDimension}
                      color = {tile.color}
                      connections = {tile.connections}
                      population = {tile.population}
                      onClick = {() => {addSelection(rowIndex, tileIndex)}}
                    />
                  </>
                )
              })}
            </div>
          );
        })}
      </div>
    </>
  );
};
