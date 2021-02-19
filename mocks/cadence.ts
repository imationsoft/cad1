export const cadenceMock: ICadence = {

    "businessId": 995,
    "status": "active",
    "cadenceName": "name",
    "lastUpdate": "2020-01-01",
    "eventUrl": "event.com",
    "checkDnc": 1,
    "reEnrollment": 1,
    "useContactOwner": 1,
    "autoAssignOwner": 1,
    "version": 12,
    "queueid": 10,

    "cadenceHours": [
        { dayName: 'Mon' , index:1, hours: [ { start: '8:15', end:'12:00' }, {start:'13:00', end: '17:30'} ]},
        { dayName: 'Tue' , index:2, hours: [ { start: '8:15', end:'12:00' }, {start:'13:00', end: '17:30'} ]},
        { dayName: 'Wed' , index:3, hours: [ { start: '8:15', end:'12:00' }, {start:'13:00', end: '17:30'} ]},
        { dayName: 'Thu' , index:4, hours: [ { start: '8:15', end:'12:00' }, {start:'13:00', end: '17:30'} ]},
        { dayName: 'Fri' , index:5, hours: [ { start: '8:15', end:'12:00' }, {start:'13:00', end: '17:30'} ]}
    ],

    "targetHours": [
        { dayName: 'Mon' , index:1, hours: [ { start: '8:15', end:'12:00' }, {start:'13:00', end: '17:30'} ]},
        { dayName: 'Tue' , index:2, hours: [ { start: '8:15', end:'12:00' }, {start:'13:00', end: '17:30'} ]},
        { dayName: 'Wed' , index:3, hours: [ { start: '8:15', end:'12:00' }, {start:'13:00', end: '17:30'} ]},
        { dayName: 'Thu' , index:4, hours: [ { start: '8:15', end:'12:00' }, {start:'13:00', end: '17:30'} ]},
        { dayName: 'Fri' , index:5, hours: [ { start: '8:15', end:'12:00' }, {start:'13:00', end: '17:30'} ]}
    ],
    "cadenceActions": [
        {
            "status": "active",
            "actionIndex": 1,
            "type": "call",
            "durationFromLastAction": 2600,
            "durationGrouping": "2020-01-02",
            "calculatedDuration": 2600,
            "retryCall": 2600,
            "maxRetries": 3,
            "callRetryIn": 5400,
            "retryGrouping": "2020-01-02",
            "smsTemplatedId": 0,
            "smsMessage": null
        },
        {
            "status": "active",
            "actionIndex": 2,
            "type": "sms",
            "durationFromLastAction": 2600,
            "durationGrouping": "2020-01-02",
            "calculatedDuration": 2800,
            "retryCall": 2800,
            "maxRetries": 3,
            "callRetryIn": 5400,
            "retryGrouping": "2020-01-02",
            "smsTemplatedId": 0,
            "smsMessage": null
        }


    ],
    "cadenceHarrassmentPolicies" : [              {
                "channel": "call",
                "frequency": 2,
                "durationCount": 45,
                "durationGrouping": "2020-02-20",
                "calculatedDuration": 45
    }],
    "cadenceDispositionRules" : [
    {
                "dispositionId": 16,
                "action": "call",
                "targetCadence": 12
    }

    ]
}