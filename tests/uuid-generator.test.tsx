import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import UUIDGenerator from "@/components/uuid-generator/uuid-generator";

describe("UUID generator", () => {
  const originalRandomUUID = crypto.randomUUID;

  beforeEach(() => {
    Object.defineProperty(crypto, "randomUUID", {
      configurable: true,
      value: vi.fn(() => "123e4567-e89b-12d3-a456-426614174000"),
    });

    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockResolvedValue(undefined),
      },
    });
  });

  afterEach(() => {
    Object.defineProperty(crypto, "randomUUID", {
      configurable: true,
      value: originalRandomUUID,
    });
  });

  it("renders initial state", () => {
    render(<UUIDGenerator />);

    expect(screen.getByText(/click generate to create a uuid/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /generate uuid/i })).toBeEnabled();
    expect(screen.queryByRole("button", { name: /generate another/i })).toBeNull();
    expect(screen.getByRole("button", { name: /^copy$/i })).toBeDisabled();
  });

  it("generates a UUID and enables actions", () => {
    render(<UUIDGenerator />);

    fireEvent.click(screen.getByRole("button", { name: /generate uuid/i }));

    expect(screen.getByText("123e4567-e89b-12d3-a456-426614174000")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /generate another/i })).toBeEnabled();
    expect(screen.getByRole("button", { name: /^copy$/i })).toBeEnabled();
  });

  it("generates a new UUID when clicking generate another", () => {
    (crypto.randomUUID as ReturnType<typeof vi.fn>)
      .mockReturnValueOnce("123e4567-e89b-12d3-a456-426614174000")
      .mockReturnValueOnce("123e4567-e89b-12d3-a456-426614174001");

    render(<UUIDGenerator />);

    fireEvent.click(screen.getByRole("button", { name: /generate uuid/i }));
    expect(screen.getByText("123e4567-e89b-12d3-a456-426614174000")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /generate another/i }));
    expect(screen.getByText("123e4567-e89b-12d3-a456-426614174001")).toBeInTheDocument();
  });

  it("copies the UUID to clipboard", async () => {
    render(<UUIDGenerator />);

    fireEvent.click(screen.getByRole("button", { name: /generate uuid/i }));
    fireEvent.click(screen.getByRole("button", { name: /^copy$/i }));

    await waitFor(() => {
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
        "123e4567-e89b-12d3-a456-426614174000"
      );
    });

    expect(screen.getByRole("button", { name: /copied!/i })).toBeInTheDocument();
  });

  it("shows copy failed when clipboard rejects", async () => {
    (navigator.clipboard.writeText as ReturnType<typeof vi.fn>).mockRejectedValueOnce(
      new Error("no clipboard")
    );

    render(<UUIDGenerator />);

    fireEvent.click(screen.getByRole("button", { name: /generate uuid/i }));
    fireEvent.click(screen.getByRole("button", { name: /^copy$/i }));

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /copy failed/i })).toBeInTheDocument();
    });
  });
});
