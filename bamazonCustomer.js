
require('dotenv').config();

const chalk = require('chalk');

var Table = require('cli-table-redemption');

var mysql = require('mysql');

var inquirer = require('inquirer');

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


connection.query('SELECT * FROM products', function (error, results, fields) {
    if (error) throw error;

    var table = new Table({
        head: [chalk.yellow('Item No'), chalk.yellow('Product Name'), chalk.yellow('Department'), chalk.yellow('Price'), chalk.yellow('Stock')],
        colWidths: [15, 25, 20, 15, 15]
    });

    for (var i = 0; i < results.length; i++) {
      
        table.push([`${chalk.white(results[i].item_id)}`,`${results[i].product_name}`,`${results[i].department_name}`,`${chalk.green('$')}${chalk.green(results[i].price.toFixed(2))}`,`${chalk.blue(results[i].stock_quantity)}`]);
    }


    console.log(chalk.cyan(table.toString()));
    inquirer
        .prompt([
            {
                name: "id",
                message: "Please enter the ID number of product"
            },
            {
                name: "stock",
                message: "How many units of this product would you like?"
            }
        ])
        .then(answers => {
      
            // console.log(answers);
            var productID = answers.id;
            var customerStock = answers.stock;
            connection.query(`SELECT * FROM products WHERE item_id = ${productID}`, function(err, results, fields){
                if (err) throw err;
               
                if (parseInt(results[0].stock_quantity.toString()) < parseInt(customerStock)) {
                    console.log(`Insufficient quantity! There are only ${results[0].stock_quantity} left.`);
                    connection.end();
                } else {

                    var newStock = parseInt(results[0].stock_quantity.toString()) - parseInt(customerStock);
                    var total = (parseInt(customerStock) * parseInt(results[0].price.toString())).toFixed(2);
            
                    connection.query(`UPDATE products SET stock_quantity = ${newStock} WHERE item_id = ${productID}`, function(err, results, fields){
                        if (err) throw err;
                        addSales(total, productID);
                        console.log(`Your order was sucessful\nYour total is $${total}`);
                        connection.end();
                    })
                }

            })

        });
});

function addSales(total, productID) {
    connection.query(`UPDATE products SET product_sales = product_sales + ${total} WHERE item_id = ${productID}`, function(err, results){
        if (err) throw err;
        console.log(`Sales recorded`);
    });
}
