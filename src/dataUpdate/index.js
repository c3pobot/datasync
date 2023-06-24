'use strict'
const getDataFiles = require('./getDataFiles')
module.exports = async(gameVersion, localeVersion, forceFile = false)=>{
  try{
    let status = true
    if(!gameVersion || !localeVersion) return;
    console.log('Starting game data update...')
    if(forceFile){
      console.log('Getting new files...')
    }else{
      console.log('Checking files...')
    }
    let filesUpdated = await getDataFiles(localeVersion, localeVersion, forceFile)
    if(!filesUpdated) console.log('Error getting game data files')
    if(filesUpdated && status){
      GameDataVersions.gameVersion = gameVersion
      GameDataVersions.localeVersion = lVersion
      await mongo.set('botSettings', {_id: 'gameVersion'}, {gameVersion: gameVersion, localeVersion: lVersion})
      console.log('game data updated to '+gameVersion+'. Locale updated to '+lVersion+'...')
    }
  }catch(e){
    console.error(e);
  }
}
