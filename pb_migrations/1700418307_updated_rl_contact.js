/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("w5fbqcgwwtrp82e")

  collection.indexes = [
    "CREATE INDEX `idx_C4ege38` ON `rl_contact` (\n  `log_id`,\n  `index`\n)"
  ]

  // remove
  collection.schema.removeField("finttbf0")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "sl6ezmwi",
    "name": "log_id",
    "type": "text",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "pattern": ""
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("w5fbqcgwwtrp82e")

  collection.indexes = [
    "CREATE INDEX `idx_HJeAUmE` ON `rl_contact` (\n  `log_id`,\n  `index`\n)"
  ]

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "finttbf0",
    "name": "log_id",
    "type": "number",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "noDecimal": false
    }
  }))

  // remove
  collection.schema.removeField("sl6ezmwi")

  return dao.saveCollection(collection)
})
