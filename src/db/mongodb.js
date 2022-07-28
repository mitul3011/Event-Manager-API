const mongodb = require('mongodb');

const connectionURL = 'mongodb://127.0.0.1:27017';
const databaseName = 'event-manager';

const client = new mongodb.MongoClient(connectionURL, {
    useNewUrlParser: true, 
    useUnifiedTopology: true
});

let dbConnection;

function connectToDB(callback){
    client.connect((error, db) => {
        if(error){
            return callback(error);
        }

        dbConnection = db.db(databaseName);
        console.log('Successfully Connected to MongoDB.');

        return callback();
    });
}

function getDB(){
    return dbConnection;
}

module.exports = {
    connectToDB,
    getDB
};