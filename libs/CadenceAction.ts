import config from '../config';
import { makeDb } from '../utils/utils';

class CadenceAction {
  fetchCadenceProcessing = async (cadenceId: String | Number) => {
      const query = `
        SELECT * 
        FROM CadenceAction as c
        WHERE c.cadenceId = ${cadenceId}
      `
      const db = await makeDb(config.db);
      const result = await db.query(query, []);
      return result
  };
}

export { CadenceAction }