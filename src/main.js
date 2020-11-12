const { BrowserWindow, Notification } = require('electron');
const { getConnection } = require('./database');

let window;

async function createProduct(product) {
    try {
        const conn = await getConnection();
        product.price = parseFloat(product.price);
        const result = await conn.query('INSERT INTO product SET ?', product);
        new Notification({
            title: 'Electron Mysql',
            body: 'New Product Saved Successfully!'
        }).show();
        product.id = result.insertId;
        return product;
    } catch (error) {
        console.log(error);
    }
}

async function deleteProduct(id) {
    const conn = await getConnection();
    const result = await conn.query('DELETE FROM product WHERE id = ?', id);
    return result;
}

async function getProductById(id) {
    const conn = await getConnection();
    const product = await conn.query('SELECT * FROM product WHERE id = ?', id);
    return product[0];
}

async function updateProduct(id, product) {
    const conn = await getConnection();
    const resultUpdate = await conn.query('UPDATE product SET ? WHERE id = ?', [product, id]);
    return resultUpdate;
}

async function getProducts() {
    const conn = await getConnection();
    const products = await conn.query('SELECT * FROM product ORDER BY id DESC');
    console.log(products);
    return products;
}

function createWindow() {
    window = new BrowserWindow({
        width: 700,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true
        }
    });
    window.loadFile('src/ui/index.html');
}

module.exports = { createWindow, createProduct, getProducts, deleteProduct, getProductById, updateProduct }