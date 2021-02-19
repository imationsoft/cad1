interface ICadenceHarrasmentPolicy {
    cadenceHarrassmentPolicyId?: number,
    channel: string,
    frequency: number,
    durationCount: number,
    durationGrouping: string,
    calculatedDuration: number,
    cadenceId?: number
}
