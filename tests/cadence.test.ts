import { Cadence } from '../libs/Cadence';
import {cadenceMock} from '../mocks/cadence'
describe('Verify cadence basic info is passed in', () => {
    
    it('On create, Return an error if required info is missing', async () => {
       
        delete cadenceMock.businessId;
        const cadenceTestObject = new Cadence();
        cadenceTestObject.addCadence(cadenceMock).catch(e => {
            console.log(e.details[1]);
            expect(e.details[0].message).toEqual('"businessId" is required')
        });
    });

 // it('On create, Return an error if Business ID is missing', async () => {
    //     const cadenceTestObject = new Cadence({...cadenceMock, businessId: "adasd"});
    //     await cadenceTestObject.addCadence(cadenceTestObject).catch(e => {
    //         expect(e.details[0].message).toEqual('Some Error')
    //     });
    // });
    // it('On create, Return an error if Cadence Action is missing', async () => {
    //     delete cadenceMock.cadenceActions
    //     const cadenceTestObject = new Cadence(cadenceMock);
    //     await cadenceTestObject.addCadence(cadenceTestObject).catch(e => {
    //         expect(e.details[0].message).toEqual('Some Error')
    //     });
    // });
    // it('On create, Successfully inserts data if business policy is missing', async () => {
    //     delete cadenceMock.cadenceHarrassmentPolicies
    //     const cadenceTestObject = new Cadence(cadenceMock);
    //     await cadenceTestObject.addCadence(cadenceTestObject).catch(e => {
    //         expect(e.details[0].message).toEqual('Some Error')
    //     });
    // });
    // it('On create, Return an error if Dispostion rules are missing', async () => {
    //     delete cadenceMock.cadenceDispositionRules
    //     const cadenceTestObject = new Cadence(cadenceMock);
    //     await cadenceTestObject.addCadence(cadenceTestObject).catch(e => {
    //         expect(e.details[0].message).toEqual('Some Error')
    //     });
    // });

// describe('Verify cadence being fetched successfully', () => {
//     it('Cadence Fetch, returns error if candeceId does not exist in the db', async () => {
//         delete cadenceMock.cadenceId
//         const cadenceTestObject = new Cadence(cadenceMock);
//         await cadenceTestObject.getCadenceById(10).catch(e => {
//             expect(e.message).toEqual('Cadence Not Found')
//         })
//     });
//     it('Cadence Fetch, returns cadence object', async () => {
//         delete cadenceMock.cadenceId
//         const cadenceTestObject = new Cadence(cadenceMock);
//         const response = await cadenceTestObject.getCadenceById(1)
//         expect(response.cadenceId).toEqual(1)
//     });
// });

});