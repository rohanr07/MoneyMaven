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
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import uk.ac.bham.teamproject.IntegrationTest;
import uk.ac.bham.teamproject.domain.Analytics;
import uk.ac.bham.teamproject.domain.enumeration.Transaction;
import uk.ac.bham.teamproject.repository.AnalyticsRepository;

/**
 * Integration tests for the {@link AnalyticsResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class AnalyticsResourceIT {

    private static final Transaction DEFAULT_TRANSACTION = Transaction.Earned;
    private static final Transaction UPDATED_TRANSACTION = Transaction.Spend;

    private static final Double DEFAULT_AMOUNT = 1D;
    private static final Double UPDATED_AMOUNT = 2D;

    private static final LocalDate DEFAULT_DATE = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_DATE = LocalDate.now(ZoneId.systemDefault());

    private static final String ENTITY_API_URL = "/api/analytics";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private AnalyticsRepository analyticsRepository;

    @Mock
    private AnalyticsRepository analyticsRepositoryMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restAnalyticsMockMvc;

    private Analytics analytics;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Analytics createEntity(EntityManager em) {
        Analytics analytics = new Analytics().transaction(DEFAULT_TRANSACTION).amount(DEFAULT_AMOUNT).date(DEFAULT_DATE);
        return analytics;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Analytics createUpdatedEntity(EntityManager em) {
        Analytics analytics = new Analytics().transaction(UPDATED_TRANSACTION).amount(UPDATED_AMOUNT).date(UPDATED_DATE);
        return analytics;
    }

    @BeforeEach
    public void initTest() {
        analytics = createEntity(em);
    }

    @Test
    @Transactional
    void createAnalytics() throws Exception {
        int databaseSizeBeforeCreate = analyticsRepository.findAll().size();
        // Create the Analytics
        restAnalyticsMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(analytics)))
            .andExpect(status().isCreated());

        // Validate the Analytics in the database
        List<Analytics> analyticsList = analyticsRepository.findAll();
        assertThat(analyticsList).hasSize(databaseSizeBeforeCreate + 1);
        Analytics testAnalytics = analyticsList.get(analyticsList.size() - 1);
        assertThat(testAnalytics.getTransaction()).isEqualTo(DEFAULT_TRANSACTION);
        assertThat(testAnalytics.getAmount()).isEqualTo(DEFAULT_AMOUNT);
        assertThat(testAnalytics.getDate()).isEqualTo(DEFAULT_DATE);
    }

    @Test
    @Transactional
    void createAnalyticsWithExistingId() throws Exception {
        // Create the Analytics with an existing ID
        analytics.setId(1L);

        int databaseSizeBeforeCreate = analyticsRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restAnalyticsMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(analytics)))
            .andExpect(status().isBadRequest());

        // Validate the Analytics in the database
        List<Analytics> analyticsList = analyticsRepository.findAll();
        assertThat(analyticsList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllAnalytics() throws Exception {
        // Initialize the database
        analyticsRepository.saveAndFlush(analytics);

        // Get all the analyticsList
        restAnalyticsMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(analytics.getId().intValue())))
            .andExpect(jsonPath("$.[*].transaction").value(hasItem(DEFAULT_TRANSACTION.toString())))
            .andExpect(jsonPath("$.[*].amount").value(hasItem(DEFAULT_AMOUNT.doubleValue())))
            .andExpect(jsonPath("$.[*].date").value(hasItem(DEFAULT_DATE.toString())));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllAnalyticsWithEagerRelationshipsIsEnabled() throws Exception {
        when(analyticsRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restAnalyticsMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(analyticsRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllAnalyticsWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(analyticsRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restAnalyticsMockMvc.perform(get(ENTITY_API_URL + "?eagerload=false")).andExpect(status().isOk());
        verify(analyticsRepositoryMock, times(1)).findAll(any(Pageable.class));
    }

    @Test
    @Transactional
    void getAnalytics() throws Exception {
        // Initialize the database
        analyticsRepository.saveAndFlush(analytics);

        // Get the analytics
        restAnalyticsMockMvc
            .perform(get(ENTITY_API_URL_ID, analytics.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(analytics.getId().intValue()))
            .andExpect(jsonPath("$.transaction").value(DEFAULT_TRANSACTION.toString()))
            .andExpect(jsonPath("$.amount").value(DEFAULT_AMOUNT.doubleValue()))
            .andExpect(jsonPath("$.date").value(DEFAULT_DATE.toString()));
    }

    @Test
    @Transactional
    void getNonExistingAnalytics() throws Exception {
        // Get the analytics
        restAnalyticsMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingAnalytics() throws Exception {
        // Initialize the database
        analyticsRepository.saveAndFlush(analytics);

        int databaseSizeBeforeUpdate = analyticsRepository.findAll().size();

        // Update the analytics
        Analytics updatedAnalytics = analyticsRepository.findById(analytics.getId()).get();
        // Disconnect from session so that the updates on updatedAnalytics are not directly saved in db
        em.detach(updatedAnalytics);
        updatedAnalytics.transaction(UPDATED_TRANSACTION).amount(UPDATED_AMOUNT).date(UPDATED_DATE);

        restAnalyticsMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedAnalytics.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedAnalytics))
            )
            .andExpect(status().isOk());

        // Validate the Analytics in the database
        List<Analytics> analyticsList = analyticsRepository.findAll();
        assertThat(analyticsList).hasSize(databaseSizeBeforeUpdate);
        Analytics testAnalytics = analyticsList.get(analyticsList.size() - 1);
        assertThat(testAnalytics.getTransaction()).isEqualTo(UPDATED_TRANSACTION);
        assertThat(testAnalytics.getAmount()).isEqualTo(UPDATED_AMOUNT);
        assertThat(testAnalytics.getDate()).isEqualTo(UPDATED_DATE);
    }

    @Test
    @Transactional
    void putNonExistingAnalytics() throws Exception {
        int databaseSizeBeforeUpdate = analyticsRepository.findAll().size();
        analytics.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAnalyticsMockMvc
            .perform(
                put(ENTITY_API_URL_ID, analytics.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(analytics))
            )
            .andExpect(status().isBadRequest());

        // Validate the Analytics in the database
        List<Analytics> analyticsList = analyticsRepository.findAll();
        assertThat(analyticsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchAnalytics() throws Exception {
        int databaseSizeBeforeUpdate = analyticsRepository.findAll().size();
        analytics.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAnalyticsMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(analytics))
            )
            .andExpect(status().isBadRequest());

        // Validate the Analytics in the database
        List<Analytics> analyticsList = analyticsRepository.findAll();
        assertThat(analyticsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamAnalytics() throws Exception {
        int databaseSizeBeforeUpdate = analyticsRepository.findAll().size();
        analytics.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAnalyticsMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(analytics)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Analytics in the database
        List<Analytics> analyticsList = analyticsRepository.findAll();
        assertThat(analyticsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateAnalyticsWithPatch() throws Exception {
        // Initialize the database
        analyticsRepository.saveAndFlush(analytics);

        int databaseSizeBeforeUpdate = analyticsRepository.findAll().size();

        // Update the analytics using partial update
        Analytics partialUpdatedAnalytics = new Analytics();
        partialUpdatedAnalytics.setId(analytics.getId());

        partialUpdatedAnalytics.amount(UPDATED_AMOUNT).date(UPDATED_DATE);

        restAnalyticsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAnalytics.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedAnalytics))
            )
            .andExpect(status().isOk());

        // Validate the Analytics in the database
        List<Analytics> analyticsList = analyticsRepository.findAll();
        assertThat(analyticsList).hasSize(databaseSizeBeforeUpdate);
        Analytics testAnalytics = analyticsList.get(analyticsList.size() - 1);
        assertThat(testAnalytics.getTransaction()).isEqualTo(DEFAULT_TRANSACTION);
        assertThat(testAnalytics.getAmount()).isEqualTo(UPDATED_AMOUNT);
        assertThat(testAnalytics.getDate()).isEqualTo(UPDATED_DATE);
    }

    @Test
    @Transactional
    void fullUpdateAnalyticsWithPatch() throws Exception {
        // Initialize the database
        analyticsRepository.saveAndFlush(analytics);

        int databaseSizeBeforeUpdate = analyticsRepository.findAll().size();

        // Update the analytics using partial update
        Analytics partialUpdatedAnalytics = new Analytics();
        partialUpdatedAnalytics.setId(analytics.getId());

        partialUpdatedAnalytics.transaction(UPDATED_TRANSACTION).amount(UPDATED_AMOUNT).date(UPDATED_DATE);

        restAnalyticsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAnalytics.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedAnalytics))
            )
            .andExpect(status().isOk());

        // Validate the Analytics in the database
        List<Analytics> analyticsList = analyticsRepository.findAll();
        assertThat(analyticsList).hasSize(databaseSizeBeforeUpdate);
        Analytics testAnalytics = analyticsList.get(analyticsList.size() - 1);
        assertThat(testAnalytics.getTransaction()).isEqualTo(UPDATED_TRANSACTION);
        assertThat(testAnalytics.getAmount()).isEqualTo(UPDATED_AMOUNT);
        assertThat(testAnalytics.getDate()).isEqualTo(UPDATED_DATE);
    }

    @Test
    @Transactional
    void patchNonExistingAnalytics() throws Exception {
        int databaseSizeBeforeUpdate = analyticsRepository.findAll().size();
        analytics.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAnalyticsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, analytics.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(analytics))
            )
            .andExpect(status().isBadRequest());

        // Validate the Analytics in the database
        List<Analytics> analyticsList = analyticsRepository.findAll();
        assertThat(analyticsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchAnalytics() throws Exception {
        int databaseSizeBeforeUpdate = analyticsRepository.findAll().size();
        analytics.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAnalyticsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(analytics))
            )
            .andExpect(status().isBadRequest());

        // Validate the Analytics in the database
        List<Analytics> analyticsList = analyticsRepository.findAll();
        assertThat(analyticsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamAnalytics() throws Exception {
        int databaseSizeBeforeUpdate = analyticsRepository.findAll().size();
        analytics.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAnalyticsMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(analytics))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Analytics in the database
        List<Analytics> analyticsList = analyticsRepository.findAll();
        assertThat(analyticsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteAnalytics() throws Exception {
        // Initialize the database
        analyticsRepository.saveAndFlush(analytics);

        int databaseSizeBeforeDelete = analyticsRepository.findAll().size();

        // Delete the analytics
        restAnalyticsMockMvc
            .perform(delete(ENTITY_API_URL_ID, analytics.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Analytics> analyticsList = analyticsRepository.findAll();
        assertThat(analyticsList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
