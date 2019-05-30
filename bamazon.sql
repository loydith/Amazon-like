DROP DATABASE IF EXISTS bamazon_DB;
CREATE DATABASE bamazon_DB;

USE bamazon_DB;

CREATE TABLE products(
  item_id INT NOT NULL,
  product_name VARCHAR(100) NOT NULL,
  department_name VARCHAR(50) NOT NULL,
  price DECIMAL(10,2) NULL,
  stock_quantity Boolean default 0,
  PRIMARY KEY (id)
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