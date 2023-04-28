package uk.ac.bham.teamproject.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;
import uk.ac.bham.teamproject.domain.Analytics;
import uk.ac.bham.teamproject.repository.AnalyticsRepository;
import uk.ac.bham.teamproject.web.rest.errors.BadRequestAlertException;

/**
 * REST controller for managing {@link uk.ac.bham.teamproject.domain.Analytics}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class AnalyticsResource {

    private final Logger log = LoggerFactory.getLogger(AnalyticsResource.class);

    private static final String ENTITY_NAME = "analytics";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final AnalyticsRepository analyticsRepository;

    public AnalyticsResource(AnalyticsRepository analyticsRepository) {
        this.analyticsRepository = analyticsRepository;
    }

    /**
     * {@code POST  /analytics} : Create a new analytics.
     *
     * @param analytics the analytics to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new analytics, or with status {@code 400 (Bad Request)} if the analytics has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/analytics")
    public ResponseEntity<Analytics> createAnalytics(@RequestBody Analytics analytics) throws URISyntaxException {
        log.debug("REST request to save Analytics : {}", analytics);
        if (analytics.getId() != null) {
            throw new BadRequestAlertException("A new analytics cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Analytics result = analyticsRepository.save(analytics);
        return ResponseEntity
            .created(new URI("/api/analytics/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /analytics/:id} : Updates an existing analytics.
     *
     * @param id the id of the analytics to save.
     * @param analytics the analytics to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated analytics,
     * or with status {@code 400 (Bad Request)} if the analytics is not valid,
     * or with status {@code 500 (Internal Server Error)} if the analytics couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/analytics/{id}")
    public ResponseEntity<Analytics> updateAnalytics(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Analytics analytics
    ) throws URISyntaxException {
        log.debug("REST request to update Analytics : {}, {}", id, analytics);
        if (analytics.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, analytics.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!analyticsRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Analytics result = analyticsRepository.save(analytics);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, analytics.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /analytics/:id} : Partial updates given fields of an existing analytics, field will ignore if it is null
     *
     * @param id the id of the analytics to save.
     * @param analytics the analytics to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated analytics,
     * or with status {@code 400 (Bad Request)} if the analytics is not valid,
     * or with status {@code 404 (Not Found)} if the analytics is not found,
     * or with status {@code 500 (Internal Server Error)} if the analytics couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/analytics/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Analytics> partialUpdateAnalytics(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Analytics analytics
    ) throws URISyntaxException {
        log.debug("REST request to partial update Analytics partially : {}, {}", id, analytics);
        if (analytics.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, analytics.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!analyticsRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Analytics> result = analyticsRepository
            .findById(analytics.getId())
            .map(existingAnalytics -> {
                if (analytics.getTransaction() != null) {
                    existingAnalytics.setTransaction(analytics.getTransaction());
                }
                if (analytics.getAmount() != null) {
                    existingAnalytics.setAmount(analytics.getAmount());
                }
                if (analytics.getDate() != null) {
                    existingAnalytics.setDate(analytics.getDate());
                }

                return existingAnalytics;
            })
            .map(analyticsRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, analytics.getId().toString())
        );
    }

    /**
     * {@code GET  /analytics} : get all the analytics.
     *
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of analytics in body.
     */
    @GetMapping("/analytics")
    public List<Analytics> getAllAnalytics(@RequestParam(required = false, defaultValue = "false") boolean eagerload) {
        log.debug("REST request to get all Analytics");
        if (eagerload) {
            return analyticsRepository.findAllWithEagerRelationships();
        } else {
            return analyticsRepository.findAll();
        }
    }

    /**
     * {@code GET  /analytics/:id} : get the "id" analytics.
     *
     * @param id the id of the analytics to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the analytics, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/analytics/{id}")
    public ResponseEntity<Analytics> getAnalytics(@PathVariable Long id) {
        log.debug("REST request to get Analytics : {}", id);
        Optional<Analytics> analytics = analyticsRepository.findOneWithEagerRelationships(id);
        return ResponseUtil.wrapOrNotFound(analytics);
    }

    /**
     * {@code DELETE  /analytics/:id} : delete the "id" analytics.
     *
     * @param id the id of the analytics to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/analytics/{id}")
    public ResponseEntity<Void> deleteAnalytics(@PathVariable Long id) {
        log.debug("REST request to delete Analytics : {}", id);
        analyticsRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
