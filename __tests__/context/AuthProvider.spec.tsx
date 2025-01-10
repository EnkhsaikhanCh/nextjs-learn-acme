import React from "react";
import { render, screen, waitFor, act } from "@testing-library/react";
import { MockedProvider } from "@apollo/client/testing";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";

import { AuthProvider } from "../../src/context/AuthProvider";
import { AuthContext } from "../../src/context/AuthContext";
import { ME_QUERY } from "../../src/context/AuthProvider";
import { CreateUserDocument, LoginUserDocument } from "@/generated/graphql";

// --------------
// 1) Setup Mocks
// --------------

const mockMeSuccess = {
  request: {
    query: ME_QUERY,
  },
  result: {
    data: {
      me: {
        _id: "123",
        email: "test@example.com",
        role: "USER",
      },
    },
  },
};

const mockRefetchMeSuccess = {
  request: {
    query: ME_QUERY,
  },
  result: {
    data: {
      me: {
        _id: "456",
        email: "newuser@example.com",
        role: "USER",
      },
    },
  },
};

const mockMeError = {
  request: {
    query: ME_QUERY,
  },
  error: new Error("Me query failed"),
};

const mockSignupSuccess = {
  request: {
    query: CreateUserDocument,
    variables: {
      input: { email: "newuser@example.com", password: "password123" },
    },
  },
  result: {
    data: {
      createUser: {
        token: "signup-token",
      },
    },
  },
};

const mockSignupError = {
  request: {
    query: CreateUserDocument,
    variables: {
      input: { email: "newuser@example.com", password: "password123" },
    },
  },
  error: new Error("Signup error"),
};

const mockLoginSuccess = {
  request: {
    query: LoginUserDocument,
    variables: {
      input: { email: "loginuser@example.com", password: "password123" },
    },
  },
  result: {
    data: {
      loginUser: {
        token: "login-token",
      },
    },
  },
};

const mockLoginError = {
  request: {
    query: LoginUserDocument,
    variables: {
      input: { email: "loginuser@example.com", password: "password123" },
    },
  },
  error: new Error("Login error"),
};

function renderWithAuthProvider(mocks: any[] = []) {
  let capturedContext: any;

  const TestConsumer = () => {
    const context = React.useContext(AuthContext);
    capturedContext = context;
    return <div>Test Consumer</div>;
  };

  render(
    <MockedProvider mocks={mocks} addTypename={false}>
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    </MockedProvider>,
  );

  return { getContext: () => capturedContext };
}

// --------------
// 2) Test Suites
// --------------

describe("AuthProvider", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("renders children correctly", async () => {
    render(
      <MockedProvider>
        <AuthProvider>
          <div data-testid="child-content">Hello Auth!</div>
        </AuthProvider>
      </MockedProvider>,
    );

    expect(await screen.findByTestId("child-content")).toHaveTextContent(
      "Hello Auth!",
    );
  });

  it("fetches current user (me query) on mount successfully", async () => {
    const { getContext } = renderWithAuthProvider([mockMeSuccess]);

    await waitFor(() => {
      expect(getContext().user).toBeTruthy();
      expect(getContext().user?.email).toBe("test@example.com");
      expect(getContext().error).toBeNull();
      expect(getContext().loading).toBe(false);
    });
  });

  it("handles error if me query fails on mount", async () => {
    const { getContext } = renderWithAuthProvider([mockMeError]);

    await waitFor(() => {
      expect(getContext().user).toBeNull();
      expect(getContext().error).toBe("Me query failed");
      expect(getContext().loading).toBe(false);
    });
  });

  it("shows error if signup fails", async () => {
    const { getContext } = renderWithAuthProvider([
      // me query first
      {
        request: { query: ME_QUERY },
        result: { data: { me: null } },
      },
      // signup error
      mockSignupError,
    ]);

    await act(async () => {
      await getContext().signup("newuser@example.com", "password123");
    });

    expect(getContext().error).toBe("Signup error");
    expect(getContext().user).toBeNull();
    expect(localStorage.getItem("authToken")).toBeNull();
  });

  it("shows error if login fails", async () => {
    const { getContext } = renderWithAuthProvider([
      // me query first
      {
        request: { query: ME_QUERY },
        result: { data: { me: null } },
      },
      // login error
      mockLoginError,
    ]);

    await act(async () => {
      await getContext().login("loginuser@example.com", "password123");
    });

    expect(getContext().error).toBe("Login error");
    expect(getContext().user).toBeNull();
    expect(localStorage.getItem("authToken")).toBeNull();
  });
});
