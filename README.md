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
Docker image is using alpine to be as lightweight as possible.
