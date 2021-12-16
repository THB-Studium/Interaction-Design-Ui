/**
 * @description
 * Interface that is called by all components that communicate with the DB to persist object. 
 */
export declare interface OnCommit {
    /**
     * A callback method that is invoked before any information is sent to the server to be processed and saved.
     * This could help to avoid saving duplicate information for example.
     */
    beforeSave(): void;

    /**
     * A callback method that is invoked before any information is sent to the server to be updated.
     */
    beforeUpdate(): void;
}