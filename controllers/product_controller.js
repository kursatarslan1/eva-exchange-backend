const { Product } = require('../models/product_model');

async function createProduct(req, res){
    const { product_name, category, description, price, stock_quantity, supplier_id, photo, sub_category } = req.body;
    let photo_url = await uploadPhoto(photo[0].base64, photo[0].path);

    try{
        const addProductRes = await Product.create(product_name, category, description, price, stock_quantity, supplier_id, photo_url, sub_category);
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

module.exports = { createProduct, getProductById, getProductByCategory, updateProductById, deleteProductById };