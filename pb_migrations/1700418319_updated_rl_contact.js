/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("w5fbqcgwwtrp82e")

  collection.indexes = [
    "CREATE INDEX `idx_WvfZXhD` ON `rl_contact` (\n  `log_id`,\n  `index`\n)"
  ]

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("w5fbqcgwwtrp82e")

  collection.indexes = [
    "CREATE INDEX `idx_C4ege38` ON `rl_contact` (\n  `log_id`,\n  `index`\n)"
  ]

  return dao.saveCollection(collection)
})
