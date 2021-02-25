import React, { useState, useEffect } from "react"
import GetMatchIDForm from './GetMatchIDForm'
import CreateAirtableRecordForm from './CreateAirtableRecordForm'
import fetchAirtableData from './fetchAirtableData'
import AddNewPlayerTile from './AddNewPlayerTile'
import sortTable from './sortTable'

var Airtable = require('airtable');
const AIRTABLE_KEY = document.cookie.split('; ').find((KVString)=> KVString.split('=')[0]==='AIRTABLE_KEY').split('=')[1]
var base = new Airtable({apiKey: AIRTABLE_KEY}).base('appnZsyFI9U2kNhYf');

const MainContainer = (props) => {
  const[airtableData, setAirtableData] = useState([])
  const[playersToAddToRecords, setplayersToAddToRecords] = useState([])

  useEffect(() => {
    fetchAirtableData('playerInfo')
      .then(records => {
        setAirtableData(records)        
      })
      .catch(error => console.error(`Error in fetch: ${error.message}`)) 
    }, []
    )

  function assignMatchWon(event, index){
    event.preventDefault()
    const id = airtableData[index].id
    const playerName = airtableData[index].fields.PlayerName
    const updatedMatches = airtableData[index].fields.MatchesPlayed + 1
    const updatedWins = airtableData[index].fields.MatchesWon + 1
    base('Dota Player Info').update([
      {
        "id": id,
        "fields": {
          "PlayerName": playerName,
          "MatchesPlayed": updatedMatches,
          "MatchesWon": updatedWins
        }
      }
    ])
    .then(()=>{
      fetchAirtableData('playerInfo')
      .then(records => {
        setAirtableData(records)        
      })
    })
  }

  function assignMatchLost(event, index){
    event.preventDefault()
    const id = airtableData[index].id
    const playerName = airtableData[index].fields.PlayerName
    const updatedMatches = airtableData[index].fields.MatchesPlayed + 1
    const updatedLosses = airtableData[index].fields.MatchesLost + 1
    base('Dota Player Info').update([
      {
        "id": id,
        "fields": {
          "PlayerName": playerName,
          "MatchesPlayed": updatedMatches,
          "MatchesLost": updatedLosses
        }
      }
    ])
    .then(()=>{
      fetchAirtableData('playerInfo')
      .then(records => {
        setAirtableData(records)        
      })
    })
  }

  const addLossToPlayer = (player, playerIndex) =>{
    console.log(player)
    const id = airtableData[playerIndex].id
    const playerName = airtableData[playerIndex].fields.PlayerName
    const updatedMatches = airtableData[playerIndex].fields.MatchesPlayed + 1
    const updatedLosses = airtableData[playerIndex].fields.MatchesLost + 1
    const updatedKills = airtableData[playerIndex].fields.Kills + player.playerKills
    const updatedDeaths = airtableData[playerIndex].fields.Deaths + player.playerDeaths
    const updatedAssists = airtableData[playerIndex].fields.Assists + player.playerAssists
    base('Dota Player Info').update([
      {
        "id": id,
        "fields": {
          "PlayerName": playerName,
          "MatchesPlayed": updatedMatches,
          "MatchesLost": updatedLosses,
          "Kills": updatedKills,
          "Deaths": updatedDeaths,
          "Assists": updatedAssists
        }
      }
    ])
    .then(()=>{
      fetchAirtableData('playerInfo')
      .then(records => {
        setAirtableData(records)        
      })
    })
  }

  const addWinToPlayer = (player, playerIndex) =>{
    const id = airtableData[playerIndex].id
    const playerName = airtableData[playerIndex].fields.PlayerName
    const updatedMatches = airtableData[playerIndex].fields.MatchesPlayed + 1
    const updatedWins = airtableData[playerIndex].fields.MatchesWon + 1
    const updatedKills = airtableData[playerIndex].fields.Kills + player.playerKills
    const updatedDeaths = airtableData[playerIndex].fields.Deaths + player.playerDeaths
    const updatedAssists = airtableData[playerIndex].fields.Assists + player.playerAssists
    base('Dota Player Info').update([
      {
        "id": id,
        "fields": {
          "PlayerName": playerName,
          "MatchesPlayed": updatedMatches,
          "MatchesWon": updatedWins,
          "Kills": updatedKills,
          "Deaths": updatedDeaths,
          "Assists": updatedAssists
        }
      }
    ])
    .then(()=>{
      fetchAirtableData('playerInfo')
      .then(records => {
        setAirtableData(records)        
      })
    })
  }

  const addNewRecord = (formData) =>{
    // console.log(formData)
    base('Dota Player Info').create([
      {
        "fields": {
          "PlayerName": formData.PlayerName,
          "MatchesPlayed": formData.Matches,
          "MatchesWon": formData.Wins,
          "MatchesLost": formData.Losses,
          "Kills": formData.Kills,
          "Deaths": formData.Deaths,
          "Assists": formData.Assists
        }
      }
    ])
    console.log('record created')
  }
  const playersNames = []

  const playerNamesToAdd = []
  const playersToAdd = (playersToAdd, WinningTeam) =>{
    playersToAdd.forEach((player)=>{
      playerNamesToAdd.push(player)
    })
    setplayersToAddToRecords(playerNamesToAdd)
    // console.log(playerNamesToAdd)
  }

  let addingNewPlayerArray
  if(playersToAddToRecords){
    addingNewPlayerArray = playersToAddToRecords.map((playerNameToAdd) => {
      return(
        < AddNewPlayerTile
          playerNameToAdd={playerNameToAdd}
          addNewRecord={addNewRecord}
        />
      )
    })
  }

  return(
    <div>
      <table id='PlayerRecords' class="js-sort-table">
        <thead>
          <tr>
            <th width='50'>Player Name</th>
            <th width='50' class="js-sort-number">Total Matches</th>
            <th width='50' class="js-sort-number">Wins</th>
            <th width='50' class="js-sort-number">Losses</th>
            <th width='50' class="js-sort-number">Win %</th>
            <th width='50' class="js-sort-number">Average Kills</th>
            <th width='50' class="js-sort-number">Average Deaths</th>
            <th width='50' class="js-sort-number">Average Assists</th>
            <th width='30'>Add Win</th>
            <th width='30'>Add Loss</th>
          </tr>
        </thead>
        <tbody>
            {airtableData.map(function(record, index) {
              const playerName = record.get('PlayerName')
              playersNames.push({'name': playerName, 'index': index})
              return (
                <tr key={record.getId()}>
                  <td>{record.get('PlayerName')}</td>
                  <td>{record.get('MatchesPlayed')}</td>
                  <td>{record.get('MatchesWon')}</td>
                  <td>{record.get('MatchesLost')}</td>
                  <td>{Math.round(record.get('Win%')*100) + '%'}</td>
                  <td>{record.get('AverageKills') + ' '}</td>
                  <td>{record.get('AverageDeaths') + ' '}</td>
                  <td>{record.get('AverageAssists') + ' '}</td>
                  <td>
                    <form onSubmit={(event) => assignMatchWon(event, index)}>
                      <input className="button" type="submit" value="Add Win" />
                    </form>
                  </td>
                  <td>
                    <form onSubmit={(event) => assignMatchLost(event, index)}>
                      <input className="button" type="submit" value="Add Loss" />
                    </form>
                  </td>
                </tr>
              )
            })}
        </tbody>
      </table>
      <CreateAirtableRecordForm addNewRecord={addNewRecord}/>
      <GetMatchIDForm
        playersNames={playersNames}
        addWinToPlayer={addWinToPlayer}
        addLossToPlayer={addLossToPlayer}
        playersToAdd={playersToAdd}
      />
      {addingNewPlayerArray}
    </div>
  )
}

export default MainContainer