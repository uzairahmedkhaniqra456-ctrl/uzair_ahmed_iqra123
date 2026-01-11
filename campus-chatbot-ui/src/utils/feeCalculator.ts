type FeeBreakdown = {
  tuitionFee: number;
  registrationFee: number;
  miscFee: number;
  totalPayable: number;
};

const PER_CREDIT_FEE = 7000;
const REGISTRATION_FEE = 6000;
const MISC_FEE = 4000;

export function calculateFees(creditHours: number): FeeBreakdown {
  const tuitionFee = creditHours * PER_CREDIT_FEE;

  const totalPayable =
    tuitionFee + REGISTRATION_FEE + MISC_FEE;

  return {
    tuitionFee,
    registrationFee: REGISTRATION_FEE,
    miscFee: MISC_FEE,
    totalPayable,
  };
}
