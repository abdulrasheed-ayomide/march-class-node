const express = require("express");

const router = express.Router();

const {
   authMiddleWare
} = require("../middleware/verifyToken");

const authorizeRole =
   require("../middleware/roleMiddleware");

router.get(
   "/dashboard",

   authMiddleWare,

   authorizeRole("admin"),

   (req, res) => {

      res.json({
         message:
            "Welcome Admin Dashboard"
      });
   }
);

module.exports = router;