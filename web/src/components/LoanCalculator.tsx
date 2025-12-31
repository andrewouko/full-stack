import { useMemo } from "react";

interface Props {
  principal: number;
  rate: number;
  months: number;
}

export const LoanCalculator = ({ principal, rate, months }: Props) => {
  const interest = useMemo(() => {
    if (principal <= 0 || rate <= 0 || months <= 0) return 0;
    // Simple interest formula
    return (principal * (rate / 100) * (months / 12)).toFixed(2);
  }, [principal, rate, months]);

  return (
    <div>
      <h3>Loan Interest: {interest}</h3>
    </div>
  );
};
