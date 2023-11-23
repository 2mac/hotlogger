/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("3ezpk38rfhs4ivc");

  return dao.deleteCollection(collection);
}, (db) => {
  const collection = new Collection({
    "id": "3ezpk38rfhs4ivc",
    "created": "2023-11-18 14:02:46.911Z",
    "updated": "2023-11-18 14:02:46.911Z",
    "name": "rl_log_type",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "2ttpnbpa",
        "name": "name",
        "type": "text",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
        }
      }
    ],
    "indexes": [],
    "listRule": null,
    "viewRule": null,
    "createRule": null,
    "updateRule": null,
    "deleteRule": null,
    "options": {}
  });

  return Dao(db).saveCollection(collection);
})
