const { Product } = require('../models/product_model');
const { uploadPhoto } = require("../helpers/uploadPhoto");

async function createProduct(req, res){
    const { product_name, category, description, price, photo, sub_category } = req.body;
    let photo_url;
    try{
        photo_url = await uploadPhoto(photo[0].base64, photo[0].path);
    } catch ( error){
        photo_url = 'https://firebasestorage.googleapis.com/v0/b/evcil-dostum-cloud.appspot.com/o/1713905613292_f7hpl1.png?alt=media&token=0babda29-cf92-4950-8614-ec4fb4cc3f1a'
        console.log(error);
    }
    try{
        const addProductRes = await Product.create(product_name, category, description, price, photo_url, sub_category);
        if(!addProductRes){
            res.status(505).json({ success: false });
            console.log('Error product controller');
        }
        res.json({ success: true });
    } catch (error){
        res.status(505).json({ success: false });
        console.log('Error product controller: ', error);
    }
}

async function getAllProduct(req, res){
    try{
        const result = await Product.getAllProduct();
        res.json({ result });
    } catch (error){
        res.status(505).json({ success: false });
        console.log('Error gettin all product: ', error);
    }
}

async function getProductById(req, res){
    const { product_id } = req.query;

    try{
        const result = await Product.getProductByProductId(product_id);
        res.json({ result });
    } catch (error) {
        res.status(505).json({ success: false });
        console.log('Error gettin product by id : ', error);
    }
}

async function getProductByCategory(req, res){
    const { category } = req.query;

    try{
        const result = await Product.getProductByCategory(category);
        res.json({result});
    } catch (error){
        res.status(505).json({ success: false });
        console.log('Error gettin product by category : ', error);
    }
}

async function updateProductById(req, res){
    const { product_id, category, description, price, stock_quantity, supplier_id, photo } = req.body;

    try{
        await Product.updateProductById(product_id, category, description, price, stock_quantity, supplier_id, photo_url);
        res.json({ success: true });
    } catch (error) {
        res.status(505).json({ success: false });
        console.log('Error updating product : ', error);
    }
}

async function deleteProductById(req, res){
    const { product_id } = req.query;

    try{
        await Product.deleteProductById(product_id);
        res.json({ success: true });
    } catch (error){
        res.status(505).json({ success: false });
        console.log('Error deleting product : ', error);
    }
}

module.exports = { createProduct, getAllProduct, getProductById, getProductByCategory, updateProductById, deleteProductById };