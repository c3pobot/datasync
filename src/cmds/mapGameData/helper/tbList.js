'use strict'
const ReadFile = require('./readFile')
let errored = false
const setErrorFlag = (err)=>{
  try{
    errored = true
    console.error(err)
  }catch(e){
    errored = true
    console.error(e);
  }
}
const GetPhase = (zoneId)=>{
  try{
    if(zoneId.includes('phase01_')) return 'P1'
    if(zoneId.includes('phase02_')) return 'P2'
    if(zoneId.includes('phase03_')) return 'P3'
    if(zoneId.includes('phase04_')) return 'P4'
    if(zoneId.includes('phase05_')) return 'P5'
    if(zoneId.includes('phase06_')) return 'P6'
  }catch(e){
    setErrorFlag(e)
  }
}
const GetConflict = (zoneId)=>{
  try{
    if(zoneId.includes('_conflict01')) return 'C1'
    if(zoneId.includes('_conflict02')) return 'C2'
    if(zoneId.includes('_conflict03')) return 'C3'
    if(zoneId.includes('_conflict04')) return 'C4'
    if(zoneId.includes('_conflict05')) return 'C5'
    if(zoneId.includes('_conflict06')) return 'C6'
  }catch(e){
    setErrorFlag(e)
  }
}
const GetType = (combatType, alignment)=>{
  try{
    if(combatType === 1) return 'Char'
    if(combatType === 2) return 'Ship'
    if(alignment === 1) return 'Mixed'
    if(alignment === 2) return 'LS'
    if(alignment === 3) return 'DS'
  }catch(e){
    setErrorFlag(e)
  }
}
const GetSort = (type, conflict)=>{
  try{
    if(type === 'DS') return 1
    if(type === 'Mixed') return 2
    if(type === 'LS') return 3
    return +(conflict?.replace('C', ''))
  }catch(e){
    setErrorFlag(e)
  }
}
const getZoneDefinition = async(conflictZoneDefinition = [], lang = {})=>{
  try{
    if(conflictZoneDefinition.length === 0) return
    for(let i in conflictZoneDefinition){
      conflictZoneDefinition[i].zoneDefinition.nameKey = lang[zoneDefinition?.nameKey] || conflictZoneDefinition[i].zoneDefinition.nameKey
      conflictZoneDefinition[i].zoneDefinition.phase = GetPhase(conflictZoneDefinition[i].zoneDefinition.zoneId)
      conflictZoneDefinition[i].zoneDefinition.conflict = GetConflict(conflictZoneDefinition[i].zoneDefinition.zoneId)
      conflictZoneDefinition[i].zoneDefinition.type = GetType(conflictZoneDefinition[i].territoryBattleZoneUnitType, conflictZoneDefinition[i].forceAlignment)
      conflictZoneDefinition[i].zoneDefinition.sort = GetSort(conflictZoneDefinition[i].zoneDefinition.type, tbDef[i].conflictZoneDefinition[c].zoneDefinition.conflict)
    }
    if(!errored) return conflictZoneDefinition
  }catch(e){
    setErrorFlag(e)
  }
}
module.exports = async(gameVersion, localeVersion, assetVersion)=>{
  try{
    errored = false
    let lang = await ReadFile('Loc_ENG_US.txt.json', localeVersion)
    const tbList = await ReadFile('territoryBattleDefinition.json', gameVersion)
    let autocomplete = []
    for(let i in tbList){
      if(errored) continue
      tbList[i].nameKey = lang[tbList[i].nameKey] || tbList[i].nameKey
      autocomplete.push({name: tbList[i].nameKey, value: tbList[i].id})
      let conflictZoneDefinition = await getZoneDefinition(tbList[i].conflictZoneDefinition, lang)
      if(conflictZoneDefinition){
        tbList[i].conflictZoneDefinition = conflictZoneDefinition
        await mongo.set('tbList', {_id: tbList[i].id}, tbList[i])
      }
    }
    if(!errored && autoComplete?.length > 0){
      await mongo.set('autoComplete', {_id: 'tb-name'}, {data: autocomplete, include: true})
      await mongo.set('autoComplete', {_id: 'nameKeys'}, {include: false, 'data.tb-name': 'tb-name'} )
      return true
    }
  }catch(e){
    console.log(e)
  }
}