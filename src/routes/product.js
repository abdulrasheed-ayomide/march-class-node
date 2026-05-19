const express = require("express");
const { authMiddleWare } = require("../middleware/verifyToken");
const { addProduct, getAllProducts, getSingleProduct, updateProduct, deleteProduct } = require("../controller/product");
const { upload } = require("../utils/multer")

// instruction do not  use verbs in naming routes, use nouns instead
// for example, instead of using /addProduct, we can use /products and use the POST method to add a product, and use the GET method to get all products
const router = express.Router();

router.post("/", authMiddleWare, upload.single("image") ,addProduct);
router.get("/",  getAllProducts);
router.get("/:id", getSingleProduct);
router.patch("/:id", authMiddleWare, updateProduct);
router.delete("/:id", authMiddleWare, deleteProduct);

module.exports = router;