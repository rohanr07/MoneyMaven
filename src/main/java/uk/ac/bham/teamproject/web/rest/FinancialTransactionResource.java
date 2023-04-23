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
import uk.ac.bham.teamproject.domain.FinancialTransaction;
import uk.ac.bham.teamproject.repository.FinancialTransactionRepository;
import uk.ac.bham.teamproject.web.rest.errors.BadRequestAlertException;

/**
 * REST controller for managing {@link uk.ac.bham.teamproject.domain.FinancialTransaction}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class FinancialTransactionResource {

    private final Logger log = LoggerFactory.getLogger(FinancialTransactionResource.class);

    private static final String ENTITY_NAME = "financialTransaction";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final FinancialTransactionRepository financialTransactionRepository;

    public FinancialTransactionResource(FinancialTransactionRepository financialTransactionRepository) {
        this.financialTransactionRepository = financialTransactionRepository;
    }

    /**
     * {@code POST  /financial-transactions} : Create a new financialTransaction.
     *
     * @param financialTransaction the financialTransaction to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new financialTransaction, or with status {@code 400 (Bad Request)} if the financialTransaction has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/financial-transactions")
    public ResponseEntity<FinancialTransaction> createFinancialTransaction(@Valid @RequestBody FinancialTransaction financialTransaction)
        throws URISyntaxException {
        log.debug("REST request to save FinancialTransaction : {}", financialTransaction);
        if (financialTransaction.getId() != null) {
            throw new BadRequestAlertException("A new financialTransaction cannot already have an ID", ENTITY_NAME, "idexists");
        }
        FinancialTransaction result = financialTransactionRepository.save(financialTransaction);
        return ResponseEntity
            .created(new URI("/api/financial-transactions/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /financial-transactions/:id} : Updates an existing financialTransaction.
     *
     * @param id the id of the financialTransaction to save.
     * @param financialTransaction the financialTransaction to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated financialTransaction,
     * or with status {@code 400 (Bad Request)} if the financialTransaction is not valid,
     * or with status {@code 500 (Internal Server Error)} if the financialTransaction couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/financial-transactions/{id}")
    public ResponseEntity<FinancialTransaction> updateFinancialTransaction(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody FinancialTransaction financialTransaction
    ) throws URISyntaxException {
        log.debug("REST request to update FinancialTransaction : {}, {}", id, financialTransaction);
        if (financialTransaction.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, financialTransaction.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!financialTransactionRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        FinancialTransaction result = financialTransactionRepository.save(financialTransaction);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, financialTransaction.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /financial-transactions/:id} : Partial updates given fields of an existing financialTransaction, field will ignore if it is null
     *
     * @param id the id of the financialTransaction to save.
     * @param financialTransaction the financialTransaction to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated financialTransaction,
     * or with status {@code 400 (Bad Request)} if the financialTransaction is not valid,
     * or with status {@code 404 (Not Found)} if the financialTransaction is not found,
     * or with status {@code 500 (Internal Server Error)} if the financialTransaction couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/financial-transactions/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<FinancialTransaction> partialUpdateFinancialTransaction(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody FinancialTransaction financialTransaction
    ) throws URISyntaxException {
        log.debug("REST request to partial update FinancialTransaction partially : {}, {}", id, financialTransaction);
        if (financialTransaction.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, financialTransaction.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!financialTransactionRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<FinancialTransaction> result = financialTransactionRepository
            .findById(financialTransaction.getId())
            .map(existingFinancialTransaction -> {
                if (financialTransaction.getDescription() != null) {
                    existingFinancialTransaction.setDescription(financialTransaction.getDescription());
                }
                if (financialTransaction.getAmount() != null) {
                    existingFinancialTransaction.setAmount(financialTransaction.getAmount());
                }
                if (financialTransaction.getDate() != null) {
                    existingFinancialTransaction.setDate(financialTransaction.getDate());
                }

                return existingFinancialTransaction;
            })
            .map(financialTransactionRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, financialTransaction.getId().toString())
        );
    }

    /**
     * {@code GET  /financial-transactions} : get all the financialTransactions.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of financialTransactions in body.
     */
    @GetMapping("/financial-transactions")
    public List<FinancialTransaction> getAllFinancialTransactions() {
        log.debug("REST request to get all FinancialTransactions");
        return financialTransactionRepository.findAll();
    }

    /**
     * {@code GET  /financial-transactions/:id} : get the "id" financialTransaction.
     *
     * @param id the id of the financialTransaction to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the financialTransaction, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/financial-transactions/{id}")
    public ResponseEntity<FinancialTransaction> getFinancialTransaction(@PathVariable Long id) {
        log.debug("REST request to get FinancialTransaction : {}", id);
        Optional<FinancialTransaction> financialTransaction = financialTransactionRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(financialTransaction);
    }

    /**
     * {@code DELETE  /financial-transactions/:id} : delete the "id" financialTransaction.
     *
     * @param id the id of the financialTransaction to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/financial-transactions/{id}")
    public ResponseEntity<Void> deleteFinancialTransaction(@PathVariable Long id) {
        log.debug("REST request to delete FinancialTransaction : {}", id);
        financialTransactionRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
