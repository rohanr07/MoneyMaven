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

describe('Expense e2e test', () => {
  const expensePageUrl = '/expense';
  const expensePageUrlPattern = new RegExp('/expense(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const expenseSample = { expenseType: 'Orchard', amount: 57184 };

  let expense;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/expenses+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/expenses').as('postEntityRequest');
    cy.intercept('DELETE', '/api/expenses/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (expense) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/expenses/${expense.id}`,
      }).then(() => {
        expense = undefined;
      });
    }
  });

  it('Expenses menu should load Expenses page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('expense');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('Expense').should('exist');
    cy.url().should('match', expensePageUrlPattern);
  });

  describe('Expense page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(expensePageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create Expense page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/expense/new$'));
        cy.getEntityCreateUpdateHeading('Expense');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', expensePageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/expenses',
          body: expenseSample,
        }).then(({ body }) => {
          expense = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/expenses+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [expense],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(expensePageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details Expense page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('expense');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', expensePageUrlPattern);
      });

      it('edit button click should load edit Expense page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Expense');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', expensePageUrlPattern);
      });

      it('edit button click should load edit Expense page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Expense');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', expensePageUrlPattern);
      });

      it('last delete button click should delete instance of Expense', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('expense').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', expensePageUrlPattern);

        expense = undefined;
      });
    });
  });

  describe('new Expense page', () => {
    beforeEach(() => {
      cy.visit(`${expensePageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('Expense');
    });

    it('should create an instance of Expense', () => {
      cy.get(`[data-cy="expenseType"]`).type('Gorgeous Open-source').should('have.value', 'Gorgeous Open-source');

      cy.get(`[data-cy="amount"]`).type('22153').should('have.value', '22153');

      cy.get(`[data-cy="description"]`).type('withdrawal Central withdrawal').should('have.value', 'withdrawal Central withdrawal');

      cy.get(`[data-cy="date"]`).type('2023-04-22').blur().should('have.value', '2023-04-22');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(201);
        expense = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(200);
      });
      cy.url().should('match', expensePageUrlPattern);
    });
  });
});
