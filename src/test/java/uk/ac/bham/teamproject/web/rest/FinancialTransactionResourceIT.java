package uk.ac.bham.teamproject.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import uk.ac.bham.teamproject.IntegrationTest;
import uk.ac.bham.teamproject.domain.FinancialTransaction;
import uk.ac.bham.teamproject.repository.FinancialTransactionRepository;

/**
 * Integration tests for the {@link FinancialTransactionResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class FinancialTransactionResourceIT {

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final Double DEFAULT_AMOUNT = 1D;
    private static final Double UPDATED_AMOUNT = 2D;

    private static final Instant DEFAULT_DATE = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_DATE = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final String ENTITY_API_URL = "/api/financial-transactions";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private FinancialTransactionRepository financialTransactionRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restFinancialTransactionMockMvc;

    private FinancialTransaction financialTransaction;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static FinancialTransaction createEntity(EntityManager em) {
        FinancialTransaction financialTransaction = new FinancialTransaction()
            .description(DEFAULT_DESCRIPTION)
            .amount(DEFAULT_AMOUNT)
            .date(DEFAULT_DATE);
        return financialTransaction;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static FinancialTransaction createUpdatedEntity(EntityManager em) {
        FinancialTransaction financialTransaction = new FinancialTransaction()
            .description(UPDATED_DESCRIPTION)
            .amount(UPDATED_AMOUNT)
            .date(UPDATED_DATE);
        return financialTransaction;
    }

    @BeforeEach
    public void initTest() {
        financialTransaction = createEntity(em);
    }

    @Test
    @Transactional
    void createFinancialTransaction() throws Exception {
        int databaseSizeBeforeCreate = financialTransactionRepository.findAll().size();
        // Create the FinancialTransaction
        restFinancialTransactionMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(financialTransaction))
            )
            .andExpect(status().isCreated());

        // Validate the FinancialTransaction in the database
        List<FinancialTransaction> financialTransactionList = financialTransactionRepository.findAll();
        assertThat(financialTransactionList).hasSize(databaseSizeBeforeCreate + 1);
        FinancialTransaction testFinancialTransaction = financialTransactionList.get(financialTransactionList.size() - 1);
        assertThat(testFinancialTransaction.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testFinancialTransaction.getAmount()).isEqualTo(DEFAULT_AMOUNT);
        assertThat(testFinancialTransaction.getDate()).isEqualTo(DEFAULT_DATE);
    }

    @Test
    @Transactional
    void createFinancialTransactionWithExistingId() throws Exception {
        // Create the FinancialTransaction with an existing ID
        financialTransaction.setId(1L);

        int databaseSizeBeforeCreate = financialTransactionRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restFinancialTransactionMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(financialTransaction))
            )
            .andExpect(status().isBadRequest());

        // Validate the FinancialTransaction in the database
        List<FinancialTransaction> financialTransactionList = financialTransactionRepository.findAll();
        assertThat(financialTransactionList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkDescriptionIsRequired() throws Exception {
        int databaseSizeBeforeTest = financialTransactionRepository.findAll().size();
        // set the field null
        financialTransaction.setDescription(null);

        // Create the FinancialTransaction, which fails.

        restFinancialTransactionMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(financialTransaction))
            )
            .andExpect(status().isBadRequest());

        List<FinancialTransaction> financialTransactionList = financialTransactionRepository.findAll();
        assertThat(financialTransactionList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkAmountIsRequired() throws Exception {
        int databaseSizeBeforeTest = financialTransactionRepository.findAll().size();
        // set the field null
        financialTransaction.setAmount(null);

        // Create the FinancialTransaction, which fails.

        restFinancialTransactionMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(financialTransaction))
            )
            .andExpect(status().isBadRequest());

        List<FinancialTransaction> financialTransactionList = financialTransactionRepository.findAll();
        assertThat(financialTransactionList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkDateIsRequired() throws Exception {
        int databaseSizeBeforeTest = financialTransactionRepository.findAll().size();
        // set the field null
        financialTransaction.setDate(null);

        // Create the FinancialTransaction, which fails.

        restFinancialTransactionMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(financialTransaction))
            )
            .andExpect(status().isBadRequest());

        List<FinancialTransaction> financialTransactionList = financialTransactionRepository.findAll();
        assertThat(financialTransactionList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllFinancialTransactions() throws Exception {
        // Initialize the database
        financialTransactionRepository.saveAndFlush(financialTransaction);

        // Get all the financialTransactionList
        restFinancialTransactionMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(financialTransaction.getId().intValue())))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION)))
            .andExpect(jsonPath("$.[*].amount").value(hasItem(DEFAULT_AMOUNT.doubleValue())))
            .andExpect(jsonPath("$.[*].date").value(hasItem(DEFAULT_DATE.toString())));
    }

    @Test
    @Transactional
    void getFinancialTransaction() throws Exception {
        // Initialize the database
        financialTransactionRepository.saveAndFlush(financialTransaction);

        // Get the financialTransaction
        restFinancialTransactionMockMvc
            .perform(get(ENTITY_API_URL_ID, financialTransaction.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(financialTransaction.getId().intValue()))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION))
            .andExpect(jsonPath("$.amount").value(DEFAULT_AMOUNT.doubleValue()))
            .andExpect(jsonPath("$.date").value(DEFAULT_DATE.toString()));
    }

    @Test
    @Transactional
    void getNonExistingFinancialTransaction() throws Exception {
        // Get the financialTransaction
        restFinancialTransactionMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingFinancialTransaction() throws Exception {
        // Initialize the database
        financialTransactionRepository.saveAndFlush(financialTransaction);

        int databaseSizeBeforeUpdate = financialTransactionRepository.findAll().size();

        // Update the financialTransaction
        FinancialTransaction updatedFinancialTransaction = financialTransactionRepository.findById(financialTransaction.getId()).get();
        // Disconnect from session so that the updates on updatedFinancialTransaction are not directly saved in db
        em.detach(updatedFinancialTransaction);
        updatedFinancialTransaction.description(UPDATED_DESCRIPTION).amount(UPDATED_AMOUNT).date(UPDATED_DATE);

        restFinancialTransactionMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedFinancialTransaction.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedFinancialTransaction))
            )
            .andExpect(status().isOk());

        // Validate the FinancialTransaction in the database
        List<FinancialTransaction> financialTransactionList = financialTransactionRepository.findAll();
        assertThat(financialTransactionList).hasSize(databaseSizeBeforeUpdate);
        FinancialTransaction testFinancialTransaction = financialTransactionList.get(financialTransactionList.size() - 1);
        assertThat(testFinancialTransaction.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testFinancialTransaction.getAmount()).isEqualTo(UPDATED_AMOUNT);
        assertThat(testFinancialTransaction.getDate()).isEqualTo(UPDATED_DATE);
    }

    @Test
    @Transactional
    void putNonExistingFinancialTransaction() throws Exception {
        int databaseSizeBeforeUpdate = financialTransactionRepository.findAll().size();
        financialTransaction.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restFinancialTransactionMockMvc
            .perform(
                put(ENTITY_API_URL_ID, financialTransaction.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(financialTransaction))
            )
            .andExpect(status().isBadRequest());

        // Validate the FinancialTransaction in the database
        List<FinancialTransaction> financialTransactionList = financialTransactionRepository.findAll();
        assertThat(financialTransactionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchFinancialTransaction() throws Exception {
        int databaseSizeBeforeUpdate = financialTransactionRepository.findAll().size();
        financialTransaction.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restFinancialTransactionMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(financialTransaction))
            )
            .andExpect(status().isBadRequest());

        // Validate the FinancialTransaction in the database
        List<FinancialTransaction> financialTransactionList = financialTransactionRepository.findAll();
        assertThat(financialTransactionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamFinancialTransaction() throws Exception {
        int databaseSizeBeforeUpdate = financialTransactionRepository.findAll().size();
        financialTransaction.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restFinancialTransactionMockMvc
            .perform(
                put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(financialTransaction))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the FinancialTransaction in the database
        List<FinancialTransaction> financialTransactionList = financialTransactionRepository.findAll();
        assertThat(financialTransactionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateFinancialTransactionWithPatch() throws Exception {
        // Initialize the database
        financialTransactionRepository.saveAndFlush(financialTransaction);

        int databaseSizeBeforeUpdate = financialTransactionRepository.findAll().size();

        // Update the financialTransaction using partial update
        FinancialTransaction partialUpdatedFinancialTransaction = new FinancialTransaction();
        partialUpdatedFinancialTransaction.setId(financialTransaction.getId());

        partialUpdatedFinancialTransaction.amount(UPDATED_AMOUNT);

        restFinancialTransactionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedFinancialTransaction.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedFinancialTransaction))
            )
            .andExpect(status().isOk());

        // Validate the FinancialTransaction in the database
        List<FinancialTransaction> financialTransactionList = financialTransactionRepository.findAll();
        assertThat(financialTransactionList).hasSize(databaseSizeBeforeUpdate);
        FinancialTransaction testFinancialTransaction = financialTransactionList.get(financialTransactionList.size() - 1);
        assertThat(testFinancialTransaction.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testFinancialTransaction.getAmount()).isEqualTo(UPDATED_AMOUNT);
        assertThat(testFinancialTransaction.getDate()).isEqualTo(DEFAULT_DATE);
    }

    @Test
    @Transactional
    void fullUpdateFinancialTransactionWithPatch() throws Exception {
        // Initialize the database
        financialTransactionRepository.saveAndFlush(financialTransaction);

        int databaseSizeBeforeUpdate = financialTransactionRepository.findAll().size();

        // Update the financialTransaction using partial update
        FinancialTransaction partialUpdatedFinancialTransaction = new FinancialTransaction();
        partialUpdatedFinancialTransaction.setId(financialTransaction.getId());

        partialUpdatedFinancialTransaction.description(UPDATED_DESCRIPTION).amount(UPDATED_AMOUNT).date(UPDATED_DATE);

        restFinancialTransactionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedFinancialTransaction.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedFinancialTransaction))
            )
            .andExpect(status().isOk());

        // Validate the FinancialTransaction in the database
        List<FinancialTransaction> financialTransactionList = financialTransactionRepository.findAll();
        assertThat(financialTransactionList).hasSize(databaseSizeBeforeUpdate);
        FinancialTransaction testFinancialTransaction = financialTransactionList.get(financialTransactionList.size() - 1);
        assertThat(testFinancialTransaction.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testFinancialTransaction.getAmount()).isEqualTo(UPDATED_AMOUNT);
        assertThat(testFinancialTransaction.getDate()).isEqualTo(UPDATED_DATE);
    }

    @Test
    @Transactional
    void patchNonExistingFinancialTransaction() throws Exception {
        int databaseSizeBeforeUpdate = financialTransactionRepository.findAll().size();
        financialTransaction.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restFinancialTransactionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, financialTransaction.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(financialTransaction))
            )
            .andExpect(status().isBadRequest());

        // Validate the FinancialTransaction in the database
        List<FinancialTransaction> financialTransactionList = financialTransactionRepository.findAll();
        assertThat(financialTransactionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchFinancialTransaction() throws Exception {
        int databaseSizeBeforeUpdate = financialTransactionRepository.findAll().size();
        financialTransaction.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restFinancialTransactionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(financialTransaction))
            )
            .andExpect(status().isBadRequest());

        // Validate the FinancialTransaction in the database
        List<FinancialTransaction> financialTransactionList = financialTransactionRepository.findAll();
        assertThat(financialTransactionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamFinancialTransaction() throws Exception {
        int databaseSizeBeforeUpdate = financialTransactionRepository.findAll().size();
        financialTransaction.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restFinancialTransactionMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(financialTransaction))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the FinancialTransaction in the database
        List<FinancialTransaction> financialTransactionList = financialTransactionRepository.findAll();
        assertThat(financialTransactionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteFinancialTransaction() throws Exception {
        // Initialize the database
        financialTransactionRepository.saveAndFlush(financialTransaction);

        int databaseSizeBeforeDelete = financialTransactionRepository.findAll().size();

        // Delete the financialTransaction
        restFinancialTransactionMockMvc
            .perform(delete(ENTITY_API_URL_ID, financialTransaction.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<FinancialTransaction> financialTransactionList = financialTransactionRepository.findAll();
        assertThat(financialTransactionList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
