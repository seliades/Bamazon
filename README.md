# Bamazon

[Link to Video Demo of Bamazon Customer and Manager Applications](https://drive.google.com/open?id=1fbYXprC4fgomkRqtA23X-TrOLBd8th6C)

## Description
This Bamazon Node application is a digital marketplace that runs through the command line and utlizes JavaScript and several Node modules. You will see a table with the available items in the marketplace and their prices. There are multiple .js files, and you will choose one based upon how you are trying to access the market place. 

## Commands Used & What is Returned

### Bamazon Customer
Running bamazonCustomer.js gives you access to the marketplace as a customer. You will be prompted to select the ID number of the item you would like to purchase, and then you will be prompted to enter the quantity of that item you would like to purchase. If the marketplace has enough stock to fulfill your order then your order will be placed and the remaining stock will be updated. If the marketplace cannot fulfill your order it will alert you and return you to select a new quantity.

### Bamazon Manager
Running bamazonManager.js gives you access to the marketplace as a manager. You will be given an options menu with 4 tasks as well as the option to Close.

- View Products: This will bring up the full marketplace for you to view
- Review Low Inventory: This will bring up only the items in the marketplace that currently have less than 5 units in stock
- Add Items to Inventory: This will prompt you to input the ID number of the item you would like to restock, and then it will prompt you for the number of units to add to the current stock
- Add New Product: This will prompt you to input the name, department, price, and stock quantity of a new item, and then it will add it to the marketplace and display the new table

## Modules Used
- mysql
- inquirer
- cli-table