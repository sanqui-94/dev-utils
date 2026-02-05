import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import JwtDecoderComponent from "@/components/jwt-decoder/jwt-decoder";

const buildJwt = (header: Record<string, unknown>, payload: Record<string, unknown>) => {
  const encode = (value: Record<string, unknown>) =>
    Buffer.from(JSON.stringify(value)).toString("base64url");
  return `${encode(header)}.${encode(payload)}.signature`;
};

describe("JWT decoder", () => {
  it("renders decoded header and payload JSON for a valid JWT", () => {
    render(<JwtDecoderComponent />);

    const token = buildJwt(
      { alg: "HS256", typ: "JWT" },
      { sub: "123", name: "Alice", aud: "dev-utils" }
    );

    fireEvent.change(screen.getByPlaceholderText(/paste a jwt/i), {
      target: { value: token },
    });

    expect(screen.getByText(/"alg": "HS256"/i)).toBeInTheDocument();
    expect(screen.getByText(/"name": "Alice"/i)).toBeInTheDocument();
  });

  it("shows claims tables when toggled", () => {
    render(<JwtDecoderComponent />);

    const token = buildJwt(
      { alg: "HS256", typ: "JWT" },
      { sub: "123", name: "Alice", aud: "dev-utils" }
    );

    fireEvent.change(screen.getByPlaceholderText(/paste a jwt/i), {
      target: { value: token },
    });

    const claimsButtons = screen.getAllByRole("button", {
      name: /claims table/i,
    });

    fireEvent.click(claimsButtons[0]);
    expect(screen.getByText("alg")).toBeInTheDocument();
    expect(screen.getByText("HS256")).toBeInTheDocument();

    fireEvent.click(claimsButtons[1]);
    expect(screen.getByText("name")).toBeInTheDocument();
    expect(screen.getByText("Alice")).toBeInTheDocument();
  });

  it("handles malformed tokens without rendering JSON", () => {
    render(<JwtDecoderComponent />);

    fireEvent.change(screen.getByPlaceholderText(/paste a jwt/i), {
      target: { value: "not.a.jwt" },
    });

    expect(screen.queryByText(/"alg":/i)).toBeNull();
    expect(screen.queryByText(/"name":/i)).toBeNull();
  });
});
