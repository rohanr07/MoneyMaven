package uk.ac.bham.teamproject.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static uk.ac.bham.teamproject.web.rest.TestUtil.sameNumber;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.ZoneId;
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
import uk.ac.bham.teamproject.domain.Budget;
import uk.ac.bham.teamproject.repository.BudgetRepository;

/**
 * Integration tests for the {@link BudgetResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class BudgetResourceIT {

    private static final Long DEFAULT_BUDGET_ID = 1L;
    private static final Long UPDATED_BUDGET_ID = 2L;

    private static final LocalDate DEFAULT_MONTH_OF_THE_TIME = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_MONTH_OF_THE_TIME = LocalDate.now(ZoneId.systemDefault());

    private static final BigDecimal DEFAULT_TOTAL_BUDGET = new BigDecimal(1);
    private static final BigDecimal UPDATED_TOTAL_BUDGET = new BigDecimal(2);

    private static final BigDecimal DEFAULT_TOTAL_SPENT = new BigDecimal(1);
    private static final BigDecimal UPDATED_TOTAL_SPENT = new BigDecimal(2);

    private static final BigDecimal DEFAULT_AMOUNT_REMAINING = new BigDecimal(1);
    private static final BigDecimal UPDATED_AMOUNT_REMAINING = new BigDecimal(2);

    private static final String ENTITY_API_URL = "/api/budgets";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private BudgetRepository budgetRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restBudgetMockMvc;

    private Budget budget;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Budget createEntity(EntityManager em) {
        Budget budget = new Budget()
            .budgetId(DEFAULT_BUDGET_ID)
            .monthOfTheTime(DEFAULT_MONTH_OF_THE_TIME)
            .totalBudget(DEFAULT_TOTAL_BUDGET)
            .totalSpent(DEFAULT_TOTAL_SPENT)
            .amountRemaining(DEFAULT_AMOUNT_REMAINING);
        return budget;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Budget createUpdatedEntity(EntityManager em) {
        Budget budget = new Budget()
            .budgetId(UPDATED_BUDGET_ID)
            .monthOfTheTime(UPDATED_MONTH_OF_THE_TIME)
            .totalBudget(UPDATED_TOTAL_BUDGET)
            .totalSpent(UPDATED_TOTAL_SPENT)
            .amountRemaining(UPDATED_AMOUNT_REMAINING);
        return budget;
    }

    @BeforeEach
    public void initTest() {
        budget = createEntity(em);
    }

    @Test
    @Transactional
    void createBudget() throws Exception {
        int databaseSizeBeforeCreate = budgetRepository.findAll().size();
        // Create the Budget
        restBudgetMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(budget)))
            .andExpect(status().isCreated());

        // Validate the Budget in the database
        List<Budget> budgetList = budgetRepository.findAll();
        assertThat(budgetList).hasSize(databaseSizeBeforeCreate + 1);
        Budget testBudget = budgetList.get(budgetList.size() - 1);
        assertThat(testBudget.getBudgetId()).isEqualTo(DEFAULT_BUDGET_ID);
        assertThat(testBudget.getMonthOfTheTime()).isEqualTo(DEFAULT_MONTH_OF_THE_TIME);
        assertThat(testBudget.getTotalBudget()).isEqualByComparingTo(DEFAULT_TOTAL_BUDGET);
        assertThat(testBudget.getTotalSpent()).isEqualByComparingTo(DEFAULT_TOTAL_SPENT);
        assertThat(testBudget.getAmountRemaining()).isEqualByComparingTo(DEFAULT_AMOUNT_REMAINING);
    }

    @Test
    @Transactional
    void createBudgetWithExistingId() throws Exception {
        // Create the Budget with an existing ID
        budget.setId(1L);

        int databaseSizeBeforeCreate = budgetRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restBudgetMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(budget)))
            .andExpect(status().isBadRequest());

        // Validate the Budget in the database
        List<Budget> budgetList = budgetRepository.findAll();
        assertThat(budgetList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkMonthOfTheTimeIsRequired() throws Exception {
        int databaseSizeBeforeTest = budgetRepository.findAll().size();
        // set the field null
        budget.setMonthOfTheTime(null);

        // Create the Budget, which fails.

        restBudgetMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(budget)))
            .andExpect(status().isBadRequest());

        List<Budget> budgetList = budgetRepository.findAll();
        assertThat(budgetList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkTotalBudgetIsRequired() throws Exception {
        int databaseSizeBeforeTest = budgetRepository.findAll().size();
        // set the field null
        budget.setTotalBudget(null);

        // Create the Budget, which fails.

        restBudgetMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(budget)))
            .andExpect(status().isBadRequest());

        List<Budget> budgetList = budgetRepository.findAll();
        assertThat(budgetList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkTotalSpentIsRequired() throws Exception {
        int databaseSizeBeforeTest = budgetRepository.findAll().size();
        // set the field null
        budget.setTotalSpent(null);

        // Create the Budget, which fails.

        restBudgetMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(budget)))
            .andExpect(status().isBadRequest());

        List<Budget> budgetList = budgetRepository.findAll();
        assertThat(budgetList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkAmountRemainingIsRequired() throws Exception {
        int databaseSizeBeforeTest = budgetRepository.findAll().size();
        // set the field null
        budget.setAmountRemaining(null);

        // Create the Budget, which fails.

        restBudgetMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(budget)))
            .andExpect(status().isBadRequest());

        List<Budget> budgetList = budgetRepository.findAll();
        assertThat(budgetList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllBudgets() throws Exception {
        // Initialize the database
        budgetRepository.saveAndFlush(budget);

        // Get all the budgetList
        restBudgetMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(budget.getId().intValue())))
            .andExpect(jsonPath("$.[*].budgetId").value(hasItem(DEFAULT_BUDGET_ID.intValue())))
            .andExpect(jsonPath("$.[*].monthOfTheTime").value(hasItem(DEFAULT_MONTH_OF_THE_TIME.toString())))
            .andExpect(jsonPath("$.[*].totalBudget").value(hasItem(sameNumber(DEFAULT_TOTAL_BUDGET))))
            .andExpect(jsonPath("$.[*].totalSpent").value(hasItem(sameNumber(DEFAULT_TOTAL_SPENT))))
            .andExpect(jsonPath("$.[*].amountRemaining").value(hasItem(sameNumber(DEFAULT_AMOUNT_REMAINING))));
    }

    @Test
    @Transactional
    void getBudget() throws Exception {
        // Initialize the database
        budgetRepository.saveAndFlush(budget);

        // Get the budget
        restBudgetMockMvc
            .perform(get(ENTITY_API_URL_ID, budget.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(budget.getId().intValue()))
            .andExpect(jsonPath("$.budgetId").value(DEFAULT_BUDGET_ID.intValue()))
            .andExpect(jsonPath("$.monthOfTheTime").value(DEFAULT_MONTH_OF_THE_TIME.toString()))
            .andExpect(jsonPath("$.totalBudget").value(sameNumber(DEFAULT_TOTAL_BUDGET)))
            .andExpect(jsonPath("$.totalSpent").value(sameNumber(DEFAULT_TOTAL_SPENT)))
            .andExpect(jsonPath("$.amountRemaining").value(sameNumber(DEFAULT_AMOUNT_REMAINING)));
    }

    @Test
    @Transactional
    void getNonExistingBudget() throws Exception {
        // Get the budget
        restBudgetMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingBudget() throws Exception {
        // Initialize the database
        budgetRepository.saveAndFlush(budget);

        int databaseSizeBeforeUpdate = budgetRepository.findAll().size();

        // Update the budget
        Budget updatedBudget = budgetRepository.findById(budget.getId()).get();
        // Disconnect from session so that the updates on updatedBudget are not directly saved in db
        em.detach(updatedBudget);
        updatedBudget
            .budgetId(UPDATED_BUDGET_ID)
            .monthOfTheTime(UPDATED_MONTH_OF_THE_TIME)
            .totalBudget(UPDATED_TOTAL_BUDGET)
            .totalSpent(UPDATED_TOTAL_SPENT)
            .amountRemaining(UPDATED_AMOUNT_REMAINING);

        restBudgetMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedBudget.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedBudget))
            )
            .andExpect(status().isOk());

        // Validate the Budget in the database
        List<Budget> budgetList = budgetRepository.findAll();
        assertThat(budgetList).hasSize(databaseSizeBeforeUpdate);
        Budget testBudget = budgetList.get(budgetList.size() - 1);
        assertThat(testBudget.getBudgetId()).isEqualTo(UPDATED_BUDGET_ID);
        assertThat(testBudget.getMonthOfTheTime()).isEqualTo(UPDATED_MONTH_OF_THE_TIME);
        assertThat(testBudget.getTotalBudget()).isEqualByComparingTo(UPDATED_TOTAL_BUDGET);
        assertThat(testBudget.getTotalSpent()).isEqualByComparingTo(UPDATED_TOTAL_SPENT);
        assertThat(testBudget.getAmountRemaining()).isEqualByComparingTo(UPDATED_AMOUNT_REMAINING);
    }

    @Test
    @Transactional
    void putNonExistingBudget() throws Exception {
        int databaseSizeBeforeUpdate = budgetRepository.findAll().size();
        budget.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restBudgetMockMvc
            .perform(
                put(ENTITY_API_URL_ID, budget.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(budget))
            )
            .andExpect(status().isBadRequest());

        // Validate the Budget in the database
        List<Budget> budgetList = budgetRepository.findAll();
        assertThat(budgetList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchBudget() throws Exception {
        int databaseSizeBeforeUpdate = budgetRepository.findAll().size();
        budget.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restBudgetMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(budget))
            )
            .andExpect(status().isBadRequest());

        // Validate the Budget in the database
        List<Budget> budgetList = budgetRepository.findAll();
        assertThat(budgetList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamBudget() throws Exception {
        int databaseSizeBeforeUpdate = budgetRepository.findAll().size();
        budget.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restBudgetMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(budget)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Budget in the database
        List<Budget> budgetList = budgetRepository.findAll();
        assertThat(budgetList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateBudgetWithPatch() throws Exception {
        // Initialize the database
        budgetRepository.saveAndFlush(budget);

        int databaseSizeBeforeUpdate = budgetRepository.findAll().size();

        // Update the budget using partial update
        Budget partialUpdatedBudget = new Budget();
        partialUpdatedBudget.setId(budget.getId());

        partialUpdatedBudget
            .budgetId(UPDATED_BUDGET_ID)
            .monthOfTheTime(UPDATED_MONTH_OF_THE_TIME)
            .totalBudget(UPDATED_TOTAL_BUDGET)
            .amountRemaining(UPDATED_AMOUNT_REMAINING);

        restBudgetMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedBudget.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedBudget))
            )
            .andExpect(status().isOk());

        // Validate the Budget in the database
        List<Budget> budgetList = budgetRepository.findAll();
        assertThat(budgetList).hasSize(databaseSizeBeforeUpdate);
        Budget testBudget = budgetList.get(budgetList.size() - 1);
        assertThat(testBudget.getBudgetId()).isEqualTo(UPDATED_BUDGET_ID);
        assertThat(testBudget.getMonthOfTheTime()).isEqualTo(UPDATED_MONTH_OF_THE_TIME);
        assertThat(testBudget.getTotalBudget()).isEqualByComparingTo(UPDATED_TOTAL_BUDGET);
        assertThat(testBudget.getTotalSpent()).isEqualByComparingTo(DEFAULT_TOTAL_SPENT);
        assertThat(testBudget.getAmountRemaining()).isEqualByComparingTo(UPDATED_AMOUNT_REMAINING);
    }

    @Test
    @Transactional
    void fullUpdateBudgetWithPatch() throws Exception {
        // Initialize the database
        budgetRepository.saveAndFlush(budget);

        int databaseSizeBeforeUpdate = budgetRepository.findAll().size();

        // Update the budget using partial update
        Budget partialUpdatedBudget = new Budget();
        partialUpdatedBudget.setId(budget.getId());

        partialUpdatedBudget
            .budgetId(UPDATED_BUDGET_ID)
            .monthOfTheTime(UPDATED_MONTH_OF_THE_TIME)
            .totalBudget(UPDATED_TOTAL_BUDGET)
            .totalSpent(UPDATED_TOTAL_SPENT)
            .amountRemaining(UPDATED_AMOUNT_REMAINING);

        restBudgetMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedBudget.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedBudget))
            )
            .andExpect(status().isOk());

        // Validate the Budget in the database
        List<Budget> budgetList = budgetRepository.findAll();
        assertThat(budgetList).hasSize(databaseSizeBeforeUpdate);
        Budget testBudget = budgetList.get(budgetList.size() - 1);
        assertThat(testBudget.getBudgetId()).isEqualTo(UPDATED_BUDGET_ID);
        assertThat(testBudget.getMonthOfTheTime()).isEqualTo(UPDATED_MONTH_OF_THE_TIME);
        assertThat(testBudget.getTotalBudget()).isEqualByComparingTo(UPDATED_TOTAL_BUDGET);
        assertThat(testBudget.getTotalSpent()).isEqualByComparingTo(UPDATED_TOTAL_SPENT);
        assertThat(testBudget.getAmountRemaining()).isEqualByComparingTo(UPDATED_AMOUNT_REMAINING);
    }

    @Test
    @Transactional
    void patchNonExistingBudget() throws Exception {
        int databaseSizeBeforeUpdate = budgetRepository.findAll().size();
        budget.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restBudgetMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, budget.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(budget))
            )
            .andExpect(status().isBadRequest());

        // Validate the Budget in the database
        List<Budget> budgetList = budgetRepository.findAll();
        assertThat(budgetList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchBudget() throws Exception {
        int databaseSizeBeforeUpdate = budgetRepository.findAll().size();
        budget.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restBudgetMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(budget))
            )
            .andExpect(status().isBadRequest());

        // Validate the Budget in the database
        List<Budget> budgetList = budgetRepository.findAll();
        assertThat(budgetList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamBudget() throws Exception {
        int databaseSizeBeforeUpdate = budgetRepository.findAll().size();
        budget.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restBudgetMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(budget)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Budget in the database
        List<Budget> budgetList = budgetRepository.findAll();
        assertThat(budgetList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteBudget() throws Exception {
        // Initialize the database
        budgetRepository.saveAndFlush(budget);

        int databaseSizeBeforeDelete = budgetRepository.findAll().size();

        // Delete the budget
        restBudgetMockMvc
            .perform(delete(ENTITY_API_URL_ID, budget.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Budget> budgetList = budgetRepository.findAll();
        assertThat(budgetList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
