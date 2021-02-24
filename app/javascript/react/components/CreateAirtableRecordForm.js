import React, { useState } from 'react'

const CreateAirtableRecordForm = (props) =>{
  const [newRecord, setNewRecord] = useState({
    PlayerName: "",
    Matches: 0,
    Wins: 0,
    Losses: 0,
  });

  const handleChange = (event) =>{
    setNewRecord({
      ...newRecord,
      [event.currentTarget.name]: event.currentTarget.value
    });
  }

  const handleSubmit = (event) =>{
    event.preventDefault()
    props.addNewRecord(newRecord)
    setNewRecord({
      PlayerName: "",
      Matches: 0,
      Wins: 0,
      Losses: 0,
    })
  }

  return(
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          Player Name:
          <input
            name="PlayerName"
            id="PlayerName"
            type="text"
            onChange={handleChange}
            value={newRecord.PlayerName}
          />
        </label>
        {/* <label>
          Matches:
          <input
            name="Matches"
            id="Matches"
            type="number"
            onChange={handleChange}
            value={newRecord.Matches}
          />
        </label>
        <label>
          Wins:
          <input
            name="Wins"
            id="Wins"
            type="number"
            onChange={handleChange}
            value={newRecord.Wins}
          />
        </label>
        <label>
          Losses:
          <input
            name="Losses"
            id="Losses"
            type="number"
            onChange={handleChange}
            value={newRecord.Losses}
          />
        </label> */}
        <input className="button" type="submit" value="Submit" />
      </form>
    </div>
  )
}

export default CreateAirtableRecordForm