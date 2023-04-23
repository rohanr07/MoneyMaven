package uk.ac.bham.teamproject.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

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
import uk.ac.bham.teamproject.domain.FinancialAccount;
import uk.ac.bham.teamproject.domain.enumeration.AccountType;
import uk.ac.bham.teamproject.repository.FinancialAccountRepository;

/**
 * Integration tests for the {@link FinancialAccountResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class FinancialAccountResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final Double DEFAULT_BALANCE = 1D;
    private static final Double UPDATED_BALANCE = 2D;

    private static final AccountType DEFAULT_TYPE = AccountType.CASH;
    private static final AccountType UPDATED_TYPE = AccountType.CHECKING;

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/financial-accounts";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private FinancialAccountRepository financialAccountRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restFinancialAccountMockMvc;

    private FinancialAccount financialAccount;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static FinancialAccount createEntity(EntityManager em) {
        FinancialAccount financialAccount = new FinancialAccount()
            .name(DEFAULT_NAME)
            .balance(DEFAULT_BALANCE)
            .type(DEFAULT_TYPE)
            .description(DEFAULT_DESCRIPTION);
        return financialAccount;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static FinancialAccount createUpdatedEntity(EntityManager em) {
        FinancialAccount financialAccount = new FinancialAccount()
            .name(UPDATED_NAME)
            .balance(UPDATED_BALANCE)
            .type(UPDATED_TYPE)
            .description(UPDATED_DESCRIPTION);
        return financialAccount;
    }

    @BeforeEach
    public void initTest() {
        financialAccount = createEntity(em);
    }

    @Test
    @Transactional
    void createFinancialAccount() throws Exception {
        int databaseSizeBeforeCreate = financialAccountRepository.findAll().size();
        // Create the FinancialAccount
        restFinancialAccountMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(financialAccount))
            )
            .andExpect(status().isCreated());

        // Validate the FinancialAccount in the database
        List<FinancialAccount> financialAccountList = financialAccountRepository.findAll();
        assertThat(financialAccountList).hasSize(databaseSizeBeforeCreate + 1);
        FinancialAccount testFinancialAccount = financialAccountList.get(financialAccountList.size() - 1);
        assertThat(testFinancialAccount.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testFinancialAccount.getBalance()).isEqualTo(DEFAULT_BALANCE);
        assertThat(testFinancialAccount.getType()).isEqualTo(DEFAULT_TYPE);
        assertThat(testFinancialAccount.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
    }

    @Test
    @Transactional
    void createFinancialAccountWithExistingId() throws Exception {
        // Create the FinancialAccount with an existing ID
        financialAccount.setId(1L);

        int databaseSizeBeforeCreate = financialAccountRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restFinancialAccountMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(financialAccount))
            )
            .andExpect(status().isBadRequest());

        // Validate the FinancialAccount in the database
        List<FinancialAccount> financialAccountList = financialAccountRepository.findAll();
        assertThat(financialAccountList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = financialAccountRepository.findAll().size();
        // set the field null
        financialAccount.setName(null);

        // Create the FinancialAccount, which fails.

        restFinancialAccountMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(financialAccount))
            )
            .andExpect(status().isBadRequest());

        List<FinancialAccount> financialAccountList = financialAccountRepository.findAll();
        assertThat(financialAccountList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkBalanceIsRequired() throws Exception {
        int databaseSizeBeforeTest = financialAccountRepository.findAll().size();
        // set the field null
        financialAccount.setBalance(null);

        // Create the FinancialAccount, which fails.

        restFinancialAccountMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(financialAccount))
            )
            .andExpect(status().isBadRequest());

        List<FinancialAccount> financialAccountList = financialAccountRepository.findAll();
        assertThat(financialAccountList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkTypeIsRequired() throws Exception {
        int databaseSizeBeforeTest = financialAccountRepository.findAll().size();
        // set the field null
        financialAccount.setType(null);

        // Create the FinancialAccount, which fails.

        restFinancialAccountMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(financialAccount))
            )
            .andExpect(status().isBadRequest());

        List<FinancialAccount> financialAccountList = financialAccountRepository.findAll();
        assertThat(financialAccountList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllFinancialAccounts() throws Exception {
        // Initialize the database
        financialAccountRepository.saveAndFlush(financialAccount);

        // Get all the financialAccountList
        restFinancialAccountMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(financialAccount.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].balance").value(hasItem(DEFAULT_BALANCE.doubleValue())))
            .andExpect(jsonPath("$.[*].type").value(hasItem(DEFAULT_TYPE.toString())))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION)));
    }

    @Test
    @Transactional
    void getFinancialAccount() throws Exception {
        // Initialize the database
        financialAccountRepository.saveAndFlush(financialAccount);

        // Get the financialAccount
        restFinancialAccountMockMvc
            .perform(get(ENTITY_API_URL_ID, financialAccount.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(financialAccount.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.balance").value(DEFAULT_BALANCE.doubleValue()))
            .andExpect(jsonPath("$.type").value(DEFAULT_TYPE.toString()))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION));
    }

    @Test
    @Transactional
    void getNonExistingFinancialAccount() throws Exception {
        // Get the financialAccount
        restFinancialAccountMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingFinancialAccount() throws Exception {
        // Initialize the database
        financialAccountRepository.saveAndFlush(financialAccount);

        int databaseSizeBeforeUpdate = financialAccountRepository.findAll().size();

        // Update the financialAccount
        FinancialAccount updatedFinancialAccount = financialAccountRepository.findById(financialAccount.getId()).get();
        // Disconnect from session so that the updates on updatedFinancialAccount are not directly saved in db
        em.detach(updatedFinancialAccount);
        updatedFinancialAccount.name(UPDATED_NAME).balance(UPDATED_BALANCE).type(UPDATED_TYPE).description(UPDATED_DESCRIPTION);

        restFinancialAccountMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedFinancialAccount.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedFinancialAccount))
            )
            .andExpect(status().isOk());

        // Validate the FinancialAccount in the database
        List<FinancialAccount> financialAccountList = financialAccountRepository.findAll();
        assertThat(financialAccountList).hasSize(databaseSizeBeforeUpdate);
        FinancialAccount testFinancialAccount = financialAccountList.get(financialAccountList.size() - 1);
        assertThat(testFinancialAccount.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testFinancialAccount.getBalance()).isEqualTo(UPDATED_BALANCE);
        assertThat(testFinancialAccount.getType()).isEqualTo(UPDATED_TYPE);
        assertThat(testFinancialAccount.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
    }

    @Test
    @Transactional
    void putNonExistingFinancialAccount() throws Exception {
        int databaseSizeBeforeUpdate = financialAccountRepository.findAll().size();
        financialAccount.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restFinancialAccountMockMvc
            .perform(
                put(ENTITY_API_URL_ID, financialAccount.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(financialAccount))
            )
            .andExpect(status().isBadRequest());

        // Validate the FinancialAccount in the database
        List<FinancialAccount> financialAccountList = financialAccountRepository.findAll();
        assertThat(financialAccountList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchFinancialAccount() throws Exception {
        int databaseSizeBeforeUpdate = financialAccountRepository.findAll().size();
        financialAccount.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restFinancialAccountMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(financialAccount))
            )
            .andExpect(status().isBadRequest());

        // Validate the FinancialAccount in the database
        List<FinancialAccount> financialAccountList = financialAccountRepository.findAll();
        assertThat(financialAccountList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamFinancialAccount() throws Exception {
        int databaseSizeBeforeUpdate = financialAccountRepository.findAll().size();
        financialAccount.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restFinancialAccountMockMvc
            .perform(
                put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(financialAccount))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the FinancialAccount in the database
        List<FinancialAccount> financialAccountList = financialAccountRepository.findAll();
        assertThat(financialAccountList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateFinancialAccountWithPatch() throws Exception {
        // Initialize the database
        financialAccountRepository.saveAndFlush(financialAccount);

        int databaseSizeBeforeUpdate = financialAccountRepository.findAll().size();

        // Update the financialAccount using partial update
        FinancialAccount partialUpdatedFinancialAccount = new FinancialAccount();
        partialUpdatedFinancialAccount.setId(financialAccount.getId());

        partialUpdatedFinancialAccount.name(UPDATED_NAME).description(UPDATED_DESCRIPTION);

        restFinancialAccountMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedFinancialAccount.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedFinancialAccount))
            )
            .andExpect(status().isOk());

        // Validate the FinancialAccount in the database
        List<FinancialAccount> financialAccountList = financialAccountRepository.findAll();
        assertThat(financialAccountList).hasSize(databaseSizeBeforeUpdate);
        FinancialAccount testFinancialAccount = financialAccountList.get(financialAccountList.size() - 1);
        assertThat(testFinancialAccount.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testFinancialAccount.getBalance()).isEqualTo(DEFAULT_BALANCE);
        assertThat(testFinancialAccount.getType()).isEqualTo(DEFAULT_TYPE);
        assertThat(testFinancialAccount.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
    }

    @Test
    @Transactional
    void fullUpdateFinancialAccountWithPatch() throws Exception {
        // Initialize the database
        financialAccountRepository.saveAndFlush(financialAccount);

        int databaseSizeBeforeUpdate = financialAccountRepository.findAll().size();

        // Update the financialAccount using partial update
        FinancialAccount partialUpdatedFinancialAccount = new FinancialAccount();
        partialUpdatedFinancialAccount.setId(financialAccount.getId());

        partialUpdatedFinancialAccount.name(UPDATED_NAME).balance(UPDATED_BALANCE).type(UPDATED_TYPE).description(UPDATED_DESCRIPTION);

        restFinancialAccountMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedFinancialAccount.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedFinancialAccount))
            )
            .andExpect(status().isOk());

        // Validate the FinancialAccount in the database
        List<FinancialAccount> financialAccountList = financialAccountRepository.findAll();
        assertThat(financialAccountList).hasSize(databaseSizeBeforeUpdate);
        FinancialAccount testFinancialAccount = financialAccountList.get(financialAccountList.size() - 1);
        assertThat(testFinancialAccount.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testFinancialAccount.getBalance()).isEqualTo(UPDATED_BALANCE);
        assertThat(testFinancialAccount.getType()).isEqualTo(UPDATED_TYPE);
        assertThat(testFinancialAccount.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
    }

    @Test
    @Transactional
    void patchNonExistingFinancialAccount() throws Exception {
        int databaseSizeBeforeUpdate = financialAccountRepository.findAll().size();
        financialAccount.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restFinancialAccountMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, financialAccount.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(financialAccount))
            )
            .andExpect(status().isBadRequest());

        // Validate the FinancialAccount in the database
        List<FinancialAccount> financialAccountList = financialAccountRepository.findAll();
        assertThat(financialAccountList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchFinancialAccount() throws Exception {
        int databaseSizeBeforeUpdate = financialAccountRepository.findAll().size();
        financialAccount.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restFinancialAccountMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(financialAccount))
            )
            .andExpect(status().isBadRequest());

        // Validate the FinancialAccount in the database
        List<FinancialAccount> financialAccountList = financialAccountRepository.findAll();
        assertThat(financialAccountList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamFinancialAccount() throws Exception {
        int databaseSizeBeforeUpdate = financialAccountRepository.findAll().size();
        financialAccount.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restFinancialAccountMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(financialAccount))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the FinancialAccount in the database
        List<FinancialAccount> financialAccountList = financialAccountRepository.findAll();
        assertThat(financialAccountList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteFinancialAccount() throws Exception {
        // Initialize the database
        financialAccountRepository.saveAndFlush(financialAccount);

        int databaseSizeBeforeDelete = financialAccountRepository.findAll().size();

        // Delete the financialAccount
        restFinancialAccountMockMvc
            .perform(delete(ENTITY_API_URL_ID, financialAccount.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<FinancialAccount> financialAccountList = financialAccountRepository.findAll();
        assertThat(financialAccountList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
