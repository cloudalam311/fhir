import { IssueSeverity, IssueCode } from 'fhir-works-on-aws-interface';
export default class OperationsGenerator {
    static generateOperationOutcomeIssue(severity: IssueSeverity, code: IssueCode, diagnosticMessage: string, divMessage?: string): {
        resourceType: string;
        text: {
            status: string;
            div: string;
        };
        issue: {
            severity: IssueSeverity;
            code: IssueCode;
            diagnostics: string;
        }[];
    };
    static generateSuccessfulDeleteOperation(count?: number): {
        resourceType: string;
        text: {
            status: string;
            div: string;
        };
        issue: {
            severity: string;
            code: string;
            diagnostics: string;
        }[];
    };
}
