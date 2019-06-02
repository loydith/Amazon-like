DROP DATABASE IF EXISTS bamazon_DB;
CREATE DATABASE bamazon_DB;

USE bamazon_DB;

CREATE TABLE products(
    item_id INT AUTO_INCREMENT NOT NULL,
    product_name VARCHAR(50),
    department_name VARCHAR(80),
    price DECIMAL(10,2) NOT NULL,
    stock_quantity INT(50) DEFAULT 0,
    PRIMARY KEY (item_id)
);


INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("cucumber", "fruits_vegetables", 0.48, 40);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("lettuce", "fruits_vegetables", 1.28, 30);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("carrots", "fruits_vegetables", 0.98, 75);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("tomatoes", "fruits_vegetables", 0.23, 40);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("celery", "fruits_vegetables", 1.58, 30);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("onions", "fruits_vegetables", 0.59, 75);