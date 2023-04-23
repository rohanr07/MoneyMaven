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

describe('Budget e2e test', () => {
  const budgetPageUrl = '/budget';
  const budgetPageUrlPattern = new RegExp('/budget(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const budgetSample = {
    name: 'Practical invoice',
    startDate: '2023-03-14T00:22:40.649Z',
    endDate: '2023-03-14T07:16:40.819Z',
    limit: 91339,
  };

  let budget;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/budgets+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/budgets').as('postEntityRequest');
    cy.intercept('DELETE', '/api/budgets/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (budget) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/budgets/${budget.id}`,
      }).then(() => {
        budget = undefined;
      });
    }
  });

  it('Budgets menu should load Budgets page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('budget');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('Budget').should('exist');
    cy.url().should('match', budgetPageUrlPattern);
  });

  describe('Budget page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(budgetPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create Budget page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/budget/new$'));
        cy.getEntityCreateUpdateHeading('Budget');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', budgetPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/budgets',
          body: budgetSample,
        }).then(({ body }) => {
          budget = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/budgets+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [budget],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(budgetPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details Budget page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('budget');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', budgetPageUrlPattern);
      });

      it('edit button click should load edit Budget page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Budget');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', budgetPageUrlPattern);
      });

      it('edit button click should load edit Budget page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Budget');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', budgetPageUrlPattern);
      });

      it('last delete button click should delete instance of Budget', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('budget').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', budgetPageUrlPattern);

        budget = undefined;
      });
    });
  });

  describe('new Budget page', () => {
    beforeEach(() => {
      cy.visit(`${budgetPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('Budget');
    });

    it('should create an instance of Budget', () => {
      cy.get(`[data-cy="name"]`).type('incubate cross-platform').should('have.value', 'incubate cross-platform');

      cy.get(`[data-cy="startDate"]`).type('2023-03-14T13:20').blur().should('have.value', '2023-03-14T13:20');

      cy.get(`[data-cy="endDate"]`).type('2023-03-14T08:34').blur().should('have.value', '2023-03-14T08:34');

      cy.get(`[data-cy="limit"]`).type('55224').should('have.value', '55224');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(201);
        budget = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(200);
      });
      cy.url().should('match', budgetPageUrlPattern);
    });
  });
});
