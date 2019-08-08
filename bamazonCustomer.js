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
    start();
});

function start() {
    connection.query("SELECT id, product_name, price, stock_quantity FROM products", function (err, results) {
        if (err) throw err;
        for (let i = 0; i < results.length; i++) {
            let table = new Table({
                head: ['Item ID', 'Product Name', 'Price', 'Remaining Stock'],
                colWidths: [10, 40, 10, 18]
            });
            table.push([results[i].id, results[i].product_name, "$" + results[i].price, results[i].stock_quantity]);

            console.log(table.toString());
        }
        selectItem();
    });
}

function selectItem() {
    inquirer
        .prompt([{
            name: "item",
            type: "input",
            message: "Input the ID number of the item you would like to buy:",
            validate: function (value) {
                if (isNaN(value) === false) {
                    return true;
                }
                return false;
            }
        }
        ]).then(function (answer) {
            let input = answer.item;
            purchaseItem(input);
            if (!input) {
                console.log("~~~~~~~~~~~~~~~~~~~~~~~");
                console.log("Please enter an ID:");
                console.log("~~~~~~~~~~~~~~~~~~~~~~~");
                selectItem();
            }
        });
}

function purchaseItem(input) {
    connection.query("SELECT * FROM products WHERE id LIKE ?", [input],
        function (err, results) {
            if (err) throw err;
            console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
            console.log(`You Selected ${results[0].product_name} which costs $${results[0].price} per unit`);
            console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
            function purchaseInquirer() {
                let quantity = results[0].stock_quantity;
                let ID = results[0].id;
                let price = results[0].price;
                inquirer
                    .prompt([{
                        name: "amount",
                        type: "input",
                        message: "Input the number of units you would like to order:",
                        validate: function (value) {
                            if (isNaN(value) === false) {
                                return true;
                            }
                            return false;
                        }
                    }]).then(function (answer) {
                        let selection = answer.amount;
                        let cost = price * selection
                        if (quantity < selection) {
                            console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
                            console.log(`Insufficient quantity! Only ${results[0].stock_quantity} in stock`);
                            console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
                            purchaseInquirer();
                        }
                        else if (selection < quantity) {
                            let difference = quantity - selection;
                            connection.query("UPDATE products SET ? WHERE ?",
                                [{
                                    stock_quantity: difference
                                },
                                {
                                    id: ID
                                }],
                                function (error) {
                                    if (error) throw err;
                                    console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
                                    console.log("Your items are on their way! Your total cost is $" + cost);
                                    console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
                                    connection.end();
                                })
                        }
                        else if (!selection) {
                            console.log("~~~~~~~~~~~~~~~~~~~~~~~~~");
                            console.log("Please enter a quantity:");
                            console.log("~~~~~~~~~~~~~~~~~~~~~~~~~");
                            purchaseItem();
                        }
            });
        }
        purchaseInquirer();
    })
};
