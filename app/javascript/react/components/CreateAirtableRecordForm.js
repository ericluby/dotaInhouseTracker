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
        <input className="button" type="submit" value="Add Player" />
      </form>
    </div>
  )
}

export default CreateAirtableRecordForm