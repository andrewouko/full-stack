export type LoanPayment = {
    id: number;
    loanId: number;
    amount: number;
    paymentDate: string;
};

export type Loan = {
    id: number;
    name: string;
    principal: number;
    interestRate: number;
    dueDate: string;
};
