interface ICadenceHour {
    start: string; end: string;
}

interface ICadenceHours {
     dayName: string; index: number; hours: Array<ICadenceHour> ;
}