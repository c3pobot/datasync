const log = require('logger')
const mongo = require('mongoapiclient')
const path = require('path')
const imagesToIgnore = require('./imagestoignore.json')
const SaveImage = require('./saveImage')
const checkAssetName = (img)=>{
  try{
    if(!img) return
    if(img.startsWith('icon_stat_')) return;
    return true
  }catch(e){
    throw(e);
  }
}
const checkMissing = async()=>{
  try{
    let list = await mongo.find('missingAssetsNew', {})
    if(list?.length > 0){
      let i = list.length
      while(i--) await saveImages(list[i].imgs, list[i].assetVersion, list[i].dir, list[i]._id)
    }
    setTimeout(checkMissing, 30000)
  }catch(e){
    log.error(e);
    setTimeout(checkMissing, 5000)
  }
}
const saveImages = async(imgs = [], assetVersion, dir, collectionId)=>{
  try{
    if(imgs.length === 0 || !assetVersion || !dir) return
    let errored = []
    log.info('trying download of '+imgs.length+' images for version '+assetVersion+' to '+dir+' for '+collectionId+'...')
    let i = imgs.length
    while(i--){
      if(imagesToIgnore.filter(x=>x === imgs[i]).length > 0) continue
      let status = await checkAssetName(imgs[i])
      if(!status) continue
      status = await SaveImage(assetVersion, imgs[i], dir)
      if(!status) errored.push(imgs[i])
    }
    if(errored.length > 0){
      log.info('Missing '+errored.length+' images for version '+assetVersion+' in '+dir+' for '+collectionId+'...')
      await mongo.set('missingAssetsNew', {_id: collectionId}, {imgs: errored, dir: dir, assetVersion: assetVersion})
    }else{
      await mongo.del('missingAssetsNew', {_id: collectionId})
      log.info('Saved '+imgs?.length+' images for version '+assetVersion+' to '+dir+' for '+collectionId+'...')
    }
  }catch(e){
    throw(e)
  }
}
checkMissing()
