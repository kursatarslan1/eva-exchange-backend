const { client } =  require('../middleware/database');

class Product{
    constructor(product_id, product_name, category, description, price, stock_quantity, supplier_id, photo_url,sub_category){
        this.product_id = product_id;
        this.product_name = product_name;
        this.category = category;
        this.description = description;
        this.price = price;
        this.stock_quantity = stock_quantity;
        this.supplier_id = supplier_id;
        this.photo_url = photo_url;
        this.sub_category = sub_category;
    }

    static async create(product_name, category, description, price, photo_url, sub_category){
        const queryText = 'INSERT INTO products (product_name, category, description, price, photo_url, sub_category) VALUES($1, $2, $3, $4, $5, $6);';
        const values = [product_name, category, description, price, photo_url, sub_category];

        try{
            await client.query(queryText, values);
            return true;
        } catch (error){
            console.log('Error creating product: ', error);
        }
    }

    static async getAllProduct(){
        const queryText = 'SELECT * FROM products;';

        try{
            const result = await client.query(queryText, []);
            return result.rows;
        } catch (error){
            console.log('Error getting products')
        }
    }

    static async getProductByProductId(product_id){
        const queryText = 'SELECT * FROM products WHERE product_id = $1;';
        
        try{
            const result = await client.query(queryText, [product_id]);
            return result.rows;
        } catch (error) {
            console.log('Error getting products')
        }
    }

    static async getProductByCategory(category){
        const queryText = 'SELECT * FROM products WHERE category = $1;';

        try {
            const result = await client.query(queryText, [category]);
            return result.rows;
        } catch (error){
            console.log('Error getting products by category');
        }
    }

    static async updateProductById(product_id, category, description, price, photo_url){
        const queryText = 'UPDATE product SET category=$2, description=$3, price=$4, photo_url=$5 WHERE product_id=$1;';
        const values = [product_id, category, description, price,  photo_url];

        try{
            await client.query(queryText, values);
            return true;
        } catch (error){
            console.log('Error updating product: ', error);
        }
    }

    static async deleteProductById(product_id){
        const queryText = 'DELETE FROM product WHERE product_id = $1;';
        
        try{
            await client.query(queryText, [product_id]);
            return true;
        } catch (error){
            console.log('Error deleting product: ', error);
        }
    }
}

module.exports = { Product }