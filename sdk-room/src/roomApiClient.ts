import * as http from 'http';

export class RoomApiClient {

    domain: string

    constructor (baseDomain: string) {
        this.domain = baseDomain;
    }

}