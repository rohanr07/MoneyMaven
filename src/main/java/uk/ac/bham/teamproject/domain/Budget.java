package uk.ac.bham.teamproject.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.Instant;
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

    @NotNull
    @Column(name = "name", nullable = false)
    private String name;

    @NotNull
    @Column(name = "start_date", nullable = false)
    private Instant startDate;

    @NotNull
    @Column(name = "end_date", nullable = false)
    private Instant endDate;

    @NotNull
    @Column(name = "jhi_limit", nullable = false)
    private Double limit;

    @OneToMany(mappedBy = "budget")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "account", "category", "budget" }, allowSetters = true)
    private Set<FinancialTransaction> transactions = new HashSet<>();

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

    public String getName() {
        return this.name;
    }

    public Budget name(String name) {
        this.setName(name);
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Instant getStartDate() {
        return this.startDate;
    }

    public Budget startDate(Instant startDate) {
        this.setStartDate(startDate);
        return this;
    }

    public void setStartDate(Instant startDate) {
        this.startDate = startDate;
    }

    public Instant getEndDate() {
        return this.endDate;
    }

    public Budget endDate(Instant endDate) {
        this.setEndDate(endDate);
        return this;
    }

    public void setEndDate(Instant endDate) {
        this.endDate = endDate;
    }

    public Double getLimit() {
        return this.limit;
    }

    public Budget limit(Double limit) {
        this.setLimit(limit);
        return this;
    }

    public void setLimit(Double limit) {
        this.limit = limit;
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
            ", name='" + getName() + "'" +
            ", startDate='" + getStartDate() + "'" +
            ", endDate='" + getEndDate() + "'" +
            ", limit=" + getLimit() +
            "}";
    }
}
