"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeDb = exports.withTransaction = exports.createDbConnection = void 0;
const mysql = require("mysql");
const util = require("util");
async function createDbConnection(config) {
    const conn = mysql.createConnection({
        host: config.host,
        user: config.user,
        password: config.password,
        database: config.db,
    });
    return conn;
}
exports.createDbConnection = createDbConnection;
async function withTransaction(db, callback) {
    try {
        await db.beginTransaction();
        await callback();
        await db.commit();
    }
    catch (err) {
        await db.rollback();
        throw err;
    }
    finally {
        await db.close();
    }
}
exports.withTransaction = withTransaction;
async function makeDb(config) {
    const connection = await createDbConnection(config);
    return {
        query(sql, args) {
            return util.promisify(connection.query)
                .call(connection, sql, args);
        },
        close() {
            return util.promisify(connection.end).call(connection);
        }, beginTransaction() {
            return util.promisify(connection.beginTransaction)
                .call(connection);
        },
        commit() {
            return util.promisify(connection.commit)
                .call(connection);
        },
        rollback() {
            return util.promisify(connection.rollback)
                .call(connection);
        }
    };
}
exports.makeDb = makeDb;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJ1dGlscy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSwrQkFBOEI7QUFDOUIsNkJBQThCO0FBR3ZCLEtBQUssVUFBVSxrQkFBa0IsQ0FBQyxNQUFVO0lBRS9DLE1BQU8sSUFBSSxHQUFHLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQztRQUNqQyxJQUFJLEVBQU8sTUFBTSxDQUFDLElBQUk7UUFDdEIsSUFBSSxFQUFPLE1BQU0sQ0FBQyxJQUFJO1FBQ3RCLFFBQVEsRUFBRyxNQUFNLENBQUMsUUFBUTtRQUMxQixRQUFRLEVBQUcsTUFBTSxDQUFDLEVBQUU7S0FDdkIsQ0FBQyxDQUFDO0lBRUgsT0FBTyxJQUFJLENBQUM7QUFFaEIsQ0FBQztBQVhELGdEQVdDO0FBRU0sS0FBSyxVQUFVLGVBQWUsQ0FBRSxFQUFNLEVBQUUsUUFBWTtJQUN2RCxJQUFJO1FBQ0YsTUFBTSxFQUFFLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztRQUM1QixNQUFNLFFBQVEsRUFBRSxDQUFDO1FBQ2pCLE1BQU0sRUFBRSxDQUFDLE1BQU0sRUFBRSxDQUFDO0tBQ25CO0lBQUMsT0FBUSxHQUFHLEVBQUc7UUFDZCxNQUFNLEVBQUUsQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUNwQixNQUFNLEdBQUcsQ0FBQztLQUNYO1lBQVM7UUFDUixNQUFNLEVBQUUsQ0FBQyxLQUFLLEVBQUUsQ0FBQztLQUNsQjtBQUNILENBQUM7QUFYSCwwQ0FXRztBQUVJLEtBQUssVUFBVSxNQUFNLENBQUUsTUFBVTtJQUN0QyxNQUFNLFVBQVUsR0FBRyxNQUFNLGtCQUFrQixDQUFFLE1BQU0sQ0FBRSxDQUFDO0lBQ3RELE9BQU87UUFDTCxLQUFLLENBQUUsR0FBVyxFQUFFLElBQTBDO1lBQzVELE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBRSxVQUFVLENBQUMsS0FBSyxDQUFFO2lCQUN0QyxJQUFJLENBQUUsVUFBVSxFQUFFLEdBQUcsRUFBRSxJQUFJLENBQUUsQ0FBQztRQUNuQyxDQUFDO1FBQ0QsS0FBSztZQUNILE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBRSxVQUFVLENBQUMsR0FBRyxDQUFFLENBQUMsSUFBSSxDQUFFLFVBQVUsQ0FBRSxDQUFDO1FBQzdELENBQUMsRUFBQyxnQkFBZ0I7WUFDaEIsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFFLFVBQVUsQ0FBQyxnQkFBZ0IsQ0FBRTtpQkFDakQsSUFBSSxDQUFFLFVBQVUsQ0FBRSxDQUFDO1FBQ3hCLENBQUM7UUFDRCxNQUFNO1lBQ0osT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFFLFVBQVUsQ0FBQyxNQUFNLENBQUU7aUJBQ3ZDLElBQUksQ0FBRSxVQUFVLENBQUUsQ0FBQztRQUN4QixDQUFDO1FBQ0QsUUFBUTtZQUNOLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBRSxVQUFVLENBQUMsUUFBUSxDQUFFO2lCQUN6QyxJQUFJLENBQUUsVUFBVSxDQUFFLENBQUM7UUFDeEIsQ0FBQztLQUNGLENBQUE7QUFFSCxDQUFDO0FBdkJELHdCQXVCQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIG15c3FsIGZyb20gJ215c3FsJ1xuaW1wb3J0ICogYXMgdXRpbCBmcm9tICd1dGlsJyA7XG5cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGNyZWF0ZURiQ29ubmVjdGlvbihjb25maWc6YW55KXtcblxuICAgIGNvbnN0ICBjb25uID0gbXlzcWwuY3JlYXRlQ29ubmVjdGlvbih7XG4gICAgICAgIGhvc3QgICAgIDogY29uZmlnLmhvc3QsXG4gICAgICAgIHVzZXIgICAgIDogY29uZmlnLnVzZXIsXG4gICAgICAgIHBhc3N3b3JkIDogY29uZmlnLnBhc3N3b3JkLFxuICAgICAgICBkYXRhYmFzZSA6IGNvbmZpZy5kYixcbiAgICB9KTtcblxuICAgIHJldHVybiBjb25uO1xuXG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB3aXRoVHJhbnNhY3Rpb24oIGRiOmFueSwgY2FsbGJhY2s6YW55ICkge1xuICAgIHRyeSB7XG4gICAgICBhd2FpdCBkYi5iZWdpblRyYW5zYWN0aW9uKCk7XG4gICAgICBhd2FpdCBjYWxsYmFjaygpO1xuICAgICAgYXdhaXQgZGIuY29tbWl0KCk7XG4gICAgfSBjYXRjaCAoIGVyciApIHtcbiAgICAgIGF3YWl0IGRiLnJvbGxiYWNrKCk7XG4gICAgICB0aHJvdyBlcnI7XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIGF3YWl0IGRiLmNsb3NlKCk7XG4gICAgfVxuICB9XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBtYWtlRGIoIGNvbmZpZzphbnkgKSB7XG4gIGNvbnN0IGNvbm5lY3Rpb24gPSBhd2FpdCBjcmVhdGVEYkNvbm5lY3Rpb24oIGNvbmZpZyApO1xuICByZXR1cm4ge1xuICAgIHF1ZXJ5KCBzcWw6IHN0cmluZywgYXJnczogKHN0cmluZyB8IG51bWJlciB8IEJvb2xlYW4gfCBEYXRlKVtdICkge1xuICAgICAgcmV0dXJuIHV0aWwucHJvbWlzaWZ5KCBjb25uZWN0aW9uLnF1ZXJ5IClcbiAgICAgICAgLmNhbGwoIGNvbm5lY3Rpb24sIHNxbCwgYXJncyApO1xuICAgIH0sXG4gICAgY2xvc2UoKSB7XG4gICAgICByZXR1cm4gdXRpbC5wcm9taXNpZnkoIGNvbm5lY3Rpb24uZW5kICkuY2FsbCggY29ubmVjdGlvbiApO1xuICAgIH0sYmVnaW5UcmFuc2FjdGlvbigpIHtcbiAgICAgIHJldHVybiB1dGlsLnByb21pc2lmeSggY29ubmVjdGlvbi5iZWdpblRyYW5zYWN0aW9uIClcbiAgICAgICAgLmNhbGwoIGNvbm5lY3Rpb24gKTtcbiAgICB9LFxuICAgIGNvbW1pdCgpIHtcbiAgICAgIHJldHVybiB1dGlsLnByb21pc2lmeSggY29ubmVjdGlvbi5jb21taXQgKVxuICAgICAgICAuY2FsbCggY29ubmVjdGlvbiApO1xuICAgIH0sXG4gICAgcm9sbGJhY2soKSB7XG4gICAgICByZXR1cm4gdXRpbC5wcm9taXNpZnkoIGNvbm5lY3Rpb24ucm9sbGJhY2sgKVxuICAgICAgICAuY2FsbCggY29ubmVjdGlvbiApO1xuICAgIH1cbiAgfVxuICAgIFxufVxuIl19