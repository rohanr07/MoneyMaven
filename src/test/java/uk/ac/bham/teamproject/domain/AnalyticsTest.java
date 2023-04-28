package uk.ac.bham.teamproject.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import uk.ac.bham.teamproject.web.rest.TestUtil;

class AnalyticsTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Analytics.class);
        Analytics analytics1 = new Analytics();
        analytics1.setId(1L);
        Analytics analytics2 = new Analytics();
        analytics2.setId(analytics1.getId());
        assertThat(analytics1).isEqualTo(analytics2);
        analytics2.setId(2L);
        assertThat(analytics1).isNotEqualTo(analytics2);
        analytics1.setId(null);
        assertThat(analytics1).isNotEqualTo(analytics2);
    }
}
