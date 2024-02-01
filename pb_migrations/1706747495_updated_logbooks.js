/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("wc0m1580mqyjtu5")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "gwtyc9cv",
    "name": "custom",
    "type": "json",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "maxSize": 1000000
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("wc0m1580mqyjtu5")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "gwtyc9cv",
    "name": "custom",
    "type": "json",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "maxSize": 0
    }
  }))

  return dao.saveCollection(collection)
})
