import React, { useState } from "react";
import { useQuery } from "@apollo/client";
import { usePagination } from "../hooks/pagination";
import { Table } from "./table";
import { Spinner } from "./spinner";
import {
  LoansDocument,
  LoansQuery,
  LoansQueryVariables,
  LoanPaymentsDocument,
  LoanPaymentsQuery,
  LoanPaymentsQueryVariables,
  PaymentStatus,
} from "../__generated__/graphql";
import { Loan } from "../types";

const PAGE_SIZE_OPTIONS = [1, 5, 10];

const paymentStatusClass: Record<PaymentStatus, string> = {
  ON_TIME: "on-time-status",
  LATE: "late-status",
  DEFAULTED: "defaulted-status",
  UNPAID: "unpaid-status",
};

const paymentStatusText: Record<PaymentStatus, string> = {
  ON_TIME: "On Time",
  LATE: "Late",
  DEFAULTED: "Defaulted",
  UNPAID: "Unpaid",
};

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
      <h2>
        Payments for Loan: <em>{loan.name}</em>
      </h2>
      <Table
        title="Payments"
        columnNames={[
          "Payment ID",
          "Payment Amount",
          "Interest Rate",
          "Principal",
          "Due Date",
          "Payment Date",
          "Status",
        ]}
        data={loanPayments.map((payment) => ({
          id: payment.id,
          amount: payment.amount.toLocaleString("en-KE", {
            style: "currency",
            currency: "KES",
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }),
          interestRate: (payment.interestRate / 100).toLocaleString("en-KE", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
            style: "percent",
          }),
          principal: payment.principal.toLocaleString("en-KE", {
            style: "currency",
            currency: "KES",
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }),
          dueDate: payment.dueDate,
          paymentDate: payment.paymentDate ? payment.paymentDate : "N/A",
          status: paymentStatusText[payment.status],
          className: paymentStatusClass[payment.status],
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
  const { data, loading, error } = useQuery<LoansQuery, LoansQueryVariables>(
    LoansDocument,
    {
      variables: { cursor, limit },
    }
  );

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
        <div
          className="modal-overlay"
          onClick={(e) => {
            // Prevent bubbling to avoid closing when clicking inside the modal
            if (e.target === e.currentTarget) {
              setSelectedLoan(null);
            }
          }}
        >
          <div className="modal scrollable-modal">
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
