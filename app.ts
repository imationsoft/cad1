
import { 
  APIGatewayProxyEvent, 
  APIGatewayProxyResult 
} from "aws-lambda";

import { Cadence } from './libs/Cadence'

module.exports.post = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
    try {
      let body:any;
      try {
        body = JSON.parse(event.body);
      } catch (e) {
        body = event.body
      }
      let result = {}
      const cadence:Cadence = new Cadence();
      switch (event.path) {
        case '/processTrigger':
            result = await cadence.processTrigger(body);
          break
        case '/cadence':
          result = await cadence.addCadence(body);
          break
      }
      return {
          statusCode: 200,
          body: JSON.stringify({result}),
      };
  } catch (e) {
      return {
          statusCode: 400,
          body: JSON.stringify({"success": false, "message": e.message, "error": e.stack})
      };
  }
}

module.exports.get = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
    try {
      let body:any;
      try {
        body = JSON.parse(event.body);
      } catch (e) {
        body = event.body
      }
      const cadenceId = event.queryStringParameters && event.queryStringParameters.cadenceId ? parseInt(event.queryStringParameters.cadenceId) : null;
      if(!cadenceId) throw new Error("Cadence ID Missing. Please provide the Cadence ID.");
      const cadence: Cadence = new Cadence();
      const result = await cadence.getCadenceById(cadenceId);
      //const result = "get"
      return {
          statusCode: 200,
          
          body: JSON.stringify(result),
      };
  } catch (e) {
      return {
          statusCode: 400,
          body: JSON.stringify({"success": false, "message": e.message, "error": e.stack})
      };
  }
}

module.exports.put = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
    try {
      let body:any;
      try {
        body = JSON.parse(event.body);
      } catch (e) {
        body = event.body
      }

      const cadence:Cadence = new Cadence();
      const result = await cadence.updateCadence(body);
      return {
          statusCode: 200,
          body: JSON.stringify(result),
      };
  } catch (e) {
      return {
          statusCode: 400,
          body: JSON.stringify({"success": false, "message": e.message, "error": e.stack})
      };
  }
}
