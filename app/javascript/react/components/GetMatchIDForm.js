import React, { useState, useEffect } from "react"

import fetchAirtableData from './fetchAirtableData'
import dotaHeroes from './dotaHeroIDs.json'
import gameToImage from './gameToImage.js'

var Airtable = require('airtable');
const AIRTABLE_KEY = document.cookie.split('; ').find((KVString)=> KVString.split('=')[0]==='AIRTABLE_KEY').split('=')[1]
var base = new Airtable({apiKey: AIRTABLE_KEY}).base('appnZsyFI9U2kNhYf');

const GetMatchIDForm = (props) => {
  const [matchID, setMatchID] = useState({
    MatchID: ""
  });

  //copied from old code
  class Player {
    constructor({playerName, playerHeroID, playerHeroName, teamName, playerKills, playerDeaths, playerAssists}){
      this.playerName = playerName;
      this.playerHeroID = playerHeroID;
      this.playerHeroName = playerHeroName;
      this.teamName = teamName;
      this.playerKills = playerKills;
      this.playerDeaths = playerDeaths;
      this.playerAssists = playerAssists
    }
  }
  async function getGameSummary(matchID){
    const latestMatchDataJSON = await fetch(`https://api.opendota.com/api/matches/${matchID}?limit=1`).then(r => r.json());
  
    const gameDate = new Date(latestMatchDataJSON.start_time*1000);
    const matchData = {
      "gameLength": `${Math.floor(latestMatchDataJSON.duration/60)}:${latestMatchDataJSON.duration-(Math.floor(latestMatchDataJSON.duration/60)*60)}`,  // 12
      "gameMode": ['All Pick', "Captain's Mode", 'Random Draft', 'Single Draft', 'All Random'][latestMatchDataJSON.game_mode - 1], // "allpick"
      "winningTeam": latestMatchDataJSON.radiant_win ? 'radiant' : 'dire', // "radiant"
      "matchID": latestMatchDataJSON.match_id, // "78612478"
      "bannedHeroes": latestMatchDataJSON.picks_bans, // ["huskar", "broodmother", "riki"],  // TODO FIGURE THIS OUT
      "MatchDate": `${gameDate.getMonth()+1}/${gameDate.getDate()}/${gameDate.getFullYear()}`, // "1/4/12"
      "MatchTime": `${gameDate.getHours()}:${gameDate.getMinutes()}`, // "12:42"
      "players": []
    };
  
    let index = 0;
    while(index < 10){
      const player = new Player({
        playerName: latestMatchDataJSON.players[index].personaname,
        playerHeroID: latestMatchDataJSON.players[index].hero_id,
        playerHeroName: dotaHeroes.find((dotaHeroes) => dotaHeroes.id === latestMatchDataJSON.players[index].hero_id).name,
        teamName: latestMatchDataJSON.players[index].isRadiant ? "radiant" : "dire",
        playerKills: latestMatchDataJSON.players[index].kills,
        playerDeaths: latestMatchDataJSON.players[index].deaths,
        playerAssists: latestMatchDataJSON.players[index].assists
      });
      matchData.players.push(player);
      index++
    }
  
    return matchData
  };
  // end of copied

  const handleChange = event => {
    setMatchID({
      ...matchID,
      [event.currentTarget.name]: event.currentTarget.value
    });
  };
  let gameSummary
  let imageBuffer
  let newMatch
  
  async function handleSubmit(event){
    event.preventDefault();
    gameSummary = await getGameSummary(matchID.MatchID)
    const title = `match ID: ${matchID.MatchID}.png`
    imageBuffer = await gameToImage(gameSummary, title)
    checkIfNewMatch(matchID)
    .then(()=>{
      if(newMatch === true){
        didPlayerWin()
      }
      setMatchID({
        MatchID: ""
      })
    })
  }

  const matchesPlayed = []


  async function checkIfNewMatch(formMatchID){
    fetchAirtableData('parsedMatches')
      .then(records => {
        const airtableData = records 
    airtableData.map(function(record, index) {
      const matchPlayed = record.get('MatchID')
      matchesPlayed.push(matchPlayed)
      })
    }).then(()=>{
      if(matchesPlayed.includes(formMatchID.MatchID)){
        console.log('this match has already been parsed')
      }else{
        console.log('this is a new game that I am parsing')
        // add matchID to airtable
        base('Parsed Matches').create([
          {
            "fields": {
              "MatchID": formMatchID.MatchID
            }
          }
        ])
        didPlayerWin()
      }
    })
  }

  const callAddWin = (playerIndex) =>{
    props.addWinToPlayer(playerIndex)
  }

  const callAddLoss = (playerIndex) =>{
    props.addLossToPlayer(playerIndex)
  }

  const playersNames = props.playersNames

  const didPlayerWin = () =>{
    const playersToBeAdded = []
    const playerNamesArr = []
    gameSummary.players.forEach((player)=>{
      playersNames.forEach((playersName)=>{
        playerNamesArr.push(playersName.name)
        if(player.playerName === playersName.name && player.teamName === gameSummary.winningTeam){
          // Updated this player's record for a win
          callAddWin(playersName.index)
        }else if(player.playerName === playersName.name){
          // Updated this player's record for a loss
          callAddLoss(playersName.index)
        }else if(!playerNamesArr.includes(player.playerName) && !playersToBeAdded.includes(player.playerName)){
          // player is not in the list of players yet
          playersToBeAdded.push(player.playerName)
          // would you like to add the player to the current list of players?
          console.log(`${player.playerName} is not in the current list of players`)
        }
      })
    })
  }

  return(
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          Match ID:
          <input
            name="MatchID"
            id="MatchID"
            type="text"
            onChange={handleChange}
            value={matchID.MatchID}
          />
        </label>
        <input className="button" type="submit" value="Submit" />
      </form>
      <canvas id="dotaMatch" width="450" height="300"></canvas>
    </div>
  )
}
  export default GetMatchIDForm