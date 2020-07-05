import React, { useState, useEffect } from "react";
import { css } from "@emotion/core";
import Tile from "../components/Tile";
import GlobalCSS from "../components/GlobalCSS";

export default () => {
  const gridDimension = 5;
  const populationGoal = 8;
  const numOfDistricts = 5;
  const totalPopulation = populationGoal * numOfDistricts;

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
            right: false,
          },
          color: 0,
          population: [],
        };
      }
    }

    //Allocate citizens
    //Party 1 Wins one more than half
    let districtsCreated = 0;
    let badGrid = true;


    while(badGrid){
      for (let i = 0; i < (numOfDistricts + 2) / 2; i++) {
        console.log("DISTRICT:");
        districtsCreated++;
        const party1Citizens =
          Math.floor(populationGoal / 2) + 1 + Math.floor(Math.random() * 2);
        const party2Citizens = populationGoal - party1Citizens;

        let district1s = [],
          district2s = [];

        while (party1Citizens + party2Citizens > 4) {
          let totalNumberOfCitizens = 0;
          let numOf1s = 0,
            numOf2s = 0;
          const goalTotalNumber = 3 + Math.floor(Math.random() * 2);
          while (totalNumberOfCitizens < goalTotalNumber) {
            if (Math.random() > 0.5) {
              if (party1Citizens > 0) {
                numOf1s++;
                party1Citizens--;
                totalNumberOfCitizens++;
              }
            } else {
              if (party2Citizens > 0) {
                numOf2s++;
                party2Citizens--;
                totalNumberOfCitizens++;
              }
            }
          }

          console.log(
            numOf1s + "-" + numOf2s
          );
          district1s.push(numOf1s);
          district2s.push(numOf2s);
        }

        console.log(party1Citizens + "-" + party2Citizens);
        district1s.push(party1Citizens);
        district2s.push(party2Citizens);

        const attemptToPlace = placeCitizens(tempGrid, district1s, district2s);
        if(attemptToPlace.length > 0){
          tempGrid = attemptToPlace;
        } else{
          badGrid = true;
        }
      }

      console.log("---");

      for (let i = 0; i < numOfDistricts - districtsCreated + 1; i++) {
        console.log("DISTRICT:");
        let party2Citizens = populationGoal - Math.floor(Math.random() * 2 + 1);
        let party1Citizens = populationGoal - party2Citizens;

        let district1s = [],
          district2s = [];

        while (party1Citizens + party2Citizens > 4) {
          let totalNumberOfCitizens = 0;
          let numOf1s = 0,
            numOf2s = 0;
          const goalTotalNumber = 3 + Math.floor(Math.random() * 2);
          while (totalNumberOfCitizens < goalTotalNumber) {
            if (Math.random() > 0.5) {
              if (party1Citizens > 0) {
                numOf1s++;
                party1Citizens--;
                totalNumberOfCitizens++;
              }
            } else {
              if (party2Citizens > 0) {
                numOf2s++;
                party2Citizens--;
                totalNumberOfCitizens++;
              }
            }
          }
          console.log(numOf1s + "-" + numOf2s);
          district1s.push(numOf1s);
          district2s.push(numOf2s);
        }

        console.log(party1Citizens + "-" + party2Citizens);
        district1s.push(party1Citizens);
        district2s.push(party2Citizens);

        const attemptToPlace = placeCitizens(tempGrid, district1s, district2s);
        if(attemptToPlace.length > 0){
          tempGrid = attemptToPlace;
          badGrid = false;
        } else{
          badGrid = true;
        }
      }
    }

    let totalParty1 = 0, totalParty2 = 0;
    for(const row of tempGrid){
      for(const tile of row){
        for(const citizen of tile.population){
          if(citizen === 1){
            totalParty1++;
          } else if(citizen === 2){
            totalParty2++;
          }
        }
      }
    }

    console.log("POPULAR VOTE:", totalParty1, totalParty2);

    setGrid(tempGrid);
  }, []);

  function placeCitizens(currGrid, party1, party2) {
    console.log("called");
    let successfullyPlaced = false;
    let attempts = 0;

    while (!successfullyPlaced && attempts < gridDimension * gridDimension) {
      attempts++;

      const tryingX = Math.floor(Math.random() * gridDimension);
      const tryingY = Math.floor(Math.random() * gridDimension);

      if (currGrid[tryingX][tryingY].population.length === 0) {
        let neighbors = 0;
        let valid = [];

        if (
          tryingX !== 0 &&
          currGrid[tryingX - 1][tryingY].population.length === 0
        ) {
          neighbors++;
          valid.push({
            x: -1,
            y: 0
          });
        }

        if (
          tryingX !== gridDimension - 1 &&
          currGrid[tryingX + 1][tryingY].population.length === 0
        ) {
          neighbors++;
          valid.push({
            x: 1,
            y: 0
          });
        }

        if (
          tryingY !== 0 &&
          currGrid[tryingX][tryingY - 1].population.length === 0
        ) {
          neighbors++;
          valid.push({
            x: 0,
            y: -1
          });
        }

        if (
          tryingY !== gridDimension - 1 &&
          currGrid[tryingX][tryingY + 1].population.length === 0
        ) {
          neighbors++;
          valid.push({
            x: 0,
            y: 1
          });
        }

        if (neighbors < party1.length) {
          console.log("unsuccessful");
          continue;
        } else {
          console.log("successful at ", tryingX, " ", tryingY, valid);
          successfullyPlaced = true;
        }

        let origin = [];
        for (let i = 0; i < party1[0]; i++) {
          origin.push(1);
        }
        for (let i = 0; i < party2[0]; i++) {
          origin.push(2);
        }
        origin.sort(() => Math.random() - 0.5);
        currGrid[tryingX][tryingY].population = origin;

        let leftToPlace = party1.length - 1;
        let index = 1;

        while(leftToPlace > 0){
          console.log(valid);
          const randomDir = Math.floor(Math.random() * valid.length);
          const offset = valid[randomDir];
          const x = tryingX + offset.x;
          const y = tryingY + offset.y;
          valid.splice(randomDir, 1);

          console.log(x, y);

          let placing = [];
          for (let j = 0; j < party1[index]; j++) {
            placing.push(1);
          }
          for (let j = 0; j < party2[index]; j++) {
            placing.push(2);
          }
          placing.sort(() => Math.random() - 0.5);

          currGrid[x][y].population = placing;

          index++;
          leftToPlace--;
        }
      } 

      if(attempts >= gridDimension * gridDimension){
        console.log("CATASTROPHIC FALIURE");
        return [];
      }
    }

    return currGrid;
  }

  function addSelection(x, y) {
    let gridNow = JSON.parse(JSON.stringify(grid));
    let selectionsNow = JSON.parse(JSON.stringify(selectedTiles));

    selectionsNow.push({ x, y });

    setGrid(gridNow);

    if (selectionsNow.length === 2) {
      const diffInX = Math.abs(selectionsNow[0].x - selectionsNow[1].x);
      const diffInY = Math.abs(selectionsNow[0].y - selectionsNow[1].y);

      if ((diffInX ^ diffInY) === 1) {
        if (diffInY === 0) {
          //vertical
          if (selectionsNow[0].x > selectionsNow[1].x) {
            gridNow[selectionsNow[0].x][
              selectionsNow[0].y
            ].connections.top = true;
            gridNow[selectionsNow[1].x][
              selectionsNow[1].y
            ].connections.bottom = true;
          } else {
            gridNow[selectionsNow[0].x][
              selectionsNow[0].y
            ].connections.bottom = true;
            gridNow[selectionsNow[1].x][
              selectionsNow[1].y
            ].connections.top = true;
          }
        } else {
          //horizontal
          if (selectionsNow[0].y > selectionsNow[1].y) {
            gridNow[selectionsNow[0].x][
              selectionsNow[0].y
            ].connections.left = true;
            gridNow[selectionsNow[1].x][
              selectionsNow[1].y
            ].connections.right = true;
          } else {
            gridNow[selectionsNow[0].x][
              selectionsNow[0].y
            ].connections.right = true;
            gridNow[selectionsNow[1].x][
              selectionsNow[1].y
            ].connections.left = true;
          }
        }

        let districtsNow = JSON.parse(JSON.stringify(districts));
        let alreadyInDistrict = false;
        let duplicateDistrict = false;
        let districtIn = -1;
        let newTile = -1;

        for (let d = 0; d < districtsNow.length; d++) {
          let tilesInDistrict = 0;
          for (let t = 0; t < districtsNow[d].tilesIncluded.length; t++) {
            const xPos = districtsNow[d].tilesIncluded[t].x;
            const yPos = districtsNow[d].tilesIncluded[t].y;

            if (xPos === selectionsNow[0].x && yPos === selectionsNow[0].y) {
              alreadyInDistrict = true;
              districtIn = d;
              newTile = 1;
              tilesInDistrict++;
            }

            if (xPos === selectionsNow[1].x && yPos === selectionsNow[1].y) {
              alreadyInDistrict = true;
              districtIn = d;
              newTile = 0;
              tilesInDistrict++;
            }

            if (tilesInDistrict > 1) {
              duplicateDistrict = true;

              let tileToRemove = -1;

              if (diffInY === 0) {
                //vertical
                if (selectionsNow[0].x > selectionsNow[1].x) {
                  gridNow[selectionsNow[0].x][
                    selectionsNow[0].y
                  ].connections.top = false;
                  gridNow[selectionsNow[1].x][
                    selectionsNow[1].y
                  ].connections.bottom = false;

                  if (
                    gridNow[selectionsNow[0].x][selectionsNow[0].y].connections
                      .right ||
                    gridNow[selectionsNow[0].x][selectionsNow[0].y].connections
                      .left ||
                    gridNow[selectionsNow[0].x][selectionsNow[0].y].connections
                      .bottom
                  ) {
                    tileToRemove = 1;
                  } else {
                    tileToRemove = 0;
                  }
                } else {
                  gridNow[selectionsNow[0].x][
                    selectionsNow[0].y
                  ].connections.bottom = false;
                  gridNow[selectionsNow[1].x][
                    selectionsNow[1].y
                  ].connections.top = false;

                  if (
                    gridNow[selectionsNow[0].x][selectionsNow[0].y].connections
                      .right ||
                    gridNow[selectionsNow[0].x][selectionsNow[0].y].connections
                      .left ||
                    gridNow[selectionsNow[0].x][selectionsNow[0].y].connections
                      .top
                  ) {
                    tileToRemove = 1;
                  } else {
                    tileToRemove = 0;
                  }
                }
              } else {
                //horizontal
                if (selectionsNow[0].y > selectionsNow[1].y) {
                  gridNow[selectionsNow[0].x][
                    selectionsNow[0].y
                  ].connections.left = false;
                  gridNow[selectionsNow[1].x][
                    selectionsNow[1].y
                  ].connections.right = false;

                  if (
                    gridNow[selectionsNow[0].x][selectionsNow[0].y].connections
                      .right ||
                    gridNow[selectionsNow[0].x][selectionsNow[0].y].connections
                      .top ||
                    gridNow[selectionsNow[0].x][selectionsNow[0].y].connections
                      .bottom
                  ) {
                    tileToRemove = 1;
                  } else {
                    tileToRemove = 0;
                  }
                } else {
                  gridNow[selectionsNow[0].x][
                    selectionsNow[0].y
                  ].connections.right = false;
                  gridNow[selectionsNow[1].x][
                    selectionsNow[1].y
                  ].connections.left = false;

                  if (
                    gridNow[selectionsNow[0].x][selectionsNow[0].y].connections
                      .left ||
                    gridNow[selectionsNow[0].x][selectionsNow[0].y].connections
                      .top ||
                    gridNow[selectionsNow[0].x][selectionsNow[0].y].connections
                      .bottom
                  ) {
                    tileToRemove = 1;
                  } else {
                    tileToRemove = 0;
                  }
                }
              }

              for (
                let p = 0;
                p < districtsNow[districtIn].tilesIncluded.length;
                p++
              ) {
                if (
                  districtsNow[districtIn].tilesIncluded[p].x ===
                    selectionsNow[tileToRemove].x &&
                  districtsNow[districtIn].tilesIncluded[p].y ===
                    selectionsNow[tileToRemove].y
                ) {
                  districtsNow[districtIn].tilesIncluded.splice(p, 1);
                  districtsNow[districtIn].totalPopulation -=
                    gridNow[selectionsNow[tileToRemove].x][
                      selectionsNow[tileToRemove].y
                    ].population.length;

                  gridNow[selectionsNow[tileToRemove].x][
                    selectionsNow[tileToRemove].y
                  ].color = 0;

                  districtsNow[districtIn].everyDistrictCitizen = [];

                  for (const tile of districtsNow[districtIn].tilesIncluded) {
                    districtsNow[
                      districtIn
                    ].everyDistrictCitizen = districtsNow[
                      districtIn
                    ].everyDistrictCitizen.concat(
                      gridNow[tile.x][tile.y].population
                    );
                  }

                  let districtParty = 0;
                  if (
                    districtsNow[districtIn].totalPopulation === populationGoal
                  ) {
                    let party1s = 0,
                      party2s = 0;
                    for (const citizen of districtsNow[districtIn]
                      .everyDistrictCitizen) {
                      switch (citizen) {
                        case 1:
                          party1s++;
                          break;
                        case 2:
                          party2s++;
                          break;
                        default:
                          break;
                      }
                    }

                    if (party1s > party2s) {
                      districtParty = 1;
                    } else if (party2s > party1s) {
                      districtParty = 2;
                    }
                  }

                  districtsNow[districtIn].party = districtParty;
                  for (const tileInCompleteDistrict of districtsNow[districtIn]
                    .tilesIncluded) {
                    gridNow[tileInCompleteDistrict.x][
                      tileInCompleteDistrict.y
                    ].color = districtParty;
                  }
                }
              }
            }
          }
        }

        if (!alreadyInDistrict && !duplicateDistrict) {
          let combinedCitizens = [];
          for (const citizen of gridNow[selectionsNow[0].x][selectionsNow[0].y]
            .population) {
            combinedCitizens.push(citizen);
          }

          for (const citizen of gridNow[selectionsNow[1].x][selectionsNow[1].y]
            .population) {
            combinedCitizens.push(citizen);
          }

          const districtPopulation =
            gridNow[selectionsNow[0].x][selectionsNow[0].y].population.length +
            gridNow[selectionsNow[1].x][selectionsNow[1].y].population.length;
          let districtParty = 0;
          if (districtPopulation === populationGoal) {
            let party1s = 0,
              party2s = 0;
            for (const citizen of combinedCitizens) {
              switch (citizen) {
                case 1:
                  party1s++;
                  break;
                case 2:
                  party2s++;
                  break;
                default:
                  break;
              }
            }

            if (party1s > party2s) {
              districtParty = 1;
            } else if (party2s > party1s) {
              districtParty = 2;
            }
          }

          gridNow[selectionsNow[0].x][selectionsNow[0].y].color = districtParty;
          gridNow[selectionsNow[1].x][selectionsNow[1].y].color = districtParty;

          districtsNow.push({
            tilesIncluded: [
              {
                x: selectionsNow[0].x,
                y: selectionsNow[0].y,
              },
              {
                x: selectionsNow[1].x,
                y: selectionsNow[1].y,
              },
            ],
            totalPopulation: districtPopulation,
            everyDistrictCitizen: combinedCitizens,
            party: districtParty,
          });
        } else if (!duplicateDistrict) {
          districtsNow[districtIn].tilesIncluded.push({
            x: selectionsNow[newTile].x,
            y: selectionsNow[newTile].y,
          });
          districtsNow[districtIn].totalPopulation +=
            gridNow[selectionsNow[newTile].x][
              selectionsNow[newTile].y
            ].population.length;
          for (const citizen of gridNow[selectionsNow[newTile].x][
            selectionsNow[newTile].y
          ].population) {
            districtsNow[districtIn].everyDistrictCitizen.push(citizen);
          }

          let districtParty = 0;
          if (districtsNow[districtIn].totalPopulation === populationGoal) {
            let party1s = 0,
              party2s = 0;
            for (const citizen of districtsNow[districtIn]
              .everyDistrictCitizen) {
              switch (citizen) {
                case 1:
                  party1s++;
                  break;
                case 2:
                  party2s++;
                  break;
                default:
                  break;
              }
            }

            if (party1s > party2s) {
              districtParty = 1;
            } else if (party2s > party1s) {
              districtParty = 2;
            }
          }

          districtsNow[districtIn].party = districtParty;
          for (const tileInCompleteDistrict of districtsNow[districtIn]
            .tilesIncluded) {
            gridNow[tileInCompleteDistrict.x][
              tileInCompleteDistrict.y
            ].color = districtParty;
          }
        }

        console.log(districtsNow);
        setDistricts(districtsNow);
      }

      setSelectedTiles([]);
    } else {
      setSelectedTiles(selectionsNow);
    }
  }

  return (
    <>
      <GlobalCSS />
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
              css={css`
                height: calc(
                  (80vh - (5px * ${gridDimension + 1})) / ${gridDimension}
                );
                margin: 5px 0;

                :last-of-type {
                  border-bottom: none;
                }
              `}
            >
              {row.map((tile, tileIndex) => {
                return (
                  <>
                    <Tile
                      dimension={gridDimension}
                      color={tile.color}
                      connections={tile.connections}
                      population={tile.population}
                      onClick={() => {
                        addSelection(rowIndex, tileIndex);
                      }}
                    />
                  </>
                );
              })}
            </div>
          );
        })}
      </div>
    </>
  );
};
