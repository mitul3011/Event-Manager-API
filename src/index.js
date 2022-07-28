const express = require('express');
const db = require('./db/mongodb');
const eventRouter = require('./router/event');

const port = process.env.PORT || 3000;
const app = express();

app.use(express.json());
app.use('/api/v3/app', eventRouter);

db.connectToDB((error) => {
    if(error){
        return console.error(error);
    }

    app.listen(port, () => {
    console.log('Server is up on port', port);
    });
});