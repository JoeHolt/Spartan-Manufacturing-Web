# Spartan Manufacturing Web

A web app for McFarland High School's Spartan Manufacturing class designed to track orders and inventory. I created this to help the tech ed department but also to solidify my knowlage of web development.

## What I learned

I had two main goals in creating this project: to solidify my web development knowlage and to get practice with design. I made use of the MEAN stack (MongoDB, Express, AngularJS and NodeJS). Throughout the whole process I became alot more confident in using every part of the MEAN stack along side other external libraries. I currently host this server on AWS and the creation of this project allowed me to gain more knowlage on how to use AWS(ec2, deploying code, etc). Creating this site also pushed my design knowlage. I worked hard to create a simple and efficent design. See images bellow for what I ended up with.

## Features

- Web Frontend
	- Orders
		- View all orders
		- View orders by product
		- Create orders
		- Modify orders
		- Delete orders
		- Sort based on order status
	- Inventory
		- View Inventory
		- View net inventory based on what is ordered/produced
		- Modify inventory
- Web Server
	- Makes use of API wrapper for connecting to a MongoDB instanse where all data is stored
	- Mongo allows for fast queries and the JSON format is ideal for the situation
	- API endpoints for:
		- Getting orders
		- Getting products
		- Getting status codes
		- Getting max order ID
		- Getting current date as string
		- Adding order
		- Adding product
		- Delete order
		- Delete product
		- Modify inventory
		- Modify order notes
		- Modify product inventory
		- Modify order status
		- Modify full order
		- Modify full product
		
# Quirks

As I was creating this project, I tried to think of a way to dynamically create pages to track the inventory of every product on the site. I needed a way to add/delet pages depending on the inventory at a given time. To do this, I initially thought to use Javascript and AngularJS magic, but as I was researching how todo this I realized that, although it was possible, it was going to require alot of effort. Then the thought popped into my head of a different more "unique" way todo this. I am sure the method I choose is not the "industry standard" but it allowed me to learn abount incorperating python with a node application. 

What I did was create a template navigation bar and template order site page with certain replacable values placed inside(ie ^REPLACE^). When the user then adds a product, the server spawns a new process and runs a python3 script that loops over all of the products, adds a link to each product order page to the navbar and creates a site for said product based on the product name and the replaceable strings. This allows the website to dynamically adjust to adding a product. The same script is ran when deleting a product to give the same result. I initially thought this would be inefficent but it ended up running in around .1s.

# Database structure

This application makes use of MongoDB to store all of its data. All data is store in a MongoDB database named "SpartanMan". In this database there are three collections each with their own JSON objects denoted under the collection name:
- orders
- products
- statusCodes

**Objects in each collection have the following attributes:**

Orders:
- name
- number
- status
- date
- notes
- id
- quantity

Products:
- name
- price
- stock
- pending

Status codes:
- name
- finished

# Images

![Landing](https://i.imgur.com/tcGaciW.png)


![Orders](https://i.imgur.com/QSG5ua0.png)


![Products](https://i.imgur.com/IJ2HDdJ.png)


# Running the server

To get the web server up and running use the typical node enviorment set up. Download the project and in the directory run:

`npm install`

to install all dependencies. The run:

`node ./index.js` 

to start the server on localhost. The server requires a MonogoDB server to be running on the same machine in order to fetch data:

`mongod`

Finally, python3 is a prerequisite for the dynamically adjusting parts of the site (see quirks above). Insure python3 is installed.

# Bugs/Contact

Please contact me with any questions. Feel free to make a pull request with bug fixes or new features!
