/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("w5fbqcgwwtrp82e")

  collection.indexes = []

  // remove
  collection.schema.removeField("ngxwdywq")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "hhhdvwsz",
    "name": "time",
    "type": "date",
    "required": true,
    "presentable": false,
    "unique": false,
    "options": {
      "min": "",
      "max": ""
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("w5fbqcgwwtrp82e")

  collection.indexes = [
    "CREATE INDEX `idx_WvfZXhD` ON `contacts` (\n  `log_id`,\n  `index`\n)"
  ]

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "ngxwdywq",
    "name": "index",
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

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "hhhdvwsz",
    "name": "time",
    "type": "date",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "min": "",
      "max": ""
    }
  }))

  return dao.saveCollection(collection)
})
