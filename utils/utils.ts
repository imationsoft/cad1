import * as mysql from 'mysql'
import * as util from 'util' ;
var PNF = require('google-libphonenumber').PhoneNumberFormat;
var phoneUtil = require('google-libphonenumber').PhoneNumberUtil.getInstance();


export async function createDbConnection(config:any){

    const  conn = mysql.createConnection({
        host     : config.host,
        user     : config.user,
        password : config.password,
        database : config.db,
    });

    return conn;

}

export async function withTransaction( db:any, callback:any ) {
    try {
      await db.beginTransaction();
      await callback();
      await db.commit();
    } catch ( err ) {
      await db.rollback();
      throw err;
    } finally {
      await db.close();
    }
  }

export async function makeDb( config:any ) {
  const connection = await createDbConnection( config );
  return {
    query( sql: string, args: (string | number | Boolean | Date)[] ) {
      return util.promisify( connection.query )
        .call( connection, sql, args );
    },
    close() {
      return util.promisify( connection.end ).call( connection );
    },beginTransaction() {
      return util.promisify( connection.beginTransaction )
        .call( connection );
    },
    commit() {
      return util.promisify( connection.commit )
        .call( connection );
    },
    rollback() {
      return util.promisify( connection.rollback )
        .call( connection );
    }
  }
    
}

export async function validateNumber (number:string, cc:string='' ) {

  number = number.toString();

  var numberPLUS = (number.indexOf("+") === -1 ? "+"+number: number );


  if(cc=="DE" && (number.substr(0,2)=='49' || number.substr(0,3)=='+49')){
      try {
          var phoneLibnum =  phoneUtil.parse(numberPLUS, cc);

          if(phoneUtil.isValidNumber(phoneLibnum)){
              return phoneLibnum;
          }

      } catch (e) {
          console.log({"pass 1": JSON.stringify(e)});
      }
  } else if(cc=="DE"){
      try {
          var phoneLibnum = phoneUtil.parse(number, 'ZZ');
          if (phoneUtil.isValidNumber(phoneLibnum)) {
              return phoneLibnum;
          }
      } catch (e) {
          console.log({"pass 1 B": JSON.stringify(e)});
      }
  }

  //test if valid number with countrycode
  try {
      var phoneLibnum = phoneUtil.parse(number, cc);
      if (phoneUtil.isValidNumber(phoneLibnum)) {
          return phoneLibnum;
      }
  } catch (e) {
      console.log({"pass 2": JSON.stringify(e)});
  }

  try {
      phoneLibnum = phoneUtil.parse(numberPLUS, 'ZZ');
      if (phoneUtil.isValidNumber(phoneLibnum)) {
          return phoneLibnum;
      }
  } catch (e) {
      console.log({"pass 3": JSON.stringify(e)});
      return false;
  }
  return false;


}

export async function formatNumber(phoneNumber:string, format:string){
  return phoneUtil.format(phoneNumber, format);
}

export async function validateContact(number: string){

return { contact : { userId : 2, countryCode: 'US'}}

}
