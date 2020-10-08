### Installing:

1. npm i
2. cp config/index.js.example config/index.js

### Routes:

##### Rooms:

1. GET /room/getAvailable 
    Accepts "date" field in query, YYYY-MM-DD format.

2. POST /room/create
    Accepts "number" field in body.

3. PUT /room/update
    Accepts room`s "id", "number" fields in body.

4. DELETE /room/delete 
    Accepts "id" field in body. Deletes room and all it`s bookings
##### Bookings:

1. GET /getAvailable 
    Accepts "page", "amount" fields in query.

2. POST /reserve
    Accepts "owner", "from", "to", "roomId" fields in body

3. PUT /update
    Accepts "id", "owner", "from", "to", "roomId" fields in body.

4. DELETE /delete
    Accepts booking`s "id" field in body.