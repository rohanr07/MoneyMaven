import {
  entityTableSelector,
  entityDetailsButtonSelector,
  entityDetailsBackButtonSelector,
  entityCreateButtonSelector,
  entityCreateSaveButtonSelector,
  entityCreateCancelButtonSelector,
  entityEditButtonSelector,
  entityDeleteButtonSelector,
  entityConfirmDeleteButtonSelector,
} from '../../support/entity';

describe('Expenses e2e test', () => {
  const expensesPageUrl = '/expenses';
  const expensesPageUrlPattern = new RegExp('/expenses(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const expensesSample = { expenseType: 'Concrete quantifying', amount: 79290 };

  let expenses;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/expenses+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/expenses').as('postEntityRequest');
    cy.intercept('DELETE', '/api/expenses/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (expenses) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/expenses/${expenses.id}`,
      }).then(() => {
        expenses = undefined;
      });
    }
  });

  it('Expenses menu should load Expenses page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('expenses');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('Expenses').should('exist');
    cy.url().should('match', expensesPageUrlPattern);
  });

  describe('Expenses page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(expensesPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create Expenses page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/expenses/new$'));
        cy.getEntityCreateUpdateHeading('Expenses');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', expensesPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/expenses',
          body: expensesSample,
        }).then(({ body }) => {
          expenses = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/expenses+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [expenses],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(expensesPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details Expenses page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('expenses');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', expensesPageUrlPattern);
      });

      it('edit button click should load edit Expenses page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Expenses');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', expensesPageUrlPattern);
      });

      it('edit button click should load edit Expenses page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Expenses');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', expensesPageUrlPattern);
      });

      it('last delete button click should delete instance of Expenses', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('expenses').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', expensesPageUrlPattern);

        expenses = undefined;
      });
    });
  });

  describe('new Expenses page', () => {
    beforeEach(() => {
      cy.visit(`${expensesPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('Expenses');
    });

    it('should create an instance of Expenses', () => {
      cy.get(`[data-cy="expenseType"]`).type('Games red Home').should('have.value', 'Games red Home');

      cy.get(`[data-cy="amount"]`).type('835').should('have.value', '835');

      cy.get(`[data-cy="description"]`).type('purple').should('have.value', 'purple');

      cy.get(`[data-cy="date"]`).type('2023-04-14').blur().should('have.value', '2023-04-14');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(201);
        expenses = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(200);
      });
      cy.url().should('match', expensesPageUrlPattern);
    });
  });
});
