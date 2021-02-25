import React, { useState, useEffect } from "react"
import GetMatchIDForm from './GetMatchIDForm'
import CreateAirtableRecordForm from './CreateAirtableRecordForm'
import fetchAirtableData from './fetchAirtableData'
import sortTable from './sortTable'

var Airtable = require('airtable');
const AIRTABLE_KEY = document.cookie.split('; ').find((KVString)=> KVString.split('=')[0]==='AIRTABLE_KEY').split('=')[1]
var base = new Airtable({apiKey: AIRTABLE_KEY}).base('appnZsyFI9U2kNhYf');

const MainContainer = (props) => {
  const[airtableData, setAirtableData] = useState([])

  useEffect(() => {
    fetchAirtableData('playerInfo')
      .then(records => {
        setAirtableData(records)        
      })
      .catch(error => console.error(`Error in fetch: ${error.message}`)) 
    }, []
    )

  function handleMatchWon(event, index){
    event.preventDefault()
    const id = airtableData[index].id
    const playerName = airtableData[index].fields.PlayerName
    const updatedMatches = airtableData[index].fields.MatchesPlayed + 1
    const updatedWins = airtableData[index].fields.MatchesWon + 1
    const updatedLosses = airtableData[index].fields.MatchesLost
    base('Dota Player Info').update([
      {
        "id": id,
        "fields": {
          "PlayerName": playerName,
          "MatchesPlayed": updatedMatches,
          "MatchesWon": updatedWins,
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

  function handleMatchLost(event, index){
    event.preventDefault()
    const id = airtableData[index].id
    const playerName = airtableData[index].fields.PlayerName
    const updatedMatches = airtableData[index].fields.MatchesPlayed + 1
    const updatedWins = airtableData[index].fields.MatchesWon
    const updatedLosses = airtableData[index].fields.MatchesLost + 1
    base('Dota Player Info').update([
      {
        "id": id,
        "fields": {
          "PlayerName": playerName,
          "MatchesPlayed": updatedMatches,
          "MatchesWon": updatedWins,
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

  const addLossToPlayer = (playerIndex) =>{
    const id = airtableData[playerIndex].id
    const playerName = airtableData[playerIndex].fields.PlayerName
    const updatedMatches = airtableData[playerIndex].fields.MatchesPlayed + 1
    const updatedWins = airtableData[playerIndex].fields.MatchesWon
    const updatedLosses = airtableData[playerIndex].fields.MatchesLost + 1
    base('Dota Player Info').update([
      {
        "id": id,
        "fields": {
          "PlayerName": playerName,
          "MatchesPlayed": updatedMatches,
          "MatchesWon": updatedWins,
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

  const addWinToPlayer = (playerIndex) =>{
    const id = airtableData[playerIndex].id
    const playerName = airtableData[playerIndex].fields.PlayerName
    const updatedMatches = airtableData[playerIndex].fields.MatchesPlayed + 1
    const updatedWins = airtableData[playerIndex].fields.MatchesWon + 1
    const updatedLosses = airtableData[playerIndex].fields.MatchesLost
    base('Dota Player Info').update([
      {
        "id": id,
        "fields": {
          "PlayerName": playerName,
          "MatchesPlayed": updatedMatches,
          "MatchesWon": updatedWins,
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

  const addNewRecord = (formData) =>{
    base('Dota Player Info').create([
      {
        "fields": {
          "PlayerName": formData.PlayerName,
          "MatchesPlayed": formData.Matches,
          "MatchesWon": formData.Wins,
          "MatchesLost": formData.Losses
        }
      }
    ])
    console.log('record created')
  }
  const playersNames = []

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
                  <td>
                  <form onSubmit={(event) => handleMatchWon(event, index)}>
                    <input className="button" type="submit" value="Add Win" />
                  </form>
                  </td>
                  <td>
                  <form onSubmit={(event) => handleMatchLost(event, index)}>
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
      />
    </div>
  )
}

export default MainContainer