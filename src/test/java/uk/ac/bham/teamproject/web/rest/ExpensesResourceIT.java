package uk.ac.bham.teamproject.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import uk.ac.bham.teamproject.IntegrationTest;
import uk.ac.bham.teamproject.domain.Expenses;
import uk.ac.bham.teamproject.repository.ExpensesRepository;

/**
 * Integration tests for the {@link ExpensesResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class ExpensesResourceIT {

    private static final String DEFAULT_EXPENSE_TYPE = "AAAAAAAAAA";
    private static final String UPDATED_EXPENSE_TYPE = "BBBBBBBBBB";

    private static final Double DEFAULT_AMOUNT = 0D;
    private static final Double UPDATED_AMOUNT = 1D;

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final LocalDate DEFAULT_DATE = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_DATE = LocalDate.now(ZoneId.systemDefault());

    private static final String ENTITY_API_URL = "/api/expenses";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ExpensesRepository expensesRepository;

    @Mock
    private ExpensesRepository expensesRepositoryMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restExpensesMockMvc;

    private Expenses expenses;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Expenses createEntity(EntityManager em) {
        Expenses expenses = new Expenses()
            .expenseType(DEFAULT_EXPENSE_TYPE)
            .amount(DEFAULT_AMOUNT)
            .description(DEFAULT_DESCRIPTION)
            .date(DEFAULT_DATE);
        return expenses;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Expenses createUpdatedEntity(EntityManager em) {
        Expenses expenses = new Expenses()
            .expenseType(UPDATED_EXPENSE_TYPE)
            .amount(UPDATED_AMOUNT)
            .description(UPDATED_DESCRIPTION)
            .date(UPDATED_DATE);
        return expenses;
    }

    @BeforeEach
    public void initTest() {
        expenses = createEntity(em);
    }

    @Test
    @Transactional
    void createExpenses() throws Exception {
        int databaseSizeBeforeCreate = expensesRepository.findAll().size();
        // Create the Expenses
        restExpensesMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(expenses)))
            .andExpect(status().isCreated());

        // Validate the Expenses in the database
        List<Expenses> expensesList = expensesRepository.findAll();
        assertThat(expensesList).hasSize(databaseSizeBeforeCreate + 1);
        Expenses testExpenses = expensesList.get(expensesList.size() - 1);
        assertThat(testExpenses.getExpenseType()).isEqualTo(DEFAULT_EXPENSE_TYPE);
        assertThat(testExpenses.getAmount()).isEqualTo(DEFAULT_AMOUNT);
        assertThat(testExpenses.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testExpenses.getDate()).isEqualTo(DEFAULT_DATE);
    }

    @Test
    @Transactional
    void createExpensesWithExistingId() throws Exception {
        // Create the Expenses with an existing ID
        expenses.setId(1L);

        int databaseSizeBeforeCreate = expensesRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restExpensesMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(expenses)))
            .andExpect(status().isBadRequest());

        // Validate the Expenses in the database
        List<Expenses> expensesList = expensesRepository.findAll();
        assertThat(expensesList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkExpenseTypeIsRequired() throws Exception {
        int databaseSizeBeforeTest = expensesRepository.findAll().size();
        // set the field null
        expenses.setExpenseType(null);

        // Create the Expenses, which fails.

        restExpensesMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(expenses)))
            .andExpect(status().isBadRequest());

        List<Expenses> expensesList = expensesRepository.findAll();
        assertThat(expensesList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkAmountIsRequired() throws Exception {
        int databaseSizeBeforeTest = expensesRepository.findAll().size();
        // set the field null
        expenses.setAmount(null);

        // Create the Expenses, which fails.

        restExpensesMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(expenses)))
            .andExpect(status().isBadRequest());

        List<Expenses> expensesList = expensesRepository.findAll();
        assertThat(expensesList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllExpenses() throws Exception {
        // Initialize the database
        expensesRepository.saveAndFlush(expenses);

        // Get all the expensesList
        restExpensesMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(expenses.getId().intValue())))
            .andExpect(jsonPath("$.[*].expenseType").value(hasItem(DEFAULT_EXPENSE_TYPE)))
            .andExpect(jsonPath("$.[*].amount").value(hasItem(DEFAULT_AMOUNT.doubleValue())))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION)))
            .andExpect(jsonPath("$.[*].date").value(hasItem(DEFAULT_DATE.toString())));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllExpensesWithEagerRelationshipsIsEnabled() throws Exception {
        when(expensesRepositoryMock.findAllWithEagerRelationships((UserDetails) any()))
            .thenReturn((List<Expenses>) new PageImpl(new ArrayList<>()));

        restExpensesMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(expensesRepositoryMock, times(1)).findAllWithEagerRelationships((UserDetails) any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllExpensesWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(expensesRepositoryMock.findAllWithEagerRelationships((UserDetails) any()))
            .thenReturn((List<Expenses>) new PageImpl(new ArrayList<>()));

        restExpensesMockMvc.perform(get(ENTITY_API_URL + "?eagerload=false")).andExpect(status().isOk());
        verify(expensesRepositoryMock, times(1)).findAll(any(Pageable.class));
    }

    @Test
    @Transactional
    void getExpenses() throws Exception {
        // Initialize the database
        expensesRepository.saveAndFlush(expenses);

        // Get the expenses
        restExpensesMockMvc
            .perform(get(ENTITY_API_URL_ID, expenses.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(expenses.getId().intValue()))
            .andExpect(jsonPath("$.expenseType").value(DEFAULT_EXPENSE_TYPE))
            .andExpect(jsonPath("$.amount").value(DEFAULT_AMOUNT.doubleValue()))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION))
            .andExpect(jsonPath("$.date").value(DEFAULT_DATE.toString()));
    }

    @Test
    @Transactional
    void getNonExistingExpenses() throws Exception {
        // Get the expenses
        restExpensesMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingExpenses() throws Exception {
        // Initialize the database
        expensesRepository.saveAndFlush(expenses);

        int databaseSizeBeforeUpdate = expensesRepository.findAll().size();

        // Update the expenses
        Expenses updatedExpenses = expensesRepository.findById(expenses.getId()).get();
        // Disconnect from session so that the updates on updatedExpenses are not directly saved in db
        em.detach(updatedExpenses);
        updatedExpenses.expenseType(UPDATED_EXPENSE_TYPE).amount(UPDATED_AMOUNT).description(UPDATED_DESCRIPTION).date(UPDATED_DATE);

        restExpensesMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedExpenses.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedExpenses))
            )
            .andExpect(status().isOk());

        // Validate the Expenses in the database
        List<Expenses> expensesList = expensesRepository.findAll();
        assertThat(expensesList).hasSize(databaseSizeBeforeUpdate);
        Expenses testExpenses = expensesList.get(expensesList.size() - 1);
        assertThat(testExpenses.getExpenseType()).isEqualTo(UPDATED_EXPENSE_TYPE);
        assertThat(testExpenses.getAmount()).isEqualTo(UPDATED_AMOUNT);
        assertThat(testExpenses.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testExpenses.getDate()).isEqualTo(UPDATED_DATE);
    }

    @Test
    @Transactional
    void putNonExistingExpenses() throws Exception {
        int databaseSizeBeforeUpdate = expensesRepository.findAll().size();
        expenses.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restExpensesMockMvc
            .perform(
                put(ENTITY_API_URL_ID, expenses.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(expenses))
            )
            .andExpect(status().isBadRequest());

        // Validate the Expenses in the database
        List<Expenses> expensesList = expensesRepository.findAll();
        assertThat(expensesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchExpenses() throws Exception {
        int databaseSizeBeforeUpdate = expensesRepository.findAll().size();
        expenses.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restExpensesMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(expenses))
            )
            .andExpect(status().isBadRequest());

        // Validate the Expenses in the database
        List<Expenses> expensesList = expensesRepository.findAll();
        assertThat(expensesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamExpenses() throws Exception {
        int databaseSizeBeforeUpdate = expensesRepository.findAll().size();
        expenses.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restExpensesMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(expenses)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Expenses in the database
        List<Expenses> expensesList = expensesRepository.findAll();
        assertThat(expensesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateExpensesWithPatch() throws Exception {
        // Initialize the database
        expensesRepository.saveAndFlush(expenses);

        int databaseSizeBeforeUpdate = expensesRepository.findAll().size();

        // Update the expenses using partial update
        Expenses partialUpdatedExpenses = new Expenses();
        partialUpdatedExpenses.setId(expenses.getId());

        partialUpdatedExpenses.expenseType(UPDATED_EXPENSE_TYPE);

        restExpensesMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedExpenses.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedExpenses))
            )
            .andExpect(status().isOk());

        // Validate the Expenses in the database
        List<Expenses> expensesList = expensesRepository.findAll();
        assertThat(expensesList).hasSize(databaseSizeBeforeUpdate);
        Expenses testExpenses = expensesList.get(expensesList.size() - 1);
        assertThat(testExpenses.getExpenseType()).isEqualTo(UPDATED_EXPENSE_TYPE);
        assertThat(testExpenses.getAmount()).isEqualTo(DEFAULT_AMOUNT);
        assertThat(testExpenses.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testExpenses.getDate()).isEqualTo(DEFAULT_DATE);
    }

    @Test
    @Transactional
    void fullUpdateExpensesWithPatch() throws Exception {
        // Initialize the database
        expensesRepository.saveAndFlush(expenses);

        int databaseSizeBeforeUpdate = expensesRepository.findAll().size();

        // Update the expenses using partial update
        Expenses partialUpdatedExpenses = new Expenses();
        partialUpdatedExpenses.setId(expenses.getId());

        partialUpdatedExpenses.expenseType(UPDATED_EXPENSE_TYPE).amount(UPDATED_AMOUNT).description(UPDATED_DESCRIPTION).date(UPDATED_DATE);

        restExpensesMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedExpenses.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedExpenses))
            )
            .andExpect(status().isOk());

        // Validate the Expenses in the database
        List<Expenses> expensesList = expensesRepository.findAll();
        assertThat(expensesList).hasSize(databaseSizeBeforeUpdate);
        Expenses testExpenses = expensesList.get(expensesList.size() - 1);
        assertThat(testExpenses.getExpenseType()).isEqualTo(UPDATED_EXPENSE_TYPE);
        assertThat(testExpenses.getAmount()).isEqualTo(UPDATED_AMOUNT);
        assertThat(testExpenses.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testExpenses.getDate()).isEqualTo(UPDATED_DATE);
    }

    @Test
    @Transactional
    void patchNonExistingExpenses() throws Exception {
        int databaseSizeBeforeUpdate = expensesRepository.findAll().size();
        expenses.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restExpensesMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, expenses.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(expenses))
            )
            .andExpect(status().isBadRequest());

        // Validate the Expenses in the database
        List<Expenses> expensesList = expensesRepository.findAll();
        assertThat(expensesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchExpenses() throws Exception {
        int databaseSizeBeforeUpdate = expensesRepository.findAll().size();
        expenses.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restExpensesMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(expenses))
            )
            .andExpect(status().isBadRequest());

        // Validate the Expenses in the database
        List<Expenses> expensesList = expensesRepository.findAll();
        assertThat(expensesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamExpenses() throws Exception {
        int databaseSizeBeforeUpdate = expensesRepository.findAll().size();
        expenses.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restExpensesMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(expenses)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Expenses in the database
        List<Expenses> expensesList = expensesRepository.findAll();
        assertThat(expensesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteExpenses() throws Exception {
        // Initialize the database
        expensesRepository.saveAndFlush(expenses);

        int databaseSizeBeforeDelete = expensesRepository.findAll().size();

        // Delete the expenses
        restExpensesMockMvc
            .perform(delete(ENTITY_API_URL_ID, expenses.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Expenses> expensesList = expensesRepository.findAll();
        assertThat(expensesList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
