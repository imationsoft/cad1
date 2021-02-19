import config from '../config';
import { makeDb } from '../utils/utils';

class CadenceProcessing {

    createCadenceProcessing = async (values: any) => {
      const query = `
          INSERT INTO calls.CadenceProcessing (cadenceId, businessId, userId, cadenceVersion, targetPhoneNumber, triggerDate, status, substatus)
          VALUES ('${values.cadenceId}', '${values.businessId}', '${values.userId}', '${values.cadenceVersion}', '${values.targetPhoneNumber}', "${new Date()}", "processing", NULL)
        `
        const db = await makeDb(config.db);
        const result = await db.query(query, []);
        return result
    };

    fetchCadenceProcessing = async (
      cadenceId:  String | Number, 
      businessId: String | Number, 
      userId:     String | Number
      ) => {
        try {
          const query = `
            SELECT *
            FROM calls.CadenceProcessing as c
            WHERE   c.cadenceId   =   ${cadenceId}
            AND     c.businessId  =   ${businessId}
            AND     c.userId      =   ${userId}
          `
          const db = await makeDb(config.db);
          const result = await db.query(query, []);
          return result
        } catch (error) {
          return { error: 'Failed to fetch' }
        }
    };

    updateCadenceProcessing = async (args: String, status: String, cadenceProcessId: String | Number) => {
      try {
          const query = `
          UPDATE calls.CadenceProcessing
          SET ${args}
          WHERE cadenceProcessId = ${cadenceProcessId}
          AND status = ${status}
        `
        //TODO:: add where clause to only update records that are scheduled.
        const db = await makeDb(config.db);
        const result = await db.query(query, []);
        return result
      } catch (error) {
        return { error: 'Failed to update' }
      }
    };

    fetchWithTargetNumber = async (
      cadenceId:          String | Number, 
      targetPhoneNumber:  String | Number
      ) => {
        try {
          const query = `
            SELECT *
            FROM calls.CadenceProcessing as c
            WHERE cadenceId          =   '${cadenceId}'
            AND   targetPhoneNumber  =   '${targetPhoneNumber}'
            ORDER BY cadenceProcessId desc limit 1
          `
          const db = await makeDb(config.db);
          const result = await db.query(query, []);
          return result
        } catch (error) {
          return { error: 'Failed to fetch' }
        }
    };
}

export { CadenceProcessing }