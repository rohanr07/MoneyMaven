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

describe('Income e2e test', () => {
  const incomePageUrl = '/income';
  const incomePageUrlPattern = new RegExp('/income(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const incomeSample = { amount: 16682, companyName: 'Games Auto' };

  let income;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/incomes+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/incomes').as('postEntityRequest');
    cy.intercept('DELETE', '/api/incomes/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (income) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/incomes/${income.id}`,
      }).then(() => {
        income = undefined;
      });
    }
  });

  it('Incomes menu should load Incomes page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('income');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('Income').should('exist');
    cy.url().should('match', incomePageUrlPattern);
  });

  describe('Income page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(incomePageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create Income page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/income/new$'));
        cy.getEntityCreateUpdateHeading('Income');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', incomePageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/incomes',
          body: incomeSample,
        }).then(({ body }) => {
          income = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/incomes+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [income],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(incomePageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details Income page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('income');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', incomePageUrlPattern);
      });

      it('edit button click should load edit Income page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Income');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', incomePageUrlPattern);
      });

      it('edit button click should load edit Income page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Income');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', incomePageUrlPattern);
      });

      it('last delete button click should delete instance of Income', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('income').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', incomePageUrlPattern);

        income = undefined;
      });
    });
  });

  describe('new Income page', () => {
    beforeEach(() => {
      cy.visit(`${incomePageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('Income');
    });

    it('should create an instance of Income', () => {
      cy.get(`[data-cy="amount"]`).type('11294').should('have.value', '11294');

      cy.get(`[data-cy="companyName"]`).type('Enterprise-wide').should('have.value', 'Enterprise-wide');

      cy.get(`[data-cy="date"]`).type('2023-04-21').blur().should('have.value', '2023-04-21');

      cy.get(`[data-cy="currency"]`).select('USD');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(201);
        income = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(200);
      });
      cy.url().should('match', incomePageUrlPattern);
    });
  });
});
