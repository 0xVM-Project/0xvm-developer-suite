export namespace PROTOCOL {
    export type Action = 1 | 2 | 3 | 4 | 5; // 1: deploy 2: execute 3: transfer 4: deposit 5: withdraw

    export interface JsonObject {
        action: Action;
        data: string;
    }

    export type JsonObjectList = JsonObject[];
}