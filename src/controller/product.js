const { cloudinary } = require("../config/cloudinary");
const Product = require("../models/product");

// Controller function to add a new product
const addProduct = async (req, res) => {
    console.log(req.body, "hello");
    
    try {
        const { title, description, price, category } = req.body;
        // console.log(req.file);


        if (!title || !description || !price || !category || !req.file) {
            return res.status(400).json({ status: false, message: "All field are required" });
        }

        // const product = await Product.create(req.body);
        // console.log(req.body);

        // return res.status(200).json({status: true, message: "product Created Succefully", product})

        const stream = cloudinary.uploader.upload_stream(
            { folder: "march-products" },
            async (error, result) => {
                if (error) {
                    console.log(error);

                    return res.status(500).json({ message: "Cloudinary upload failed" });
                }
                console.log(result, "from cludinary");

                const product = {
                    ...req.body,
                    image: result.secure_url,
                    publicId: result.public_id,
                };

                await Product.create(product);

                if (product) {
                    return res
                        .status(201)
                        .json({ message: "product created Succefully", product });
                }
            },
        );
        stream.end(req.file.buffer);

    } catch (error) {
        console.log(error);

        // res.status(500).json({ message: error.message, status: false });
        res
      .status(400)
      .json({
        message: error.message || "validation error",
        errors: error,
        status: false,
      });

    }

};

// Controller function to get all products
const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find();
        return res.status(200).json({
            status: true, message: "All products retrieved successfully",
            products, count: products.length
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message, status: false });
    }

}

// Get single product
const getSingleProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({ status: false, message: "Product not found" });
        }

        res.send(product);

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message, status: false });

    }
}

// UPDATE PRODUCT
const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, price, category, image } = req.body;

        const product = await Product.findByIdAndUpdate(id, req.body, { returnDocument: "after", });

        if (!product) {
            return res.status(404).json({ status: false, message: "Product not found" });
        }

        res.status(200).json({ status: true, message: "Product updated successfully", product });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message, status: false });
    }
};

// DELETE PRODUCT
const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findByIdAndDelete(id);

        if (!product) {
            return res.status(404).json({ status: false, message: "Product not found" });
        }

        res.status(200).json({ status: true, message: "Product deleted successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message, status: false });
    }
};

module.exports = { addProduct, getAllProducts, getSingleProduct, updateProduct, deleteProduct }