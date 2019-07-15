

var Table = require('cli-table-redemption');

var mysql = require('mysql');

var inquirer = require('inquirer');


var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1Barbuda',
    database: 'bamazon_db'
});

connection.connect();


connection.query('SELECT * FROM products', function (error, results, fields) {
    if (error) throw error;

    var table = new Table({
        head: ['Item No', 'Product Name', 'Department', 'Price', 'Stock'],
        colWidths: [15, 25, 20, 15, 15]
    });

    for (var i = 0; i < results.length; i++) {
        table.push([`${results[i].item_id}`,`${results[i].product_name}`,`${results[i].department_name}`,`${results[i].price.toFixed(2)}`,`${results[i].stock_quantity}`]);
    }

    // for (var i = 0; i < results.length; i++) {
    //     console.log(`-------Item No: ${results[i].item_id}-------\nProduct Name: ${results[i].product_name}\nDepartment: ${results[i].department_name}\nPrice: $${results[i].price.toFixed(2)}\nStock: ${results[i].stock_quantity}
    //     `);
    // };

    console.log(table.toString());
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

// connection.end();