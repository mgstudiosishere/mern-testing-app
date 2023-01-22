const Product = require("../models/Product");

let express = require("express"),
  multer = require("multer"),
  mongoose = require("mongoose"),
  uuidv4 = require("uuid/v4"),
  router = express.Router();

const DIR = "./public/";
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, DIR);
  },
  filename: (req, file, cb) => {
    const fileName = file.originalname.toLowerCase().split(" ").join("-");
    cb(null, uuidv4() + "-" + fileName);
  },
});

var upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype == "image/png" ||
      file.mimetype == "image/jpg" ||
      file.mimetype == "image/jpeg"
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error("Only .png, .jpg and .jpeg format allowed!"));
    }
  },
});

// User model
router.post(
  "/upload-images",
  upload.array("imgCollection", 3),
  (req, res, next) => {
    const reqFiles = [];
    // const reqName = "";
    const url = req.protocol + "://" + req.get("host");
    for (var i = 0; i < req.files.length; i++) {
      reqFiles.push(url + "/public/" + req.files[i].filename);
    }
    const product = new Product({
      _id: new mongoose.Types.ObjectId(),
      name: req.body.name,
      imgCollection: reqFiles,
      producttype: req.body.producttype,
      price: req.body.price,
      discount: req.body.discount,
      offer: req.body.offer,
    });
    product
      .save()
      .then((result) => {
        res.status(201).json({
          message: "Done upload!",
          userCreated: {
            _id: result._id,
            name: result.name,
            imgCollection: result.imgCollection,
            producttype: result.producttype,
            price: result.price,
            discount: result.discount,
            offer: result.offer,
          },
        });
      })
      .catch((err) => {
        console.log(err),
          res.status(500).json({
            error: err,
          });
      });
  }
);

//GET SINGLE PRODUCTS
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET ALL PRODUCTS
router.get("/", async (req, res, next) => {
  try {
    let data = await Product.find();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
