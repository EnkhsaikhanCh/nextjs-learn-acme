describe("Login Page", () => {
  beforeEach(() => {
    cy.visit("/login");
  });

  it("renders the login form", () => {
    cy.get('[data-testid="login-email-input"]').should("exist");
    cy.get('[data-testid="login-password-input"]').should("exist");
    cy.get('[data-testid="login-button"]').should("exist");
  });

  it("logs in with valid credentials", () => {
    cy.get('[data-testid="login-email-input"]').type("example-test@email.com");
    cy.get('[data-testid="login-password-input"]').type("12345678");
    cy.get('[data-testid="login-button"]').click();

    // 🎯 Энд login амжилттай болсон эсэхийг шалгах:
    cy.url().should("include", "/dashboard"); // эсвэл таны redirect хуудас
  });
});
