package uk.ac.bham.teamproject.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import uk.ac.bham.teamproject.web.rest.TestUtil;

class ExpensesTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Expenses.class);
        Expenses expenses1 = new Expenses();
        expenses1.setId(1L);
        Expenses expenses2 = new Expenses();
        expenses2.setId(expenses1.getId());
        assertThat(expenses1).isEqualTo(expenses2);
        expenses2.setId(2L);
        assertThat(expenses1).isNotEqualTo(expenses2);
        expenses1.setId(null);
        assertThat(expenses1).isNotEqualTo(expenses2);
    }
}
