import React, { useState } from "react"

import dotaHeroes from './dotaHeroIDs.json'
import gameToImage from './gameToImage.js'



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
    //const latestMatch = dotaMatchesDataJSON[0].match_id; //uncomment for real data.  sets latestmatch to the most recent match
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


  // let URL = `https://api.opendota.com/api/matches/${matchID.MatchID}`
  const handleChange = event => {
    setMatchID({
      ...matchID,
      [event.currentTarget.name]: event.currentTarget.value
    });
  };
  let gameSummary
  let imageBuffer

  async function handleSubmit(event){
    event.preventDefault();
    // window.open(URL, '_blank');
    // insert api fetch here
    // console.log(getGameSummary(matchID.MatchID))
    gameSummary = await getGameSummary(matchID.MatchID)
    console.log(gameSummary);
    const title = `match ID: ${matchID.MatchID}.png`
    imageBuffer = await gameToImage(gameSummary, title)
    // fetch(`https://api.opendota.com/api/matches/${matchID.MatchID}`)
    // .then(response => response.json())
    // .then(json => console.log(json))
    setMatchID({
      MatchID: ""
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