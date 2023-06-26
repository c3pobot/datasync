'use strict'
const ReadFile = require('./readFile')
module.exports = async(gameVersion, localeVersion, assetVersion)=>{
  try{
    console.log('conquestDiscList updating...')
    let discDef = await ReadFile('artifactDefinition.json', gameVersion)
    let lang = await ReadFile('Loc_ENG_US.txt.json', localeVersion)
    if(!discDef || !lang) return
    for(let i in discDef){
      discDef[i].nameKey = lang[discDef[i].nameKey] || discDef[i].nameKey
      if(lang[discDef[i].descriptionKey]) discDef[i].descriptionKey = lang[discDef[i].descriptionKey].replace(/\//g, '').replace(/\[c\]/g, '').replace(/\[FFFF33\]/g, '').replace(/\[ffff33\]/g, '').replace(/\[-\]/g, '').replace(/\[-\]/g, '').replace(/\\n/g, '<br>')
      mongo.set('conquestDiscList', {_id: discDef[i].id}, discDef[i])
    }
    lang = null
    console.log('conquestDiscList updated...')
    return true
  }catch(e){
    console.log('conquestDiscList update error...')
    console.log(e)
  }
}
