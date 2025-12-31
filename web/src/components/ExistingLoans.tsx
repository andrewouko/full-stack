import React, { useState } from "react";
import { useQuery } from "@apollo/client";
import { usePagination } from "../hooks/pagination";
import { Table } from "./table";
import { Spinner } from "./spinner";
import {
  GetLoansDocument,
  GetLoansQuery,
  GetLoansQueryVariables,
  LoanPaymentsDocument,
  LoanPaymentsQuery,
  LoanPaymentsQueryVariables,
} from "../__generated__/graphql";
import { Loan } from "../types";

const PAGE_SIZE_OPTIONS = [1, 5, 10];

const PaymentList: React.FC<{ loan: Loan }> = ({ loan }) => {
  const { data, loading, error } = useQuery<
    LoanPaymentsQuery,
    LoanPaymentsQueryVariables
  >(LoanPaymentsDocument, {
    variables: { loanId: loan.id },
    fetchPolicy: "no-cache",
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const loanPayments = data?.loanPayments ?? [];
  return (
    <>
      <h2>Payments for Loan: {loan.name}</h2>
      <Table
        title="Payments"
        columnNames={["Payment ID", "Amount", "Date"]}
        data={loanPayments.map((payment) => ({
          id: payment.id,
          amount: payment.amount.toLocaleString("en-KE", {
            style: "currency",
            currency: "KES",
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }),
          paymentDate: payment.paymentDate,
        }))}
        loading={false}
        hasError={false}
      />
    </>
  );
};

export const ExistingLoans: React.FC = () => {
  const [limit, setLimit] = useState<number>(PAGE_SIZE_OPTIONS[0]);
  const { goToNextPage, goToPreviousPage, cursor } = usePagination();
  const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null);
  const { data, loading, error } = useQuery<
    GetLoansQuery,
    GetLoansQueryVariables
  >(GetLoansDocument, {
    variables: { cursor, limit },
  });

  if (loading) return <Spinner />;
  if (error) return <div>Error: {error.message}</div>;

  const loans = data?.loans ?? [];

  return (
    <>
      <Table
        title="Loans"
        columnNames={["ID", "Name", "Principal", "Interest %", "Due Date"]}
        data={loans.map((loan) => ({
          id: loan.id,
          name: loan.name,
          principal: loan.principal.toLocaleString("en-KE", {
            style: "currency",
            currency: "KES",
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }),
          interestRate: (loan.interestRate / 100).toLocaleString("en-KE", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
            style: "percent",
          }),
          dueDate: loan.dueDate,
        }))}
        loading={loading}
        hasError={!!error}
        pagination={{
          limit,
          setLimit,
          cursor,
          goToNextPage,
          goToPreviousPage,
          pageSizeOptions: PAGE_SIZE_OPTIONS,
        }}
        onRowClick={(loan) =>
          setSelectedLoan({
            id: loan.id,
            name: loan.name,
            interestRate: Number(loan.interestRate),
            principal: Number(loan.principal),
            dueDate: loan.dueDate,
          })
        }
      />
      {selectedLoan && (
        <div className="modal-overlay">
          <div className="modal">
            <PaymentList loan={selectedLoan} />
            <button
              className="modal-close"
              onClick={() => setSelectedLoan(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};
