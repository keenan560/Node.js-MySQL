
require('dotenv').config();

var mysql = require('mysql');

var inquirer = require('inquirer');

const chalk = require('chalk');

var Table = require('cli-table-redemption');

const {
    HOST,
    USER,
    PASSWORD,
    DATABASE

} = process.env

var connection = mysql.createConnection({
    host: HOST,
    user: USER,
    password: PASSWORD,
    database: DATABASE
});
connection.connect();

inquirer
    .prompt([
        {
            type: 'list',
            name: 'menuChoice',
            message: 'What would you like to do Manager?',
            choices: [
                'View Products for Sale',
                'View Low Inventory',
                'Add to Inventory',
                'Add New Product',
                "Exit"
            ]
        }
    ]).then(answers => {
        // console.log(answers); 
        switch (answers.menuChoice) {
            case 'View Products for Sale':
                viewAll();
                break;
            case 'View Low Inventory':
                viewLow();
                break;
            case 'Add to Inventory':
                addInv();
                break;
            case 'Add New Product':
                addProd();
                break;
            case "Exit":
                connection.end();
                break;
        }
    });

function viewAll() {
    connection.query(`SELECT * FROM products PROUCTS`, function (err, results, fields) {
        if (err) throw err;
        var table = new Table({
            head: [chalk.yellow('Item No'), chalk.yellow('Product Name'), chalk.yellow('Department'), chalk.yellow('Price'), chalk.yellow('Stock')],
            colWidths: [15, 25, 20, 15, 15]
        });

        for (var i = 0; i < results.length; i++) {
            table.push([`${chalk.white(results[i].item_id)}`, `${results[i].product_name}`, `${results[i].department_name}`, `${chalk.green('$')}${chalk.green(results[i].price.toFixed(2))}`, `${chalk.blue(results[i].stock_quantity)}`]);
        }


        console.log(chalk.cyan(table.toString()));
        connection.end();
    })
};

function viewLow() {
    connection.query(`SELECT * FROM products WHERE stock_quantity < 5`, function (err, results) {
        if (err) throw err;

        var table = new Table({
            head: [chalk.yellow('Item No'), chalk.yellow('Product Name'), chalk.yellow('Department'), chalk.yellow('Price'), chalk.yellow('Stock')],
            colWidths: [15, 25, 20, 15, 15]
        });

        for (var i = 0; i < results.length; i++) {
            table.push([`${chalk.white(results[i].item_id)}`, `${results[i].product_name}`, `${results[i].department_name}`, `${chalk.green('$')}${chalk.green(results[i].price.toFixed(2))}`, `${chalk.blue(results[i].stock_quantity)}`]);
        }

        console.log(chalk.cyan(table.toString()));

        connection.end();
    });
};

function addInv() {
    inquirer
        .prompt([
            {
                type: 'input',
                name: 'itemNo',
                message: 'Please enter Item Number'

            }, {
                type: 'input',
                name: 'addAmount',
                message: 'How much inventory would you like to add?'
            }
        ]).then(answers => {
            // console.log(answers);
            var itemNo = answers.itemNo;
            var amount = answers.addAmount;

            connection.query(`UPDATE products SET stock_quantity =  stock_quantity + ${amount} WHERE item_id = ${itemNo}`, function (err, results) {
                if (err) throw err;
                console.log("Inventory sucessfully added!");
                connection.end();
            });

        });

};


function addProd() {
    inquirer
        .prompt([
            {
                name: 'itemName',
                message: 'Please Enter Name of New Product'
            }, {
                name: "department",
                message: `What is the name of the item's department?`,
            }, {
                name: 'price',
                message: `Please Enter the Item's Price`
            }, {
                name: 'stock',
                message: `Please enter the item's stock`
            }
        ]).then(answers => {
            var itemName = answers.itemName;
            var department = answers.department;
            var price = answers.price;
            var stock = answers.stock;
            // console.log(answers);

            connection.query(`INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES ('${itemName}', '${department}', ${price}, ${stock})`, function (err, results) {
                if (err) throw err;
                console.log("Item sucessfully added!");
                connection.end();
            });

        });

}