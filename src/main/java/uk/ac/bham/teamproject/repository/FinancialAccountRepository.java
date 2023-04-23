package uk.ac.bham.teamproject.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import uk.ac.bham.teamproject.domain.FinancialAccount;

/**
 * Spring Data JPA repository for the FinancialAccount entity.
 */
@SuppressWarnings("unused")
@Repository
public interface FinancialAccountRepository extends JpaRepository<FinancialAccount, Long> {}
