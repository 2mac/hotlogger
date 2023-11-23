/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("wc0m1580mqyjtu5")

  collection.name = "logbooks"

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("wc0m1580mqyjtu5")

  collection.name = "rl_log"

  return dao.saveCollection(collection)
})
