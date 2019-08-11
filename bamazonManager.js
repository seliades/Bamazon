const mysql = require("mysql");
const inquirer = require("inquirer");
const Table = require('cli-table');

const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password",
    database: "bamazon_db"
});

connection.connect(function (err) {
    if (err) throw err;
    menu();
});

function menu() {
    inquirer.prompt([{
        name: "menu",
        type: "list",
        message: "What would you like to do?",
        choices: ['View Products', 'Review Low Inventory', 'Add Items to Inventory', 'Add New Product', '{CLOSE}']
    }]).then(function (result) {
        switch (result.menu) {
            case 'View Products':
                viewProducts();
                break;
            case 'Review Low Inventory':
                reviewInventory();
                break;
            case 'Add Items to Inventory':
                updateInventory();
                break;
            case 'Add New Product':
                addProduct();
                break;
            case '{CLOSE}':
                process.exit();
                break;
        };
    });
}

function viewProducts() {
    connection.query("SELECT id, product_name, price, stock_quantity FROM products", function (err, results) {
        if (err) throw err;
        let table = new Table({
            head: ['Item ID', 'Product Name', 'Price', 'Remaining Stock'],
            colWidths: [10, 40, 10, 18]
        });
        for (let i = 0; i < results.length; i++) {
            table.push([results[i].id, results[i].product_name, "$" + results[i].price, results[i].stock_quantity]);
        }
        console.log(table.toString());
        menu();
    });
}

function reviewInventory() {
    connection.query("SELECT id, product_name, price, stock_quantity FROM products WHERE stock_quantity < 5", function (err, results) {
        if (err) throw err;
        let table = new Table({
            head: ['Item ID', 'Product Name', 'Price', 'Remaining Stock'],
            colWidths: [10, 40, 10, 18]
        });
        for (let i = 0; i < results.length; i++) {
            table.push([results[i].id, results[i].product_name, "$" + results[i].price, results[i].stock_quantity]);
        }
        console.log(table.toString());
        menu();
    });
}

function updateInventory() {
    inquirer
        .prompt([{
            name: "restock",
            type: "input",
            message: "Input the ID number of the item you would like to restock:",
            validate: function (value) {
                if (isNaN(value) === false) {
                    return true;
                }
                return false;
            }
        }
        ]).then(function (answer) {
            let input = answer.restock;
            restockItem(input);
        });
}

function restockItem(input) {

    connection.query("SELECT * FROM products WHERE id LIKE ?", [input],
        function (err, results) {

            if (err) throw err;
            console.log("\n~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
            console.log(`You Selected ${results[0].product_name} which has ${results[0].stock_quantity} remaining`);
            console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n");

            function restockInquirer(results) {

                let quantity = parseInt(results[0].stock_quantity);
                let ID = parseInt(results[0].id);
                inquirer
                    .prompt([{
                        name: "amount",
                        type: "input",
                        message: "Input the number of units you would like to add to the inventory:",
                        validate: function (value) {
                            if (isNaN(value) === false) {
                                return true;
                            }
                            return false;
                        }
                    }])
                    .then(function (answer) {
                        let selection = parseInt(answer.amount);
                        let newInventory = quantity + selection;
                        connection.query("UPDATE products SET ? WHERE ?",
                            [{
                                stock_quantity: newInventory
                            },
                            {
                                id: ID
                            }],
                            function (error) {
                                if (error) throw err;
                                console.log("\n~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
                                console.log(`Item restocked! The marketplace now has ${newInventory} ${results[0].product_name}`);
                                console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n");
                                menu();
                            })
                    });
            }
            restockInquirer(results);
        })
}


function addProduct() {
    inquirer
        .prompt([
        {
            name: "name",
            type: "input",
            message: "Input the name of the product you would like to add to the marketplace:"
        },
        {
            name: "department",
            type: "input",
            message: "Input the department name to which this product belongs:"
        },
        {
            name: "price",
            type: "input",
            message: "Input the price for the product:",
            validate: function (value) {
                if (isNaN(value) === false) {
                    return true;
                }
                return false;
            }
        },
        {
            name: "stock",
            type: "input",
            message: "Input the number of units that will be in stock:",
            validate: function (value) {
                if (isNaN(value) === false) {
                    return true;
                }
                return false;
            }
        }
        ]).then(function (answer) {
            let name = answer.name;
            let department = answer.department;
            let price = answer.price;
            let stock = answer.stock;
            pushProduct(name, department, price, stock);
            console.log(`You have added ${stock} ${name} to the ${department} department, at a cost of $${price} per unit`)
            viewProducts();
        });
}


function pushProduct(name, department, price, stock) {
    connection.query("INSERT into products SET ?",
        {
            product_name: name,
            department: department,
            price: price,
            stock_quantity: stock
        }
    );
}