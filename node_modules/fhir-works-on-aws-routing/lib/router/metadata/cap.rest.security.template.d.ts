import { Auth } from 'fhir-works-on-aws-interface';
export default function makeSecurity(authConfig: Auth, hasCORSEnabled?: boolean): {
    cors: boolean;
    service: {
        coding: {
            system: string;
            code: "Basic" | "OAuth" | "SMART-on-FHIR" | "NTLM" | "Kerberos" | "Certificates";
        }[];
    }[];
} | {
    cors: boolean;
    description: string;
};
