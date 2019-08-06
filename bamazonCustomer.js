const mysql = require("mysql");
const inquirer = require("inquirer");
const Table = require('cli-table');
const chalk = require('chalk');

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
    connection.query("SELECT * FROM products", function (err, results) {
        if (err) throw err;
        console.log("results: " + JSON.stringify(results))
        let stock = results.stock_quantity;
        inquirer
            .prompt([{
                name: "item",
                type: "input",
                message: "Input the ID number of the item you would like to buy",
                validate: function (value) {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return false;
                }
            },
            {
                name: "amount",
                type: "input",
                message: "How many would you like to order?",
                validate: function (value) {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return false;
                }
            }])
            .then(function (answer) {
                let newStock = stock - answer.amount;
                if (answer.amount < results.stock_quantity) {
                    console.log(`Insufficient quantity! Only ${results.stock_quantity} in stock`)
                    start();
                }
                else {
                    connection.query("UPDATE products SET ? WHERE ?",
                        [
                            {
                                stock_quantity: newStock
                            },
                            {
                                id: answer.item
                            }
                        ],
                        function (error) {
                            if (error) throw err;
                            console.log("Your items are on the way!");
                            start();
                        }
                    );
                }
            });
    });
}