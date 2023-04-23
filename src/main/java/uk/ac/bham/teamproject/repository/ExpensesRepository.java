package uk.ac.bham.teamproject.repository;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors; // added by JR
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.security.core.annotation.AuthenticationPrincipal; //added by JR
import org.springframework.security.core.userdetails.UserDetails; //added by JR
import org.springframework.stereotype.Repository;
import uk.ac.bham.teamproject.domain.Expenses;

/**
 * Spring Data JPA repository for the Expenses entity.
 */
@Repository
public interface ExpensesRepository extends JpaRepository<Expenses, Long> {
    default List<Expenses> findExpensesByCurrentUser(@AuthenticationPrincipal UserDetails userDetails) {
        String currentUserName = userDetails.getUsername();
        return this.findAll()
            .stream()
            .filter(expense -> (expense.getUser() == null) || expense.getUser().getLogin().equals(currentUserName))
            .collect(Collectors.toList());
    }

    default Optional<Expenses> findOneWithEagerRelationships(Long id) {
        return this.findOneWithToOneRelationships(id);
    }

    default List<Expenses> findAllWithEagerRelationships(@AuthenticationPrincipal UserDetails userDetails) {
        String currentUserName = userDetails.getUsername();
        return this.findAllWithToOneRelationships()
            .stream()
            .filter(expense -> (expense.getUser() == null) || expense.getUser().getLogin().equals(currentUserName))
            .collect(Collectors.toList());
    }

    default Page<Expenses> findAllWithEagerRelationships(Pageable pageable) {
        return this.findAllWithToOneRelationships(pageable);
    }

    @Query(
        value = "select distinct expenses from Expenses expenses left join fetch expenses.user",
        countQuery = "select count(distinct expenses) from Expenses expenses"
    )
    Page<Expenses> findAllWithToOneRelationships(Pageable pageable);

    @Query("select distinct expenses from Expenses expenses left join fetch expenses.user")
    List<Expenses> findAllWithToOneRelationships();

    @Query("select expenses from Expenses expenses left join fetch expenses.user where expenses.id =:id")
    Optional<Expenses> findOneWithToOneRelationships(@Param("id") Long id);
}
