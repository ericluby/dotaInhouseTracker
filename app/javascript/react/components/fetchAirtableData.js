import Airtable from 'airtable'

const AIRTABLE_KEY = document.cookie.split('; ').find((KVString)=> KVString.split('=')[0]==='AIRTABLE_KEY').split('=')[1]
// Airtable.configure({
//     endpointUrl: 'https://morning-tor-96423.herokuapp.com/https://api.airtable.com',
//     apiKey: AIRTABLE_KEY
// });

var base = new Airtable({apiKey: AIRTABLE_KEY}).base('appnZsyFI9U2kNhYf');

// FETCH FIRST PAGE
// If you only want the first page of records, you can
// use `firstPage` instead of `eachPage`.
async function fetchAirtableData(type){
    let baseTable
    if(type==="playerInfo"){
        baseTable = 'Dota Player Info'
    }else if(type==="parsedMatches"){
        baseTable = 'Parsed Matches'
    }
    return new Promise((resolve,reject)=>{
        base(baseTable).select({
            view: 'Grid view'
        }).firstPage(function(err, records) {
            if(err){
                 console.error(err); 
                 return reject(err); 
                }
            records.forEach(function(record) {
                // console.log('Retrieved', record.get('PlayerName'));
            });
            // console.log(records[0].fields.PlayerName)
            return resolve(records)
        });
    })
}

export default fetchAirtableData