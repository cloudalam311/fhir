/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */
export const financialResources = [
    'Coverage',
    'CoverageEligibilityRequest',
    'CoverageEligibilityResponse',
    'EnrollmentRequest',
    'EnrollmentResponse',
    'Claim',
    'ClaimResponse',
    'Invoice',
    'PaymentNotice',
    'PaymentReconciliation',
    'Account',
    'ChargeItem',
    'ChargeItemDefinition',
    'Contract',
    'ExplanationOfBenefit',
    'InsurancePlan',
];
const RBACRules = (baseResources) => {
    return {
        version: 1.0,
        groupRules: {
            practitioner: {
                operations: ['create', 'read', 'update', 'delete', 'vread', 'search-type', 'transaction'],
                resources: baseResources,
            },
            'non-practitioner': {
                operations: ['read', 'vread', 'search-type'],
                resources: financialResources,
            },
            auditor: {
                operations: ['read', 'vread', 'search-type'],
                resources: ['Patient'],
            },
        },
    };
};
export default RBACRules;
//# sourceMappingURL=RBACRules.js.map