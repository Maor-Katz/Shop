const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'megasport'
});


connection.connect((err) => {
    if (err) {
        console.log('Error connecting to Db');
        return;
    }
    console.log('Connected to DB!');
});

function checkUserExists(req, res, next) {
    const { email, Identity_num } = req.body;
    let q = `SELECT * FROM users`
    connection.query(q, (err, results) => {
        if (err) {
            throw err;
        }
        const found = results.find(user => {
            if (user.email === email || user.Identity_num === +Identity_num) {
                return true
            } else {
                return false
            }
        })
        if (found) {
            req.user = found;
        }
        next();
    });
}
function checkIfItemExists(req, res, next) {
    const { product_id } = req.body;
    let q = `SELECT * 
    FROM cartitem`
    connection.query(q, (err, results) => {
        if (err) throw err;
        let found = results.filter(c => c.product_id === product_id);
        if (found.length > 0) {
            req.itemExists = found
        }
        next();
    });
}


//get number of all products
router.get('/', (req, res) => {
    let q = `SELECT COUNT(*) 
    FROM products`
    connection.query(q, (err, results) => {
        if (err) throw err;
        res.json(results);
    });
})

//get all products
router.get('/all', (req, res) => {
    let q = `SELECT * 
    FROM products`
    connection.query(q, (err, results) => {
        if (err) throw err;
        res.json(results);
    });
})

//get userCartId
router.get('/cart/:identity', (req, res) => {
    let q = `SELECT id as cart_id 
    FROM cart where user_id = ${req.params.identity}`
    connection.query(q, (err, results) => {
        if (err) throw err;
        res.json(results);
    });
})

//get products of costumer
router.get('/productsbyid/:email', (req, res) => {
    let q = `select cartitem.quantity, cartitem.price, cartitem.sum_price, products.product_name,products.id as product_id,
    users.Identity_num, users.firstname,users.lastname, users.email, products.img_url
     from cartitem 
     inner join cart on
     cartitem.cart_id = cart.id 
     inner join users on
     cart.user_id = users.Identity_num
     inner join products on 
     products.id = cartitem.product_id
     where users.email = '${req.params.email}'`
    connection.query(q, (err, results) => {
        if (err) throw err;
        res.json(results);
    });
})

//get sum price of specific user
router.get('/sum/:email', (req, res) => {
    let q = `select sum(sum_price)
     from cartitem 
     inner join cart on
     cartitem.cart_id = cart.id 
     inner join users on
     cart.user_id = users.Identity_num
     inner join products on 
     products.id = cartitem.product_id
     where users.email = '${req.params.email}'`
    connection.query(q, (err, results) => {
        if (err) throw err;
        res.json(results);
    });
})
//get all product by category
router.get('/bycategory/:categoryid', (req, res) => {
    let q = `SELECT products.id as product_id, products.product_name,products.price, products.img_url,category.id as category_id ,category.category_name FROM products
    inner join category 
    on products.category_id= category.id
    where category.id = ${req.params.categoryid}`
    connection.query(q, (err, results) => {
        if (err) throw err;
        res.json(results);
    });
})

//get product by name
router.get('/search/:p_name', (req, res) => {
    let q = `select * from products
    where product_name like '%${req.params.p_name}%'`
    connection.query(q, (err, results) => {
        if (err) throw err;
        res.json(results);
    });
})

//get all categories
router.get('/category', (req, res) => {
    let q = `SELECT * 
    FROM category`
    connection.query(q, (err, results) => {
        if (err) throw err;
        res.json(results);
    });
})

//get number of all orders
router.get('/orders', (req, res) => {
    let q = `SELECT COUNT(*) 
    FROM orders `
    connection.query(q, (err, results) => {
        if (err) throw err;
        res.json(results);
    });
})

//add cart item if not exists, if exists, add the quantity
router.post('/cartitem/add', checkIfItemExists, (req, res) => {
    console.log(req.body)
    console.log(req.itemExists)
    const { product_id, quantity, price, cart_id } = req.body
    if (product_id && quantity && price && cart_id) {
        let q;
        if (req.itemExists) {
            console.log('itemexists')
            q = `UPDATE cartitem
SET quantity=quantity+${quantity},sum_price=(price*quantity)
WHERE product_id = ${product_id};`
        } else {
            console.log('not esxits')
            q = `INSERT INTO cartItem (product_id, quantity, price, cart_id)
    VALUES (${product_id}, ${quantity}, ${price}, ${cart_id})`
        }

        connection.query(q, (err, results) => {
            if (err) throw err;
            res.json(results);
        });
    } else {
        res.status(400).send('need more info')
    }

})

//delete item from cartitem table
router.delete('/product/:id', (req, res) => {
    let q = `DELETE FROM cartitem
    WHERE product_id=${req.params.id};`
    connection.query(q, (err, results) => {
        if (err) throw err;
        res.json(results);
    });
})


module.exports = router