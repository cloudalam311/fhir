export interface ResourceCapability {
    type: string;
    supportedProfile: string[];
}
export interface ResourceCapabilityStatement {
    [resourceType: string]: ResourceCapability;
}
