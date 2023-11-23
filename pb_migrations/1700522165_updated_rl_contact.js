/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("w5fbqcgwwtrp82e")

  collection.name = "contacts"
  collection.indexes = [
    "CREATE INDEX `idx_WvfZXhD` ON `contacts` (\n  `log_id`,\n  `index`\n)"
  ]

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "sl6ezmwi",
    "name": "log_id",
    "type": "text",
    "required": true,
    "presentable": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "pattern": ""
    }
  }))

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "jdnvnhox",
    "name": "other_call",
    "type": "text",
    "required": true,
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

  collection.name = "rl_contact"
  collection.indexes = [
    "CREATE INDEX `idx_WvfZXhD` ON `rl_contact` (\n  `log_id`,\n  `index`\n)"
  ]

  // update
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

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "jdnvnhox",
    "name": "other_call",
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
})
