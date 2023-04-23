package uk.ac.bham.teamproject.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import uk.ac.bham.teamproject.domain.FinancialTransaction;

/**
 * Spring Data JPA repository for the FinancialTransaction entity.
 */
@SuppressWarnings("unused")
@Repository
public interface FinancialTransactionRepository extends JpaRepository<FinancialTransaction, Long> {}
