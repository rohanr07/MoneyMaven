package uk.ac.bham.teamproject.repository;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Repository;
import uk.ac.bham.teamproject.domain.Expenses;
import uk.ac.bham.teamproject.domain.Income;

/**
 * Spring Data JPA repository for the Income entity.
 */
@Repository
public interface IncomeRepository extends JpaRepository<Income, Long> {
    // added by Rohan
    default List<Income> findIncomeByCurrentUser(@AuthenticationPrincipal UserDetails userDetails) {
        String currentUserName = userDetails.getUsername();
        return this.findAll()
            .stream()
            .filter(income -> (income.getUser() == null) || income.getUser().getLogin().equals(currentUserName))
            .collect(Collectors.toList());
    }

    @Query("select income from Income income where income.user.login = ?#{principal.username}")
    List<Income> findByUserIsCurrentUser();

    default Optional<Income> findOneWithEagerRelationships(Long id) {
        return this.findOneWithToOneRelationships(id);
    }

    default List<Income> findAllWithEagerRelationships(@AuthenticationPrincipal UserDetails userDetails) {
        // added by Rohan
        String currentUserName = userDetails.getUsername();
        return this.findAllWithToOneRelationships()
            .stream()
            .filter(income -> (income.getUser() == null) || income.getUser().getLogin().equals(currentUserName))
            .collect(Collectors.toList());
    }

    default Page<Income> findAllWithEagerRelationships(Pageable pageable) {
        return this.findAllWithToOneRelationships(pageable);
    }

    @Query(
        value = "select distinct income from Income income left join fetch income.user",
        countQuery = "select count(distinct income) from Income income"
    )
    Page<Income> findAllWithToOneRelationships(Pageable pageable);

    @Query("select distinct income from Income income left join fetch income.user")
    List<Income> findAllWithToOneRelationships();

    @Query("select income from Income income left join fetch income.user where income.id =:id")
    Optional<Income> findOneWithToOneRelationships(@Param("id") Long id);
}
