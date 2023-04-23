package uk.ac.bham.teamproject.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;
import uk.ac.bham.teamproject.domain.Expenses;
import uk.ac.bham.teamproject.repository.ExpensesRepository;
import uk.ac.bham.teamproject.security.SecurityUtils;
import uk.ac.bham.teamproject.web.rest.errors.BadRequestAlertException;

/**
 * REST controller for managing {@link uk.ac.bham.teamproject.domain.Expenses}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class ExpensesResource {

    private final Logger log = LoggerFactory.getLogger(ExpensesResource.class);

    private static final String ENTITY_NAME = "expenses";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ExpensesRepository expensesRepository;

    public ExpensesResource(ExpensesRepository expensesRepository) {
        this.expensesRepository = expensesRepository;
    }

    /**
     * {@code POST  /expenses} : Create a new expenses.
     *
     * @param expenses the expenses to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new expenses, or with status {@code 400 (Bad Request)} if the expenses has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/expenses")
    public ResponseEntity<Expenses> createExpenses(@Valid @RequestBody Expenses expenses) throws URISyntaxException {
        log.debug("REST request to save Expenses : {}", expenses);
        if (expenses.getId() != null) {
            throw new BadRequestAlertException("A new expenses cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Expenses result = expensesRepository.save(expenses);
        return ResponseEntity
            .created(new URI("/api/expenses/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /expenses/:id} : Updates an existing expenses.
     *
     * @param id the id of the expenses to save.
     * @param expenses the expenses to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated expenses,
     * or with status {@code 400 (Bad Request)} if the expenses is not valid,
     * or with status {@code 500 (Internal Server Error)} if the expenses couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/expenses/{id}")
    public ResponseEntity<Expenses> updateExpenses(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody Expenses expenses
    ) throws URISyntaxException {
        log.debug("REST request to update Expenses : {}, {}", id, expenses);
        if (expenses.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, expenses.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!expensesRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Expenses result = expensesRepository.save(expenses);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, expenses.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /expenses/:id} : Partial updates given fields of an existing expenses, field will ignore if it is null
     *
     * @param id the id of the expenses to save.
     * @param expenses the expenses to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated expenses,
     * or with status {@code 400 (Bad Request)} if the expenses is not valid,
     * or with status {@code 404 (Not Found)} if the expenses is not found,
     * or with status {@code 500 (Internal Server Error)} if the expenses couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/expenses/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Expenses> partialUpdateExpenses(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Expenses expenses
    ) throws URISyntaxException {
        log.debug("REST request to partial update Expenses partially : {}, {}", id, expenses);
        if (expenses.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, expenses.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!expensesRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Expenses> result = expensesRepository
            .findById(expenses.getId())
            .map(existingExpenses -> {
                if (expenses.getExpenseType() != null) {
                    existingExpenses.setExpenseType(expenses.getExpenseType());
                }
                if (expenses.getAmount() != null) {
                    existingExpenses.setAmount(expenses.getAmount());
                }
                if (expenses.getDescription() != null) {
                    existingExpenses.setDescription(expenses.getDescription());
                }
                if (expenses.getDate() != null) {
                    existingExpenses.setDate(expenses.getDate());
                }

                return existingExpenses;
            })
            .map(expensesRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, expenses.getId().toString())
        );
    }

    /**
     * {@code GET  /expenses} : get all the expenses.
     *
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of expenses in body.
     */
    @GetMapping("/expenses")
    public List<Expenses> getAllExpenses(@RequestParam(required = false, defaultValue = "false") boolean eagerload) {
        log.debug("REST request to get all Expenses");

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();

        if (eagerload) {
            log.debug("REST request in IF");

            log.debug("user " + userDetails.getUsername());
            return expensesRepository.findAllWithEagerRelationships(userDetails);
        } else {
            log.debug("REST request in else");
            return expensesRepository.findExpensesByCurrentUser(userDetails);
        }
    }

    /**
     * {@code GET  /expenses/:id} : get the "id" expenses.
     *
     * @param id the id of the expenses to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the expenses, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/expenses/{id}")
    public ResponseEntity<Expenses> getExpenses(@PathVariable Long id) {
        log.debug("REST request to get Expenses : {}", id);
        Optional<Expenses> expenses = expensesRepository.findOneWithEagerRelationships(id);
        return ResponseUtil.wrapOrNotFound(expenses);
    }

    /**
     * {@code DELETE  /expenses/:id} : delete the "id" expenses.
     *
     * @param id the id of the expenses to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/expenses/{id}")
    public ResponseEntity<Void> deleteExpenses(@PathVariable Long id) {
        log.debug("REST request to delete Expenses : {}", id);
        expensesRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
