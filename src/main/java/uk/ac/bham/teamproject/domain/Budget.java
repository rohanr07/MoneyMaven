package uk.ac.bham.teamproject.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Budget.
 */
@Entity
@Table(name = "budget")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Budget implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "budget_id")
    private Long budgetId;

    @NotNull
    @Column(name = "month_of_the_time", nullable = false)
    private LocalDate monthOfTheTime;

    @NotNull
    @Column(name = "total_budget", precision = 21, scale = 2, nullable = false)
    private BigDecimal totalBudget;

    @NotNull
    @Column(name = "total_spent", precision = 21, scale = 2, nullable = false)
    private BigDecimal totalSpent;

    @NotNull
    @Column(name = "amount_remaining", precision = 21, scale = 2, nullable = false)
    private BigDecimal amountRemaining;

    @OneToMany(mappedBy = "budget")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "account", "category", "budget" }, allowSetters = true)
    private Set<FinancialTransaction> transactions = new HashSet<>();

    @OneToMany(mappedBy = "budget")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "transactions", "budget", "budget" }, allowSetters = true)
    private Set<Category> categories = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Budget id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getBudgetId() {
        return this.budgetId;
    }

    public Budget budgetId(Long budgetId) {
        this.setBudgetId(budgetId);
        return this;
    }

    public void setBudgetId(Long budgetId) {
        this.budgetId = budgetId;
    }

    public LocalDate getMonthOfTheTime() {
        return this.monthOfTheTime;
    }

    public Budget monthOfTheTime(LocalDate monthOfTheTime) {
        this.setMonthOfTheTime(monthOfTheTime);
        return this;
    }

    public void setMonthOfTheTime(LocalDate monthOfTheTime) {
        this.monthOfTheTime = monthOfTheTime;
    }

    public BigDecimal getTotalBudget() {
        return this.totalBudget;
    }

    public Budget totalBudget(BigDecimal totalBudget) {
        this.setTotalBudget(totalBudget);
        return this;
    }

    public void setTotalBudget(BigDecimal totalBudget) {
        this.totalBudget = totalBudget;
    }

    public BigDecimal getTotalSpent() {
        return this.totalSpent;
    }

    public Budget totalSpent(BigDecimal totalSpent) {
        this.setTotalSpent(totalSpent);
        return this;
    }

    public void setTotalSpent(BigDecimal totalSpent) {
        this.totalSpent = totalSpent;
    }

    public BigDecimal getAmountRemaining() {
        return this.amountRemaining;
    }

    public Budget amountRemaining(BigDecimal amountRemaining) {
        this.setAmountRemaining(amountRemaining);
        return this;
    }

    public void setAmountRemaining(BigDecimal amountRemaining) {
        this.amountRemaining = amountRemaining;
    }

    public Set<FinancialTransaction> getTransactions() {
        return this.transactions;
    }

    public void setTransactions(Set<FinancialTransaction> financialTransactions) {
        if (this.transactions != null) {
            this.transactions.forEach(i -> i.setBudget(null));
        }
        if (financialTransactions != null) {
            financialTransactions.forEach(i -> i.setBudget(this));
        }
        this.transactions = financialTransactions;
    }

    public Budget transactions(Set<FinancialTransaction> financialTransactions) {
        this.setTransactions(financialTransactions);
        return this;
    }

    public Budget addTransactions(FinancialTransaction financialTransaction) {
        this.transactions.add(financialTransaction);
        financialTransaction.setBudget(this);
        return this;
    }

    public Budget removeTransactions(FinancialTransaction financialTransaction) {
        this.transactions.remove(financialTransaction);
        financialTransaction.setBudget(null);
        return this;
    }

    public Set<Category> getCategories() {
        return this.categories;
    }

    public void setCategories(Set<Category> categories) {
        if (this.categories != null) {
            this.categories.forEach(i -> i.setBudget(null));
        }
        if (categories != null) {
            categories.forEach(i -> i.setBudget(this));
        }
        this.categories = categories;
    }

    public Budget categories(Set<Category> categories) {
        this.setCategories(categories);
        return this;
    }

    public Budget addCategory(Category category) {
        this.categories.add(category);
        category.setBudget(this);
        return this;
    }

    public Budget removeCategory(Category category) {
        this.categories.remove(category);
        category.setBudget(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Budget)) {
            return false;
        }
        return id != null && id.equals(((Budget) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Budget{" +
            "id=" + getId() +
            ", budgetId=" + getBudgetId() +
            ", monthOfTheTime='" + getMonthOfTheTime() + "'" +
            ", totalBudget=" + getTotalBudget() +
            ", totalSpent=" + getTotalSpent() +
            ", amountRemaining=" + getAmountRemaining() +
            "}";
    }
}
