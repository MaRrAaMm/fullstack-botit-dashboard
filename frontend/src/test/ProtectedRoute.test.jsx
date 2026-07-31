import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";
import { ProtectedRoute } from "#components/ProtectedRoute";

vi.mock("#contexts/AuthContext", () => ({
  useAuth: vi.fn(),
}));

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    Navigate: ({ to }) => <div>Redirect:{to}</div>,
  };
});

import { useAuth } from "#contexts/AuthContext";

describe("ProtectedRoute", () => {
  test("should render children when user is authenticated", () => {
    useAuth.mockReturnValue({
      loading: false,
      isAuthenticated: true,
      isAdmin: false,
    });

    render(
      <MemoryRouter>
        <ProtectedRoute>
          <h1>Dashboard</h1>
        </ProtectedRoute>
      </MemoryRouter>
    );
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
  });
});

test("should show loading skeleton", () => {
  useAuth.mockReturnValue({
    loading: true,
    isAuthenticated: false,
    isAdmin: false,
  });

  render(
    <MemoryRouter>
      <ProtectedRoute>
        <h1>Dashboard</h1>
      </ProtectedRoute>
    </MemoryRouter>
  );
  expect(document.querySelector(".animate-pulse")).toBeInTheDocument();
});

test("should redirect unauthenticated user to login", () => {
  useAuth.mockReturnValue({
    loading: false,
    isAuthenticated: false,
    isAdmin: false,
  });

  render(
    <MemoryRouter>
      <ProtectedRoute>
        <h1>Dashboard</h1>
      </ProtectedRoute>
    </MemoryRouter>
  );

  expect(screen.getByText("Redirect:/login")).toBeInTheDocument();
});

test("should redirect non-admin user from admin route", () => {
  useAuth.mockReturnValue({
    loading: false,
    isAuthenticated: true,
    isAdmin: false,
  });

  render(
    <MemoryRouter>
      <ProtectedRoute adminOnly={true}>
        <h1>Dashboard</h1>
      </ProtectedRoute>
    </MemoryRouter>
  );

  expect(screen.getByText("Redirect:/")).toBeInTheDocument();
});