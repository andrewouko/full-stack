from itertools import count
from typing import List, Optional
from models import Loan, LoanFilter
from repositories import Repository


class LoanService:
    _id_counter = count(1)

    def __init__(self, repo: Repository[Loan]):
        self._repo = repo

    def get_loans(
        self,
        cursor: Optional[int],
        limit: Optional[int],
        filter: Optional[LoanFilter],
    ) -> List[Loan]:
        def filter_fn(loan: Loan) -> bool:
            if filter is None:
                return True
            if filter.name is not None and loan.name != filter.name:
                return False
            if filter.interest_rate is not None and loan.interest_rate != filter.interest_rate:
                return False
            if filter.principal is not None and loan.principal != filter.principal:
                return False
            if filter.due_date is not None and loan.due_date != filter.due_date:
                return False
            return True

        return self._repo.get_all(cursor=cursor, limit=limit, filter_fn=filter_fn)

    def get_loan_by_id(self, loan_id: int) -> Optional[Loan]:
        return self._repo.get_by_id(loan_id)

    def add_loan(self, loan: Loan) -> Loan:
        return self._repo.add(loan)
