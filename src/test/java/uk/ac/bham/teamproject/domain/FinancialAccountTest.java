package uk.ac.bham.teamproject.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import uk.ac.bham.teamproject.web.rest.TestUtil;

class FinancialAccountTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(FinancialAccount.class);
        FinancialAccount financialAccount1 = new FinancialAccount();
        financialAccount1.setId(1L);
        FinancialAccount financialAccount2 = new FinancialAccount();
        financialAccount2.setId(financialAccount1.getId());
        assertThat(financialAccount1).isEqualTo(financialAccount2);
        financialAccount2.setId(2L);
        assertThat(financialAccount1).isNotEqualTo(financialAccount2);
        financialAccount1.setId(null);
        assertThat(financialAccount1).isNotEqualTo(financialAccount2);
    }
}
