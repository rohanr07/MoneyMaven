package uk.ac.bham.teamproject.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import uk.ac.bham.teamproject.domain.enumeration.AccountType;

/**
 * A FinancialAccount.
 */
@Entity
@Table(name = "financial_account")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class FinancialAccount implements Serializable {

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
    @Column(name = "balance", nullable = false)
    private Double balance;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "type", nullable = false)
    private AccountType type;

    @Column(name = "description")
    private String description;

    @OneToMany(mappedBy = "account")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "account", "category", "budget" }, allowSetters = true)
    private Set<FinancialTransaction> transactions = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public FinancialAccount id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return this.name;
    }

    public FinancialAccount name(String name) {
        this.setName(name);
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Double getBalance() {
        return this.balance;
    }

    public FinancialAccount balance(Double balance) {
        this.setBalance(balance);
        return this;
    }

    public void setBalance(Double balance) {
        this.balance = balance;
    }

    public AccountType getType() {
        return this.type;
    }

    public FinancialAccount type(AccountType type) {
        this.setType(type);
        return this;
    }

    public void setType(AccountType type) {
        this.type = type;
    }

    public String getDescription() {
        return this.description;
    }

    public FinancialAccount description(String description) {
        this.setDescription(description);
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Set<FinancialTransaction> getTransactions() {
        return this.transactions;
    }

    public void setTransactions(Set<FinancialTransaction> financialTransactions) {
        if (this.transactions != null) {
            this.transactions.forEach(i -> i.setAccount(null));
        }
        if (financialTransactions != null) {
            financialTransactions.forEach(i -> i.setAccount(this));
        }
        this.transactions = financialTransactions;
    }

    public FinancialAccount transactions(Set<FinancialTransaction> financialTransactions) {
        this.setTransactions(financialTransactions);
        return this;
    }

    public FinancialAccount addTransactions(FinancialTransaction financialTransaction) {
        this.transactions.add(financialTransaction);
        financialTransaction.setAccount(this);
        return this;
    }

    public FinancialAccount removeTransactions(FinancialTransaction financialTransaction) {
        this.transactions.remove(financialTransaction);
        financialTransaction.setAccount(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof FinancialAccount)) {
            return false;
        }
        return id != null && id.equals(((FinancialAccount) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "FinancialAccount{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", balance=" + getBalance() +
            ", type='" + getType() + "'" +
            ", description='" + getDescription() + "'" +
            "}";
    }
}
