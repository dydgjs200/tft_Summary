const router = require("express").Router();
const trait = require("../../controllers/trait.js");

router.post("/", trait.AllTrait);

module.exports = router;
