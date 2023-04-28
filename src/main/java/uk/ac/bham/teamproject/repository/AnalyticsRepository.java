package uk.ac.bham.teamproject.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import uk.ac.bham.teamproject.domain.Analytics;

/**
 * Spring Data JPA repository for the Analytics entity.
 */
@Repository
public interface AnalyticsRepository extends JpaRepository<Analytics, Long> {
    @Query("select analytics from Analytics analytics where analytics.user.login = ?#{principal.username}")
    List<Analytics> findByUserIsCurrentUser();

    default Optional<Analytics> findOneWithEagerRelationships(Long id) {
        return this.findOneWithToOneRelationships(id);
    }

    default List<Analytics> findAllWithEagerRelationships() {
        return this.findAllWithToOneRelationships();
    }

    default Page<Analytics> findAllWithEagerRelationships(Pageable pageable) {
        return this.findAllWithToOneRelationships(pageable);
    }

    @Query(
        value = "select distinct analytics from Analytics analytics left join fetch analytics.user",
        countQuery = "select count(distinct analytics) from Analytics analytics"
    )
    Page<Analytics> findAllWithToOneRelationships(Pageable pageable);

    @Query("select distinct analytics from Analytics analytics left join fetch analytics.user")
    List<Analytics> findAllWithToOneRelationships();

    @Query("select analytics from Analytics analytics left join fetch analytics.user where analytics.id =:id")
    Optional<Analytics> findOneWithToOneRelationships(@Param("id") Long id);
}
