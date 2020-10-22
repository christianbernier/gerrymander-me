import React, { useState, useEffect } from "react";
import { css } from "@emotion/core";

import Tile from "../components/Tile";
import GlobalCSS from "../components/GlobalCSS";
import VoteBar from "../components/VoteBar";
import PartySelector from "../components/PartySelector";

import Logo from "../../logo.png";

export default () => {
  const gridDimension = 9;
  const populationGoal = 8;
  const numOfDistricts = 13;
  const totalPopulation = populationGoal * numOfDistricts;

  const [grid, setGrid] = useState([]);
  const [selectedTiles, setSelectedTiles] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [popularVote, setPopularVote] = useState({ party1: "0", party2: "0" });
  const [districtVotes, setDistrictVotes] = useState({
    party1: "0",
    party2: "0",
  });
  const [partySelection, setPartySelection] = useState("red");

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

    while (badGrid) {
      for (let i = 0; i < (numOfDistricts + 2) / 2; i++) {
        // console.log("DISTRICT:");
        districtsCreated++;
        const party1Citizens =
          Math.floor(populationGoal / 2) + 1 + Math.floor(Math.random() * 2);
        const party2Citizens = populationGoal - party1Citizens;

        let district1s = [],
          district2s = [];

        while (party1Citizens + party2Citizens > 3) {
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

          // console.log(numOf1s + "-" + numOf2s);
          district1s.push(numOf1s);
          district2s.push(numOf2s);
        }

        // console.log(party1Citizens + "-" + party2Citizens);
        district1s.push(party1Citizens);
        district2s.push(party2Citizens);

        const attemptToPlace = placeCitizens(tempGrid, district1s, district2s);
        if (attemptToPlace.length > 0) {
          tempGrid = attemptToPlace;
        } else {
          badGrid = true;
        }
      }

      // console.log("---");

      for (let i = 0; i < numOfDistricts - districtsCreated + 1; i++) {
        //console.log("DISTRICT:");
        let party2Citizens = populationGoal - Math.floor(Math.random() * 2);
        let party1Citizens = populationGoal - party2Citizens;

        let district1s = [],
          district2s = [];

        while (party1Citizens + party2Citizens > 3) {
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
          //console.log(numOf1s + "-" + numOf2s);
          district1s.push(numOf1s);
          district2s.push(numOf2s);
        }

        //console.log(party1Citizens + "-" + party2Citizens);
        district1s.push(party1Citizens);
        district2s.push(party2Citizens);

        const attemptToPlace = placeCitizens(tempGrid, district1s, district2s);
        if (attemptToPlace.length > 0) {
          tempGrid = attemptToPlace;
          badGrid = false;
        } else {
          badGrid = true;
        }
      }
    }

    let totalParty1 = 0,
      totalParty2 = 0;
    for (const row of tempGrid) {
      for (const tile of row) {
        for (const citizen of tile.population) {
          if (citizen === 1) {
            totalParty1++;
          } else if (citizen === 2) {
            totalParty2++;
          }
        }
      }
    }

    setPopularVote({
      party1: totalParty1 / (totalParty1 + totalParty2),
      party2: totalParty2 / (totalParty1 + totalParty2),
    });

    setGrid(tempGrid);
  }, []);

  useEffect(() => {
    let currentGrid = JSON.parse(JSON.stringify(grid));
    if (!selectedTiles[0]) {
      return;
    }
    currentGrid[selectedTiles[0].x][selectedTiles[0].y].color = 3;
    setGrid(currentGrid);
  }, [selectedTiles]);

  function placeCitizens(currGrid, party1, party2) {
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
            y: 0,
          });
        }

        if (
          tryingX !== gridDimension - 1 &&
          currGrid[tryingX + 1][tryingY].population.length === 0
        ) {
          neighbors++;
          valid.push({
            x: 1,
            y: 0,
          });
        }

        if (
          tryingY !== 0 &&
          currGrid[tryingX][tryingY - 1].population.length === 0
        ) {
          neighbors++;
          valid.push({
            x: 0,
            y: -1,
          });
        }

        if (
          tryingY !== gridDimension - 1 &&
          currGrid[tryingX][tryingY + 1].population.length === 0
        ) {
          neighbors++;
          valid.push({
            x: 0,
            y: 1,
          });
        }

        if (neighbors < party1.length) {
          // console.log("unsuccessful");
          continue;
        } else {
          // console.log("successful at ", tryingX, " ", tryingY, valid);
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

        while (leftToPlace > 0) {
          // console.log(valid);
          const randomDir = Math.floor(Math.random() * valid.length);
          const offset = valid[randomDir];
          const x = tryingX + offset.x;
          const y = tryingY + offset.y;
          valid.splice(randomDir, 1);

          // console.log(x, y);

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

      if (attempts >= gridDimension * gridDimension) {
        // console.log("CATASTROPHIC FALIURE");
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

        // console.log(districtsNow);
        let party1Districts = 0,
          party2Districts = 0;
        for (const district of districtsNow) {
          if (district.party === 1) {
            party1Districts++;
          } else if (district.party === 2) {
            party2Districts++;
          }
        }
        setDistrictVotes({
          party1: party1Districts / (numOfDistricts + 1),
          party2: party2Districts / (numOfDistricts + 1),
        });
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
          display: grid;
          height: 100vh;
          width: 100vw;
          grid-template-areas:
            "logo play info"
            "foot foot foot";
          grid-template-columns: 25vw 50vw 25vw;
          grid-template-rows: auto 40px;

          @media only screen and (max-width: 1310px) {
            grid-template-areas:
              "logo"
              "play"
              "info"
              "foot";
            grid-template-columns: calc(100vw - 16px);
            grid-template-rows: auto auto auto 40px;
          }
        `}
      >
        <div
          css={css`
            grid-area: logo;
            width: 100%;
            height: 100%;
            padding: 10px 20px 0 20px;

            @media only screen and (max-width: 1310px) {
              width: 90vw;
            }
          `}
        >
          <img
            src={Logo}
            alt="GerrymanderMe logo"
            css={css`
              width: 300px;
              display: inline-block;
            `}
          />
          <div>
            <p
              css={css`
                font-size: 24px;
                color: #222;
                font-weight: 700;
              `}
            >
              Party Selector
            </p>
            <p
              css={css`
                font-size: 16px;
                color: #222;
                font-weight: 500;
                margin-top: -15px;
              `}
            >
              Which party would you like to work for?
            </p>
            <PartySelector
              changeSelectedParty={(value) => setPartySelection(value)}
            />
          </div>
          <div>
            <p
              css={css`
                font-size: 24px;
                font-weight: 700;
                color: #222;
              `}
            >
              Game information
            </p>
            <p
              css={css`
                font-size: 16px;
                color: #222;
                font-weight: 500;
                margin-top: -15px;
                padding-right: 30px;
              `}
            >
              This game was created in July of 2020 by Christian Bernier. It is
              currently an ongoing project, so more features will be coming
              soon!
              <br />
              <br />
              Please feel free to{" "}
              <a
                href="mailto:64christianb@gmail.com"
                target="_blank"
                css={css`
                  color: #555;
                `}
              >
                send me an email
              </a>{" "}
              with comments, questions, or bug reports!
              <br />
              <br />
              Also, this project is open source on{" "}
              <a
                href="https://github.com/christianbernier/gerrymander-me"
                target="_blank"
                css={css`
                  color: #555;
                `}
              >
                GitHub
              </a>
              .
            </p>
            <p
              css={css`
                font-size: 24px;
                font-weight: 700;
                color: #222;
              `}
            >
              Recent updates
            </p>
            <p
              css={css`
                font-size: 16px;
                color: #222;
                font-weight: 500;
                margin-top: -15px;
                padding-right: 30px;
              `}
            >
              GerrymanderMe! was last updated on October 22nd, 2020. In that update (v.0.2.0), the sizing of the grid was fixed, a color is displayed when selecting tiles, and some optimizations were made to the code.
            </p>
          </div>
        </div>
        <span
          css={css`
            display: inline-block;
            grid-area: play;
          `}
        >
          <VoteBar
            width="min(calc(50vw * 0.9), 70vh)"
            title="Popular Vote"
            party1={popularVote.party1}
            party2={popularVote.party2}
            primaryParty={partySelection}
          />

          <VoteBar
            width="min(calc(50vw * 0.9), 70vh)"
            title="District Vote"
            party1={districtVotes.party1}
            party2={districtVotes.party2}
            primaryParty={partySelection}
          />
          <div
            css={css`
              width: min(calc(50vw * 0.9), 70vh);
              height: min(calc(50vw * 0.9), 70vh);
              margin: 0 auto;
              border: 7px solid #333;
              border-radius: 20px;
              background-color: #111;

              @media only screen and (max-width: 1310px) {
                width: 90vw;
                height: 90vw;
              }
            `}
          >
            {grid.map((row, rowIndex) => {
              return (
                <div
                  css={css`
                    height: calc(
                      (
                          min(calc(50vw * 0.9), 70vh) -
                            (5px * ${gridDimension + 1})
                        ) / ${gridDimension}
                    );
                    margin: 5px 0;

                    :last-of-type {
                      border-bottom: none;
                    }

                    @media only screen and (max-width: 1310px) {
                      height: calc(
                        (90vw - (5px * ${gridDimension + 1})) / ${gridDimension}
                      );
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
                          primaryParty={partySelection}
                        />
                      </>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </span>
        <div
          css={css`
            grid-area: info;
            width: 100%;
            height: 100%;
            padding-top: 20px;

            @media only screen and (max-width: 1310px) {
              width: 90vw;
              padding-left: 20px;
            }
          `}
        >
          <p
            css={css`
              font-size: 24px;
              font-weight: 700;
              color: #222;
            `}
          >
            What is this game?
          </p>
          <p
            css={css`
              font-size: 16px;
              color: #222;
              font-weight: 500;
              margin-top: -15px;
              padding-right: 30px;
            `}
          >
            GerrymanderMe! shows the corrupt practice of gerrymandering through
            a fun and easy-to-understand game. If you would like to learn more
            about the practice, specifically in America, please refer to this
            article from CNN:{" "}
            <a
              href="https://www.cnn.com/2019/06/27/politics/what-is-gerrymandering-trnd/index.html"
              target="_blank"
              css={css`
                color: #555;
              `}
            >
              What is gerrymandering?
            </a>
          </p>

          <p
            css={css`
              font-size: 24px;
              font-weight: 700;
              color: #222;
            `}
          >
            How to play
          </p>
          <p
            css={css`
              font-size: 16px;
              color: #222;
              font-weight: 500;
              margin-top: -15px;
              padding-right: 30px;
            `}
          >
            Choose which party you would like to help gerrymander the districts
            on the board. Notice how the popular vote (total number of votes
            from all citizens) is against your party. Start by clicking two
            tiles adjacent to one another, creating voting districts of exactly
            eight (8) citizens and see the district vote change.
            <br />
            <br />
            Your goal is to make it so your party wins the district vote (>50%),
            even with less than a popular majority.
            <br />
            <br />
            You may have as many tiles in one district, but make sure there are
            exactly eight (8) citizens per district.
          </p>
        </div>
        <div
          css={css`
            grid-area: foot;
            background-color: #222;
            display: flex;
            justify-content: center;
            align-items: center;
          `}
        >
          <p
            css={css`
              font-size: 15px;
              font-family: serif;
              color: white;
            `}
          >
            GerrymanderMe! v.0.2.0 © 2020 to Christian Bernier
          </p>
        </div>
      </div>
    </>
  );
};
