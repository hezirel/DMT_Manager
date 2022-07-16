# DMT Manager

Small scale app to manager deliveries, made to help a friend  

## Install

Use docker-compose to install the app.

```
docker compose -f docker-compose.yml up -d
```

Temporary HTML interface accessible on localhost:3000  
MongooseExpress interface on localhost:8081  
MongoDB on localhost:4000

## Uses

Main problem that the app intend to solve is collecting data about each parcels to be transported.

A transport is an object requiring a driver, a vehicle and an array of deliveries  
A delivery is an object requiring a pickup & a dropoff placetimes  
A placetime denotes a type (pickup || dropoff), a client, a location and a date  
A client has a name and an array of locations  

## Comments

Concepts and points of interest:
- MongoDB and Object Data Modeling with Mongoose
	- Use of embedded documents vs linking with ObjectIds
	- Design choices based on Domain specific needs and specific cases
		- Ability to keep address embedded in parcels
			- Clients addresses can be changed and deleted without breaking links for parcels
		- Linking parcels to clients
			- No parcels go unaccounted for
- Express.js and Node.js 
- API optimization
	- By reducing calls to DB
	- Implementing aggregation pipeline
		- To keep compute heavy operations on server side
		- Reduce size of data sent over wires

## Planned features

### Front End / React App

#### Views

- Home page
	- Add New Transport
	- Modales quick add
		- Client
		- Driver
		- Vehicle  
- Client 
	- Locations list  
- Transports
	- Transport list
		- Driver
		- deliveries[0].pickup.place.city
		- deliveries[0].pickup.date
		- deliveries[deliveries.length].dropoff.place.city
		- deliveries[deliveries.length].dropoff.date  
- Drivers
	- List of drivers
		- Transports count
		- List of transports by driver  
- Parcels
	- List of parcels
		- pickup, dropoff
			- Link Client
			- Embed Location
			- Embed date

### Back End

- Various optimizations & refactors

## Architecture

Use of Mongodb Aggregation Pipeline to manage data display relativily  
MVC structure with Express coupled with Mongoose ODM manager  
Docker image is using alpine to be as lightweight as possible

## Data Models

TODO => Some kind of file to recap data models


## API Specs

TODO => Open API file
