import mysql from 'mysql'
import {db_config} from './databaseconfig.js'
var connectionPool
function connectDBRetryOnError() {
    connectionPool = mysql.createPool(db_config)      // Recreate the connection
    connectionPool.getConnection((poolErr, conn) => {
        if (poolErr) {
            console.log('error when connecting to db:', poolErr)
            setTimeout(connectDBRetryOnError, 2000) // We introduce a delay before attempting to reconnect,
        } else {
            console.log("Database Connected")
        }
        conn?.release()
    })
    // process asynchronous requests in the meantime.

    connectionPool.on('error', function (err) {
        console.log('db error', err)
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {  // Connection to the MySQL server is usually
            connectDBRetryOnError()                     // lost due to either server restart, or a
        } else {                                        // connnection idle timeout (the wait_timeout
            throw err                                   // server variable configures this)
        }
    })
}
connectDBRetryOnError()

export function getDatabasePool() {
    return connectionPool
}


export async function queryAsync(query, data= []) {
  return new Promise((resolve, reject) => {
    getDatabasePool().query(query, data, (err, values) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(values);
    });
  });
}

export async function connectionPoolAsync() {
  return new Promise<PoolConnection>((resolve, reject) => {
    getDatabasePool().getConnection((err, conn) => {
      if (err) return reject(err);
      resolve(conn);
    });
  });
}

export async function beginTransactionAsync(conn) {
  return new Promise((resolve, reject) => {
    conn.beginTransaction((err) => {
      if (err) return reject(err);
      resolve();
    });
  });
}

export async function transactionalQueryAsync(
  conn,
  query,
  data= []
) {
  return new Promise<any>((resolve, reject) => {
    conn.query(query, data, (err, values) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(values);
    });
  });
}

export async function commitAsync(conn) {
  return new Promise((resolve, reject) => {
    conn.commit((err) => {
      if (err) return reject(err);
      resolve();
    });
  });
}

export async function rollbackAsync(conn) {
  return new Promise((resolve, reject) => {
    conn.rollback((err) => {
      if (err) return reject(err);
      resolve();
    });
  });
}

