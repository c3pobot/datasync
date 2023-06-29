'us strict'
const getDataVersions = require('./getDataVersions')
const dataUpdate = require('../dataUpdate')
const getGameVersions = require('../getGameVersions')

module.exports = async(versions = {}, forceFile = false)=>{
  try{
    if(!versions.gameVersion || !versions.localeVersion ||!version.assetVersion){
      versions = await getGameVersions()
    }
    if(!versions.gameVersion || !versions.localeVersion ||!version.assetVersion) return
    let gitVersions = await getDataVersions()
    if(!gitVersions?.gameVersion || !gitVersions?.localeVersion) return
    if(!forceFile && dataVersions.gameVersion === versions.gameVersion && dataVersions.localeVersion === versions.localeVersion && dataVersions.statCalcVersion === versions.gameVersion) return
    let status = await dataUpdate(versions.gameVersion, versions.localeVersion, forceFile)
    if(status?.gameVersion) dataVersions.gameVersion = status.gameVersion
    if(status?.localeVersion) dataVersions.localeVersion = status.localeVersion
    if(status?.statCalcVersion) dataVersions.statCalcVersion = status.statCalcVersion
  }catch(e){
    console.error(e);
  }
}
