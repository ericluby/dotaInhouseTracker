import Airtable from 'airtable'

const AIRTABLE_KEY = document.cookie.split('; ').find((KVString)=> KVString.split('=')[0]==='AIRTABLE_KEY').split('=')[1]
var base = new Airtable({apiKey: AIRTABLE_KEY}).base('appnZsyFI9U2kNhYf');

// FETCH FIRST PAGE
// If you only want the first page of records, you can
// use `firstPage` instead of `eachPage`.
async function fetchAirtableData(){
    return new Promise((resolve,reject)=>{
        base('Dota Player Info').select({
            view: 'Grid view'
        }).firstPage(function(err, records) {
            if(err){
                 console.error(err); 
                 return reject(err); 
                }
            records.forEach(function(record) {
                console.log('Retrieved', record.get('Player Name'));
            });
            return resolve(records)
        });
    })
}

export default fetchAirtableData