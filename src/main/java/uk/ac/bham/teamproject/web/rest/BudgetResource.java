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
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;
import uk.ac.bham.teamproject.domain.Budget;
import uk.ac.bham.teamproject.repository.BudgetRepository;
import uk.ac.bham.teamproject.web.rest.errors.BadRequestAlertException;

/**
 * REST controller for managing {@link uk.ac.bham.teamproject.domain.Budget}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class BudgetResource {

    private final Logger log = LoggerFactory.getLogger(BudgetResource.class);

    private static final String ENTITY_NAME = "budget";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final BudgetRepository budgetRepository;

    public BudgetResource(BudgetRepository budgetRepository) {
        this.budgetRepository = budgetRepository;
    }

    /**
     * {@code POST  /budgets} : Create a new budget.
     *
     * @param budget the budget to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new budget, or with status {@code 400 (Bad Request)} if the budget has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/budgets")
    public ResponseEntity<Budget> createBudget(@Valid @RequestBody Budget budget) throws URISyntaxException {
        log.debug("REST request to save Budget : {}", budget);
        if (budget.getId() != null) {
            throw new BadRequestAlertException("A new budget cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Budget result = budgetRepository.save(budget);
        return ResponseEntity
            .created(new URI("/api/budgets/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /budgets/:id} : Updates an existing budget.
     *
     * @param id the id of the budget to save.
     * @param budget the budget to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated budget,
     * or with status {@code 400 (Bad Request)} if the budget is not valid,
     * or with status {@code 500 (Internal Server Error)} if the budget couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/budgets/{id}")
    public ResponseEntity<Budget> updateBudget(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody Budget budget
    ) throws URISyntaxException {
        log.debug("REST request to update Budget : {}, {}", id, budget);
        if (budget.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, budget.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!budgetRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Budget result = budgetRepository.save(budget);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, budget.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /budgets/:id} : Partial updates given fields of an existing budget, field will ignore if it is null
     *
     * @param id the id of the budget to save.
     * @param budget the budget to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated budget,
     * or with status {@code 400 (Bad Request)} if the budget is not valid,
     * or with status {@code 404 (Not Found)} if the budget is not found,
     * or with status {@code 500 (Internal Server Error)} if the budget couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/budgets/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Budget> partialUpdateBudget(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Budget budget
    ) throws URISyntaxException {
        log.debug("REST request to partial update Budget partially : {}, {}", id, budget);
        if (budget.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, budget.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!budgetRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Budget> result = budgetRepository
            .findById(budget.getId())
            .map(existingBudget -> {
                if (budget.getBudgetId() != null) {
                    existingBudget.setBudgetId(budget.getBudgetId());
                }
                if (budget.getMonthOfTheTime() != null) {
                    existingBudget.setMonthOfTheTime(budget.getMonthOfTheTime());
                }
                if (budget.getTotalBudget() != null) {
                    existingBudget.setTotalBudget(budget.getTotalBudget());
                }
                if (budget.getTotalSpent() != null) {
                    existingBudget.setTotalSpent(budget.getTotalSpent());
                }
                if (budget.getAmountRemaining() != null) {
                    existingBudget.setAmountRemaining(budget.getAmountRemaining());
                }

                return existingBudget;
            })
            .map(budgetRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, budget.getId().toString())
        );
    }

    /**
     * {@code GET  /budgets} : get all the budgets.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of budgets in body.
     */
    @GetMapping("/budgets")
    public List<Budget> getAllBudgets() {
        log.debug("REST request to get all Budgets");
        return budgetRepository.findAll();
    }

    /**
     * {@code GET  /budgets/:id} : get the "id" budget.
     *
     * @param id the id of the budget to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the budget, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/budgets/{id}")
    public ResponseEntity<Budget> getBudget(@PathVariable Long id) {
        log.debug("REST request to get Budget : {}", id);
        Optional<Budget> budget = budgetRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(budget);
    }

    /**
     * {@code DELETE  /budgets/:id} : delete the "id" budget.
     *
     * @param id the id of the budget to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/budgets/{id}")
    public ResponseEntity<Void> deleteBudget(@PathVariable Long id) {
        log.debug("REST request to delete Budget : {}", id);
        budgetRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
