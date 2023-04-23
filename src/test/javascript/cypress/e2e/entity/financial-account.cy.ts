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

describe('FinancialAccount e2e test', () => {
  const financialAccountPageUrl = '/financial-account';
  const financialAccountPageUrlPattern = new RegExp('/financial-account(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const financialAccountSample = { name: 'definition', balance: 92009, type: 'CHECKING' };

  let financialAccount;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/financial-accounts+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/financial-accounts').as('postEntityRequest');
    cy.intercept('DELETE', '/api/financial-accounts/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (financialAccount) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/financial-accounts/${financialAccount.id}`,
      }).then(() => {
        financialAccount = undefined;
      });
    }
  });

  it('FinancialAccounts menu should load FinancialAccounts page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('financial-account');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('FinancialAccount').should('exist');
    cy.url().should('match', financialAccountPageUrlPattern);
  });

  describe('FinancialAccount page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(financialAccountPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create FinancialAccount page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/financial-account/new$'));
        cy.getEntityCreateUpdateHeading('FinancialAccount');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', financialAccountPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/financial-accounts',
          body: financialAccountSample,
        }).then(({ body }) => {
          financialAccount = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/financial-accounts+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [financialAccount],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(financialAccountPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details FinancialAccount page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('financialAccount');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', financialAccountPageUrlPattern);
      });

      it('edit button click should load edit FinancialAccount page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('FinancialAccount');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', financialAccountPageUrlPattern);
      });

      it('edit button click should load edit FinancialAccount page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('FinancialAccount');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', financialAccountPageUrlPattern);
      });

      it('last delete button click should delete instance of FinancialAccount', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('financialAccount').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', financialAccountPageUrlPattern);

        financialAccount = undefined;
      });
    });
  });

  describe('new FinancialAccount page', () => {
    beforeEach(() => {
      cy.visit(`${financialAccountPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('FinancialAccount');
    });

    it('should create an instance of FinancialAccount', () => {
      cy.get(`[data-cy="name"]`).type('Chair blockchains').should('have.value', 'Chair blockchains');

      cy.get(`[data-cy="balance"]`).type('71629').should('have.value', '71629');

      cy.get(`[data-cy="type"]`).select('SAVINGS');

      cy.get(`[data-cy="description"]`).type('invoice quantify').should('have.value', 'invoice quantify');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(201);
        financialAccount = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(200);
      });
      cy.url().should('match', financialAccountPageUrlPattern);
    });
  });
});
