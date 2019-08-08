USE mysql;
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password';
GRANT ALL PRIVILEGES ON bamazon_db.* TO 'root'@'localhost';

CREATE DATABASE bamazon_db;
USE bamazon_db;

create table products(
id integer auto_increment not null,
product_name varchar(100) not null,
department varchar(100) not null,
price decimal(9,2) not null,
stock_quantity integer(10) not null,
primary key (id)
);

insert into products (product_name, department, price, stock_quantity) value ('Used pink bathrobe', 'Clothing', 12.00, 50);
insert into products (product_name, department, price, stock_quantity) value ('Rare mint snowglobe', 'Holiday', 50.00, 3 );
insert into products (product_name, department, price, stock_quantity) value ('Smurf TV tray', 'Collectables', 30.00, 10);
insert into products (product_name, department, price, stock_quantity) value ('Pet rock', 'Pets', 8.00, 500);
insert into products (product_name, department, price, stock_quantity) value ('Alf alarm clock', 'Collectables', 65.00, 25);
insert into products (product_name, department, price, stock_quantity) value ('Shatners old toupee', 'Memorabilia', 1000.00, 15);
insert into products (product_name, department, price, stock_quantity) value ('Slightly damaged golf bag', 'Sporting Goods', 85.00, 50);
insert into products (product_name, department, price, stock_quantity) value ('Beanie Babies new with tag', 'Collectables', 15.00, 250);
insert into products (product_name, department, price, stock_quantity) value ('Dukes of Hazard Ashtray', 'Collectables', 70.00, 20);
insert into products (product_name, department, price, stock_quantity) value ('Pacman Fever lunchbox', 'School Supplies', 25.00, 40);
insert into products (product_name, department, price, stock_quantity) value ('Pack of vintage tube socks', 'Clothing', 4.99, 500);
insert into products (product_name, department, price, stock_quantity) value ('Kleenex used by Dr Dre', 'Memorabilia', 1000.00, 3);
insert into products (product_name, department, price, stock_quantity) value ('Farrah Fawcet poster', 'Home Decor', 20.00, 30);
insert into products (product_name, department, price, stock_quantity) value ('Pez dispensers', 'Food', 1.99, 1000);
insert into products (product_name, department, price, stock_quantity) value ('Toaster', 'Appliances', 40.00, 500);

select * from products;