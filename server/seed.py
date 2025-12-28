import datetime
from models import Loan, LoanPayment


loans: list[Loan] = [
    Loan(
        id=1,
        name="Tom's Loan",
        interest_rate=5.0,
        principal=10000,
        due_date=datetime.date(2025, 3, 1),
    ),
    Loan(
        id=2,
        name="Chris Wailaka",
        interest_rate=3.5,
        principal=500000,
        due_date=datetime.date(2025, 3, 1),
    ),
    Loan(
        id=3,
        name="NP Mobile Money",
        interest_rate=4.5,
        principal=30000,
        due_date=datetime.date(2025, 3, 1),
    ),
    Loan(
        id=4,
        name="Esther's Autoparts",
        interest_rate=1.5,
        principal=40000,
        due_date=datetime.date(2025, 3, 1),
    ),
]

loan_payments: list[LoanPayment] = [
    LoanPayment(id=1, loan_id=1, payment_date=datetime.date(
        2024, 3, 4), amount=1000.0),
    LoanPayment(id=2, loan_id=2, payment_date=datetime.date(
        2024, 3, 15), amount=2000.0),
    LoanPayment(id=3, loan_id=3, payment_date=datetime.date(
        2024, 4, 5), amount=1500.0),
]