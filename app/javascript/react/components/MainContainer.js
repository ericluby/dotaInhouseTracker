import React, { useState, useEffect } from "react"
import GetMatchIDForm from './GetMatchIDForm'
import fetchAirtableData from './fetchAirtableData'

const MainContainer = (props) => {
  const[airtableData, setAirtableData] = useState([])

  useEffect(() => {
    fetchAirtableData()
      .then(records => {
        setAirtableData(records)        
      })
      .catch(error => console.error(`Error in fetch: ${error.message}`)) 
    }, []
    )

  return(
    <div>
      <ul>
        {airtableData.map(function(record) {
          return <li key={record.getId()}>{record.get('Player Name')}</li>
        })}
      </ul>
      <GetMatchIDForm/>
    </div>
  )
}

export default MainContainer