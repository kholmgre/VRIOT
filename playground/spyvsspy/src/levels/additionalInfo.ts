export class AdditionalInfo {
    items: any[];
    debug: boolean;

    constructor(items: any[] = [], debug: boolean = false){
        this.items = items;
        this.debug = debug;
    }
}