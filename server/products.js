const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const jwt = require('jsonwebtoken');
const pdf = require('html-pdf');
const bodyParser = require('body-parser');
const formidable = require('formidable');
const bluebird = require('bluebird');
const fs = bluebird.promisifyAll(require('fs'));
const app = express()
const path = require('path');
const aws = require('aws-sdk');
const multerS3 = require('multer-s3');
const multer = require('multer');


app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

const pdfTemplate = require('./public/mytemplate')

const connection = mysql.createConnection({
    host: 'qbhol6k6vexd5qjs.cbetxkdyhwsb.us-east-1.rds.amazonaws.com',
    user: 'jtctj841reqed4pa',
    password: 'mp7wqnw4limu2z5o',
    database: 'smwqc0rzzgmbwwzm'
});

connection.connect((err) => {
    if (err) {
        console.log('Error connecting to Db');
        return;
    }
    console.log('Connected to DB!');
});

const onlyUsers = (req, res, next) => {
    const token = req.header("token")
    if (token) {
        jwt.verify(token, "blah", (err, decoded) => {
            if (err) {
                res.sendStatus(401)
            } else {
                req.user = decoded
                next();
            }
        })
    } else {
        res.status(401).send('required token')
    }
}

function checkIfItemExists(req, res, next) {
    const {product_id, cart_id} = req.body;
    let q = `SELECT * 
    FROM cartitem`
    connection.query(q, (err, results) => {
        if (err) throw err;
        let found = results.filter(c => c.product_id === product_id && c.cart_id === cart_id);
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
        res.header("Cache-Control", "no-cache, no-store, must-revalidate");
        res.json(results);
    });
})
//check how many orders for specific date
router.get('/ordersbydate/:dateString', (req, res) => {
    let q = `SELECT * FROM orders
    where arrival_date like'%${req.params.dateString}%'`
    connection.query(q, (err, results) => {
        if (err) throw err;
        res.json(results);
    });
})
//get all products
router.get('/all', onlyUsers, (req, res) => {

    let q = `SELECT * 
    FROM products`
    connection.query(q, (err, results) => {
        if (err) throw err;
        res.header("Cache-Control", "no-cache, no-store, must-revalidate");
        res.json(results);

    });
})
//get orders to see if there is an open reservation
router.get('/cart/:identity', (req, res) => {
    console.log(req.params, 'koko')
    let q = `select * from orders
    where user_id= ${req.params.identity}`
    connection.query(q, (err, results) => {
        if (err) throw err;
        res.header("Cache-Control", "no-cache, no-store, must-revalidate");
        res.json(results);
    });
})
//get products of costumer
router.get('/productsbyid/:email', onlyUsers, (req, res) => {
    let q = `select cartitem.quantity, cartitem.price, cartitem.sum_price, products.product_name,products.id as product_id,
    users.Identity_num, users.firstname,users.lastname, users.email, products.img_url
     from cartitem 
     inner join cart on
     cartitem.cart_id = cart.id 
     inner join users on
     cart.user_id = users.Identity_num
     inner join products on 
     products.id = cartitem.product_id
     inner join orders 
     on orders.cart_id=cart.id
     where users.email = '${req.params.email}'
     AND orders.isDone=0`
    connection.query(q, (err, results) => {
        if (err) throw err;
        res.header("Cache-Control", "no-cache, no-store, must-revalidate");
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
     inner join orders
     on orders.cart_id=cart.id
     where users.email = '${req.params.email}'
     AND orders.isDone=0`
    connection.query(q, (err, results) => {
        if (err) throw err;
        res.header("Cache-Control", "no-cache, no-store, must-revalidate");
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
//open new cart
router.post('/newcart', (req, res) => {
    const {Identity_num, city, street, dateNow} = req.body
    if (Identity_num && city && street && dateNow) {
        let q1 = `INSERT INTO cart (user_id)
    VALUES (${Identity_num})`

        connection.query(q1, (err, results) => {
            if (err) throw err;

            let q2 = `INSERT INTO orders (user_id, cart_id, total_price, city, street, arrival_date, order_date, 4DigitsCard)
    VALUES (${Identity_num}, ${results.insertId}, 0, "${city}", "${street}", 'TBD', '${dateNow}', 0)`
            console.log(results.insertId)
            connection.query(q2, (err, lastResults) => {
                if (err) throw err;
                res.json(lastResults);
            });
        });
    } else {
        res.status(400).send('need more info')
    }
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
//get cartid of open reservation by id number
router.get('/getcartid/:idnum', (req, res) => {
    console.log(req.params, 'blah')
    let q = `select * from orders
    where user_id= ${req.params.idnum}
    AND isDone=0`
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
        res.header("Cache-Control", "no-cache, no-store, must-revalidate");
        res.json(results);
    });
})
//get amount of all orders
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
    const {product_id, quantity, price, cart_id, sum_price} = req.body
    console.log(req.body, "fefe")
    if (product_id && quantity && price && cart_id) {
        let q;
        if (req.itemExists) {
            console.log('itemexists')
            q = `UPDATE cartitem
SET quantity=quantity+${quantity},sum_price=(price*quantity)
WHERE product_id = ${product_id};`
        } else {
            console.log('not esxits')
            q = `INSERT INTO cartitem (product_id, quantity, price, sum_price, cart_id)
    VALUES (${product_id}, ${quantity}, ${price}, ${sum_price},${cart_id})`
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
//confirm reservation
router.post('/confirm/:id', (req, res) => {
    console.log('confirmmm')
    const {arrival_date} = req.body
    if (arrival_date && req.params.id) {
        let q1 = `UPDATE orders
        SET arrival_date = '${arrival_date}', isDone= 1
        WHERE user_id=${req.params.id}`

        connection.query(q1, (err, results) => {
            if (err) throw err;
            res.json(results)
        });
    } else {
        res.status(400).send('need more info')
    }
})
//download voucher
router.post('/download/:cartid', (req, res) => {

    let q = `select cartitem.quantity, cartitem.cart_id, cartitem.sum_price, cartitem.price, products.product_name from cartitem
    inner join products
    on products.id=cartitem.product_id
    where cartitem.cart_id=${req.params.cartid}`

    let q1 = `select sum(sum_price) as total_price  from cartitem
    where cartitem.cart_id=${req.params.cartid}`

    connection.query(q, (err, results) => {
        if (err) throw err;
        // res.json(results);
        connection.query(q1, (err, resultsSum) => {
            if (err) throw err;
            pdf.create(pdfTemplate(resultsSum, results, req.body), {}).toFile('./public/result.pdf', (err) => {
                if (err) {
                    return Promise.reject()
                }
                return Promise.resolve()
            })

            // res.sendFile("/result.pdf")
            res.json(results)
        });

    });

})
//save pdf file
router.get('/invoice', (req, res) => {
    res.download(__dirname + "/public/result.pdf")
})

//this function returns true or false
async function checkCreateUploadsFolder(uploadsFolder) {
    try {
        await fs.statAsync(uploadsFolder)
    } catch (e) {
        if (e && e.code == ' ENOENT') {
            try {
                fs.mkdirAsync(uploadsFolder)
            } catch (err) {
                console.error('error creating uploads folder')
                return false
            }
        } else {
            console.log('error reading uploads folder')
            return false;
        }
    }
    return true;
}

//return true or false in case it was successfull
function checkFileType(file) {
    const type = file.type.split('/').pop()
    const validTypes = ['png', 'jpg', 'jpeg', 'gif']
    if (validTypes.indexOf()) {
        console.log('file type is invalid')
        return false
    }
    return true;
}

const s3 = new aws.S3({
    accessKeyId: 'AKIASDV2U6NJMZQRJD64',
    secretAccessKey: 'OsUe0eq0qnYtxF+e7yt0P4nSIXkp+w3LaGyhpqn',
    bucket: 'maor-katz-new-bucket1990'
})
const profileImgUpload = multer({
    storage: multerS3({
        s3: s3,
        bucket: 'onclick',
        acl: 'public-read',
        key: function (req, file, cb) {
            cb(null, path.basename(file.originalname, path.extname(file.originalname)) + '-' + Date.now() + path.extname(file.originalname))
        }
    }),
    limits: {fileSize: 20000000}, // In bytes: 2000000 bytes = 2 MB
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    }
}).single('profileImage');

function checkFileType(file, cb) {
    // Allowed ext
    const filetypes = /jpeg|jpg|png|gif/;
    // Check ext
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check mime
    const mimetype = filetypes.test(file.mimetype);
    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb('Error: Images Only!');
    }
}

//upload image to server
router.post('/uploadimg', async (req, res) => {
    const s3 = new aws.S3({
        accessKeyId: 'AKIASDV2U6NJMZQRJD64',
        secretAccessKey: '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',
        bucket: 'maor-katz-new-bucket1990'
    })

    const form = new formidable.IncomingForm()
    await form.parse(req, function (err, fields, files) {
        console.log(files.abc.path, 'filessman')
        console.log(files.abc)
        console.log("hi")
        const fileContent = fs.readFileSync(`tmp/${files.name}`);

        console.log(fileContent, "filecontent duede")
        const params = {
            Bucket: 'maor-katz-new-bucket1990',
            Key: files.abc.name, // File name you want to save as in S3
            Body: fileContent
        };
        s3.upload(params, function (err, data) {
            if (err) {
                throw err;
            }
            console.log(`File uploaded successfully. ${data.Location}`);
        });
        console.log(fileContent, 'ahaha done');
    })
// });

// form.on('file', (name, file) => {
    // file.path = path.join(__dirname + '/public/uploads/' + file.name)

    // const fileContent = fs.readFileSync(file.path);

// Setting up S3 upload parameters
//         const params = {
//             Bucket: 'maor-katz-new-bucket1990',
//             Key: file.name, // File name you want to save as in S3
//             Body: fileContent
//         };

// Uploading files to the bucket
//         s3.upload(params, function (err, data) {
//             if (err) {
//                 throw err;
//             }
//             console.log(`File uploaded successfully. ${data.Location}`);
//         });
//         console.log(file.path);
//     })
    // form.on('file', (name, file) => {
    //     console.log('uploaded file ' + file.name)
    // })
    res.json({ok: true, msg: 'image uploaded'})
});


//add new product
router.post('/addproduct', (req, res) => {
    const {name, category_id, price, imgName} = req.body
    let q = `INSERT INTO products (product_name, category_id, price, img_url)
VALUES ("${name}", ${category_id}, ${price}, "${imgName}")`
    connection.query(q, (err, results) => {
        if (err) throw err;
        res.json(results);
    });
})
//edit existing product
router.post('/editproduct', (req, res) => {
    const {name, category_id, price, img_name, productToEdit} = req.body
    let q = `UPDATE products
    SET product_name = '${name}', category_id = ${category_id}, price = ${price}, img_url='${img_name}' 
    WHERE products.id=${productToEdit};`
    connection.query(q, (err, results) => {
        if (err) throw err;
        res.json(results);
    });
})
//get open reservation of specific user, if there is(return all products to specific user)
router.get('/openreservation/:email', (req, res) => {
    const {email} = req.body;
    let q = `select orders.order_date, orders.user_id, orders.isDone, orders.cart_id from orders
    inner join users
    on users.Identity_num=orders.user_id
    inner join cartitem 
    on cartitem.cart_id=orders.cart_id
    where orders.isDone=0
    AND users.email = '${req.params.email}';`
    connection.query(q, (err, results) => {
        if (err) throw err;
        res.json(results);
    });
})
//get all completed orders of specific user
router.get('/allreservations/:email', (req, res) => {
    const {email} = req.body;
    let q = `select * from orders
    inner join users
    on users.Identity_num=orders.user_id
    where users.email = '${req.params.email}'
    AND orders.isDone=1`
    connection.query(q, (err, results) => {
        if (err) throw err;
        res.json(results);
    });
})

module.exports = router

