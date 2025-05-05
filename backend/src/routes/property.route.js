const express = require("express")
const router = express.Router();
const propertyController = require("../controllers/property.controller")
const authMiddleware = require("../middlewares/authMiddlware")

router.post("/create", authMiddleware,propertyController.createPropertyController)
router.delete("/delete/:id",authMiddleware,propertyController.deletePropertyContoller)
router.put("/update/:id",authMiddleware,propertyController.updatePropertyController)
router.get("/get/:id",authMiddleware,propertyController.viewPropertyController)
router.post("/search",authMiddleware, propertyController.searchPropertyController
  );



module.exports = router