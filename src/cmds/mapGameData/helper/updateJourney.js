'use strict'
const ReadFile = require('./readFile')
const MapUnits = async(units = [], lang = {})=>{
  try{
    let res = {}
    units.forEach(u=>{
      if( +u.rarity !== 7 ) return
      if( u.obtainable !== true ) return
      if( +u.obtainableTime !== 0 ) return
      if(!u.baseId || !u.nameKey) return
      res[u.baseId] = lang[u.nameKey] || u.nameKey
    })
    if(Object.values(res)?.length > 0) return res
  }catch(e){
    console.error(e);
  }
}
module.exports = async(gameVersion, localeVersion, assetVersion)=>{
  try{
    console.log('journeyGuide updating...')
    let guideDef = await ReadFile('unitGuideDefinition.json', gameVersion)
    let unitList = await ReadFile('units.json', gameVersion)
    let lang = await ReadFile('Loc_ENG_US.txt.json', localeVersion)
    if(!guideDef || !lang || !unitList) return
    let units = await MapUnits(unitList, lang)
    if(!units) return
    let autoComplete = []
    for(let i in guideDef){
      if(!guideDef[i].unitBaseId || !guideDef[i].titleKey) return
      autoComplete.push({ name: units[guideDef[i].unitBaseId] || lang[guideDef[i].titleKey], value: guideDef[i].unitBaseId, descKey: lang[guideDef[i].titleKey] })
    }
    let manualGuides = (await mongo.find('botSettings', {_id: 'manualGuides'}))[0]
    if(manualGuides?.length > 0){
      for(let i in manualGuides){
        if(autoComplete.filter(x=>x.name === manualGuides[i].name).length === 0) autoComplete.push(manualGuides[i])
      }
    }
    if(autoComplete?.length > 0) await mongo.set('autoComplete', {_id: 'journey'}, {data: autoComplete, include: true})
    console.log('journeyGuide update complete...')
    return true
  }catch(e){
    console.error('journeyGuide update error...')
    console.error(e);
  }
}
