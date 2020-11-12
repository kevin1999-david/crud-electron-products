const productForm = document.querySelector('#productForm');

const name = document.querySelector('#name');
const price = document.querySelector('#price');
const description = document.querySelector('#description');
const productsList = document.querySelector('#products');

const { remote } = require('electron');
const main = remote.require('./main.js');

let products = [];
let editStatus = false;
let editProductId = '';

productForm.addEventListener(('submit'), async(e) => {
    e.preventDefault();
    const newProduct = {
        name: name.value,
        price: price.value,
        description: description.value
    }

    if (!editStatus) {
        const result = await main.createProduct(newProduct);
        console.log(result);

    } else {
        await main.updateProduct(editProductId, newProduct);
        editStatus = false;
    }
    getProducts();
    productForm.reset();
    name.focus();
});


async function deleteProduct(id) {
    const msg = confirm('Are your sure you want to delete it');
    if (msg) {
        await main.deleteProduct(id);
        getProducts();
        name.focus();
    }
    return;
}

async function editProduct(id) {
    const product = await main.getProductById(id);

    console.log(product);
    name.value = product.name;
    price.value = product.price;
    description.value = product.description;

    editStatus = true;
    editProductId = product.id;

    name.focus();
}

function renderProducts(products) {
    productsList.innerHTML = '';
    products.forEach(product => {
        productsList.innerHTML += `
            <div class="card card-body my-2 animate__animated animate__fadeInLeft">
                <h4>${product.name}</h4>
                <p>${product.description}</p>
                <h3>${product.price}$</h3>
                <p>
                    <button class="btn btn-danger" onclick="deleteProduct('${product.id}');">DELETE</button>
                    <button class="btn btn-secondary" onclick="editProduct('${product.id}')">EDIT</button>
                </p>
            </div>        
        `;
    });
}


const getProducts = async() => {
    products = await main.getProducts();
    renderProducts(products);
}


async function init() {
    await getProducts();
}

init();