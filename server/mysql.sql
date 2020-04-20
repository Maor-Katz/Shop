CREATE DATABASE megasport;

CREATE TABLE Users (
    Identity_num int ,
    firstname varchar(255),
    lastname varchar(255),
    email varchar(255),
    role varchar(255) default 'customer',
    password varchar(255),
    city varchar(255),
    street varchar(255),
    isAdmin boolean default 0,
    primary key(Identity_num)
);
--password for users below is 123
INSERT INTO Users (Identity_num, firstname, lastname, email, role, password, city, street)
VALUES (200929388, "maor", "katz", 'maor@gmail.com', 'admin' ,"$2a$10$jn86lR6PAD6wd6Wrb8KuS.tUh.8cBetYIAfwF5mUR9BpZScie5qKu", 'hod hasharon', 'rakefet'),
(888, "avi", "nimni", 'nimni@gmail.com', 'customer' ,"$2a$10$jn86lR6PAD6wd6Wrb8KuS.tUh.8cBetYIAfwF5mUR9BpZScie5qKu", 'hod hasharon', 'rakefet')

CREATE TABLE Category (
    id int auto_increment,
    category_name text,
    primary key(id)
);

INSERT INTO Category (category_name)
VALUES ("weights"),
("weigt tools"),
("shirts"),
("balls")

CREATE TABLE Products (
    id int auto_increment,
    product_name text,
    category_id int,
    price DECIMAL(10,4), 
    img_url text,
    primary key(id),
    FOREIGN KEY (category_id) REFERENCES Category(id)
);

INSERT INTO Products (product_name, category_id, price, img_url)
VALUES ("gladiator", 2, 3000, "https://www.ygl.co.il/media/catalog/product/cache/8c57341a38dc5cfb4ae0966e4e268371/9/1/9101.jpg"),
("Nike shirt - dry fit", 3, 150, "https://images-na.ssl-images-amazon.com/images/I/81fYI9q%2BAAL._AC_UX679_.jpg"),
("kettlebell - 16kg", 1, 200, "https://grandstore.co.il/image/cache/catalog/NEW/vinyl-kettlebell-16kg-600x600.jpg"),
("basketball", 4, 80, "https://streetball.co.il/wp-content/uploads/2018/04/Nike-Dominate-Basketball.jpg")

CREATE TABLE Cart (
    id int auto_increment,
    user_id int,
    cart_date datetime default now(), 
    primary key(id),
    FOREIGN KEY (user_id) REFERENCES Users(Identity_num)
);

INSERT INTO Cart (user_id)
VALUES (200929388),
(888)

CREATE TABLE Orders (
    id int auto_increment ,
    user_id int,
    cart_id int,
    total_price DECIMAL(10,4),
    city varchar(255),
    street varchar(255),
    arrival_date datetime,
    order_date datetime,
    4DigitsCard int,
    isDone boolean default false,
    primary key(id),
    FOREIGN KEY (user_id) REFERENCES Users(Identity_num)
        
);

INSERT INTO Orders (user_id, cart_id, total_price, city, street, arrival_date, order_date, 4DigitsCard)
VALUES (200929388, 1, 3500, "hod hasharon", "rakefet", '2020-04-10 13:17:17', '2020-01-18 13:17:17', 7777),
(888, 2, 400, "holon", "kipurim", '2020-04-11 10:17:17', '2020-01-20 13:17:17', 8888)

CREATE TABLE cartItem (
    id int auto_increment ,
    product_id int,
    quantity int,
    price DECIMAL(6,2),
    sum_price DECIMAL(10,2) default (price*quantity),
    cart_id int,
    primary key(id),
    FOREIGN KEY (product_id) REFERENCES Products(id),
    FOREIGN KEY (cart_id) REFERENCES Cart(id)
);

INSERT INTO cartItem (product_id, quantity, price, cart_id)
VALUES (1, 1, 3000, 1),
(2, 2, 150, 1),
(3, 1, 200, 1),
(3, 2, 200, 2)



