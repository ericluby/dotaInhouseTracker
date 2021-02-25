import React, {useEffect, useState} from "react"

const AddNewPlayerTile = (props) => {
  
  let updatedWins
  let updatedLosses
  // console.log(props.playerNameToAdd.playerWon)
  if(props.playerNameToAdd.playerWon){
    updatedWins = 1
    updatedLosses = 0
  }else{
    updatedWins = 0
    updatedLosses = 1
  }
  // console.log(props)

  const newRecord = {
    PlayerName: props.playerNameToAdd.playerName,
    Matches: 1,
    Wins: updatedWins,
    Losses: updatedLosses,
    Kills: props.playerNameToAdd.playerKills,
    Deaths: props.playerNameToAdd.playerDeaths,
    Assists: props.playerNameToAdd.playerAssists
  }

  const handleSubmit = (event) =>{
    event.preventDefault()
    props.addNewRecord(newRecord)
  }

  return(
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          Player Name:
          <input
            name={props.playerNameToAdd.playerName}
            id="PlayerName"
            type="text"
            value={props.playerNameToAdd.playerName}
          />
        </label>
        <input className="button" type="submit" value="Add Player" />
      </form>
    </div>
  )
}
  export default AddNewPlayerTile