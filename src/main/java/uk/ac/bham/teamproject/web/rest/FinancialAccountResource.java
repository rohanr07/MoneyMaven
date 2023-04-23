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
import uk.ac.bham.teamproject.domain.FinancialAccount;
import uk.ac.bham.teamproject.repository.FinancialAccountRepository;
import uk.ac.bham.teamproject.web.rest.errors.BadRequestAlertException;

/**
 * REST controller for managing {@link uk.ac.bham.teamproject.domain.FinancialAccount}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class FinancialAccountResource {

    private final Logger log = LoggerFactory.getLogger(FinancialAccountResource.class);

    private static final String ENTITY_NAME = "financialAccount";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final FinancialAccountRepository financialAccountRepository;

    public FinancialAccountResource(FinancialAccountRepository financialAccountRepository) {
        this.financialAccountRepository = financialAccountRepository;
    }

    /**
     * {@code POST  /financial-accounts} : Create a new financialAccount.
     *
     * @param financialAccount the financialAccount to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new financialAccount, or with status {@code 400 (Bad Request)} if the financialAccount has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/financial-accounts")
    public ResponseEntity<FinancialAccount> createFinancialAccount(@Valid @RequestBody FinancialAccount financialAccount)
        throws URISyntaxException {
        log.debug("REST request to save FinancialAccount : {}", financialAccount);
        if (financialAccount.getId() != null) {
            throw new BadRequestAlertException("A new financialAccount cannot already have an ID", ENTITY_NAME, "idexists");
        }
        FinancialAccount result = financialAccountRepository.save(financialAccount);
        return ResponseEntity
            .created(new URI("/api/financial-accounts/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /financial-accounts/:id} : Updates an existing financialAccount.
     *
     * @param id the id of the financialAccount to save.
     * @param financialAccount the financialAccount to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated financialAccount,
     * or with status {@code 400 (Bad Request)} if the financialAccount is not valid,
     * or with status {@code 500 (Internal Server Error)} if the financialAccount couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/financial-accounts/{id}")
    public ResponseEntity<FinancialAccount> updateFinancialAccount(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody FinancialAccount financialAccount
    ) throws URISyntaxException {
        log.debug("REST request to update FinancialAccount : {}, {}", id, financialAccount);
        if (financialAccount.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, financialAccount.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!financialAccountRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        FinancialAccount result = financialAccountRepository.save(financialAccount);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, financialAccount.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /financial-accounts/:id} : Partial updates given fields of an existing financialAccount, field will ignore if it is null
     *
     * @param id the id of the financialAccount to save.
     * @param financialAccount the financialAccount to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated financialAccount,
     * or with status {@code 400 (Bad Request)} if the financialAccount is not valid,
     * or with status {@code 404 (Not Found)} if the financialAccount is not found,
     * or with status {@code 500 (Internal Server Error)} if the financialAccount couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/financial-accounts/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<FinancialAccount> partialUpdateFinancialAccount(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody FinancialAccount financialAccount
    ) throws URISyntaxException {
        log.debug("REST request to partial update FinancialAccount partially : {}, {}", id, financialAccount);
        if (financialAccount.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, financialAccount.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!financialAccountRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<FinancialAccount> result = financialAccountRepository
            .findById(financialAccount.getId())
            .map(existingFinancialAccount -> {
                if (financialAccount.getName() != null) {
                    existingFinancialAccount.setName(financialAccount.getName());
                }
                if (financialAccount.getBalance() != null) {
                    existingFinancialAccount.setBalance(financialAccount.getBalance());
                }
                if (financialAccount.getType() != null) {
                    existingFinancialAccount.setType(financialAccount.getType());
                }
                if (financialAccount.getDescription() != null) {
                    existingFinancialAccount.setDescription(financialAccount.getDescription());
                }

                return existingFinancialAccount;
            })
            .map(financialAccountRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, financialAccount.getId().toString())
        );
    }

    /**
     * {@code GET  /financial-accounts} : get all the financialAccounts.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of financialAccounts in body.
     */
    @GetMapping("/financial-accounts")
    public List<FinancialAccount> getAllFinancialAccounts() {
        log.debug("REST request to get all FinancialAccounts");
        return financialAccountRepository.findAll();
    }

    /**
     * {@code GET  /financial-accounts/:id} : get the "id" financialAccount.
     *
     * @param id the id of the financialAccount to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the financialAccount, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/financial-accounts/{id}")
    public ResponseEntity<FinancialAccount> getFinancialAccount(@PathVariable Long id) {
        log.debug("REST request to get FinancialAccount : {}", id);
        Optional<FinancialAccount> financialAccount = financialAccountRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(financialAccount);
    }

    /**
     * {@code DELETE  /financial-accounts/:id} : delete the "id" financialAccount.
     *
     * @param id the id of the financialAccount to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/financial-accounts/{id}")
    public ResponseEntity<Void> deleteFinancialAccount(@PathVariable Long id) {
        log.debug("REST request to delete FinancialAccount : {}", id);
        financialAccountRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
