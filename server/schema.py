from typing import List, Optional
import strawberry

from models import Loan, LoanFilter
from repositories import InMemoryRepository
from services import LoanService
from seed import loans

loan_service = LoanService(repo=InMemoryRepository[Loan](initial_items=loans))


@strawberry.type
class Query:

    @strawberry.field
    def loans(self, cursor: Optional[int] = None, limit: Optional[int] = None, filter: Optional[LoanFilter] = None) -> List[Loan]:
        return loan_service.get_loans(cursor, limit, filter)


schema = strawberry.Schema(query=Query)
