interface ICadenceAction {
        cadenceId?: number,
        cadenceActionId?: number,
        status: string,
        actionIndex: number,
        type: string,
        durationFromLastAction: number,
        durationGrouping: string,
        calculatedDuration: number,
        retryCall: number,
        maxRetries: number,
        callRetryIn: number,
        retryGrouping: string,
        smsTemplatedId?: number,
        smsMessage?: string
    
}
