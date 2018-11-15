const mysql = require( 'mysql' );
var conf = require('./auth.json');

//Database connection class from
//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises
class DatabaseConnection {
    constructor(config){


        this.connection = mysql.createConnection(conf);
    }

    query( sql, args ) {
        return new Promise( ( resolve, reject ) => {
            this.connection.query( sql, args, ( err, rows ) => {
                if ( err )
                    return reject( err );
                resolve( rows );
            } );
        } );
    }

    insertInto( sql, args ) {
        return new Promise( ( resolve, reject ) => {
            this.connection.query( sql, args, ( err, results, fields) => {
                if ( err )
                    return reject( err );
                resolve(results);
            } );
        } );
    }

    deleteFrom( sql, args ) {
        return new Promise( ( resolve, reject ) => {
            this.connection.query( sql, args, ( err, results, fields) => {
                if ( err )
                    return reject( err );
                resolve(results);
            } );
        } );
    }

    close() {
        return new Promise( ( resolve, reject ) => {
            this.connection.end( err => {
                console.log("Closing connection");
                if ( err ) {
                    console.log("Oh no an err " + err);
                    return reject(err);
                }
                resolve();
            } );
        } );
    }

}


module.exports = DatabaseConnection;