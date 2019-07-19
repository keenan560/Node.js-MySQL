# Node.js-MySQL

# Bamazon

As a part of a class assignment I simulated a backend logistics app that simulates an Amazon experience.

# Technologies

- Node JS
- Inquirer
- mySQL
- cli-table-redemption 


# Bamazon Database

I created a bamazon database (bamazon_db) with contains two tables: "products" and "departments". The products table is where all our items for sale are recorded and maintained with the following fields: 

- product_name
- department_name 
- price
- stock_quantity 
- product_sales

The departments table is where our Managers/Supervisors maintain data on Bamazon departments in the following fields:

- department_id
- department_name
- over_head_costs


# Bamazon Customer JS

When the file is run in node the terminal will first display to the user all the items from the products table. Then the terminal ask the user to enter the item no associated with their desired product as well the desired quantity. Should the desired quantity be more than what's in stock, the terminal will end the transaction with a message informing the user of the stock insufficiency. In contrast if the desired stock amount is available then the user transcation will be completed. Completions means the item's stock will be updated and the sales of that item will be recording in the product_sales field.


# Bamazon Manager JS

This file will display in the console a menu of options to select from:

- view products for sale

    Displays all the items available for sale from the products table.

- view low inventory

    Displays all the items in the products table that have a stock quantity lower than 5.

- add to inventory

    Gives the Bamazon Manager the ability to add more stock to any item listed in the products table.

- add new product

    Goes thru the reuqired fields to input a new item into the products table.

- exit

    Executes connection.end() which stops and file from running and end connection to the database. 


# Bamazon Supervisor JS

This file will give the Bamazon Supervisor two options:

- view product sales by department

    Using a SQL the function will the join the products and department tables in order to see a item's department and the name of sales associated with it. The table will also calculate a total profit field which is the item's sales minus the associated department's over head costs. 

- create new department

    Goes thru the required fields to input a new department into the departments table.


# Demo

    Please see the link to a demonstration:
    https://www.youtube.com/watch?v=hrB4jE7uePY&feature=youtu.be