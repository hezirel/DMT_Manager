# DMT Manager

Small scale app to manager deliveries, made to help a friend.

## Install

Use docker-compose to install the app.

```
docker compose -f docker-compose.yml up -d
```

## Architecture

Use of Mongodb Aggregation Pipeline to manage data display relativily  
MVC structure with Express coupled with Mongoose ODM manager  
Docker image is using alpine to be as lightweight as possible

## Data Models

TODO

## Uses

Main problem that the app intend to solve is collecting data about each parcels to be transported.

A transport is an object requiring a driver, a vehicle and an array of deliveries  
A delivery is an object requiring a pickup & a dropoff placetimes  
A placetime denotes a type (pickup || dropoff), a client, a location and a date  
A client has a name and an array of locations  

## API Specs

TODO
