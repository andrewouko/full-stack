from dataclasses import dataclass
from typing import Optional
import strawberry
import datetime


@strawberry.type
@dataclass
class Loan:
    id: int
    name: str
    interest_rate: float
    principal: float
    due_date: datetime.date


@strawberry.input
@dataclass
class LoanFilter:
    name: Optional[str]
    interest_rate: Optional[float]
    principal: Optional[float]
    due_date: Optional[datetime.date]


@strawberry.type
@dataclass
class LoanPayment:
    id: int
    loan_id: int
    payment_date: datetime.date
    amount: float
