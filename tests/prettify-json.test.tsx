import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import PrettifyJson from "@/components/prettify-json/prettify-json";

describe("JSON prettifier", () => {
  beforeEach(() => {
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockResolvedValue(undefined),
      },
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("disables prettify when input is empty", () => {
    render(<PrettifyJson />);

    expect(screen.getByRole("button", { name: /prettify/i })).toBeDisabled();
  });

  it("prettifies JSON and replaces the input", () => {
    render(<PrettifyJson />);

    const input = "{\"a\":1,\"b\":{\"c\":2}}";
    const formatted = JSON.stringify({ a: 1, b: { c: 2 } }, null, 2);

    fireEvent.change(screen.getByPlaceholderText(/paste json to prettify/i), {
      target: { value: input },
    });

    fireEvent.click(screen.getByRole("button", { name: /prettify/i }));

    expect(screen.getByRole("textbox")).toHaveValue(formatted);
  });

  it("does nothing when input is unchanged", () => {
    const parseSpy = vi.spyOn(JSON, "parse");

    render(<PrettifyJson />);

    fireEvent.change(screen.getByPlaceholderText(/paste json to prettify/i), {
      target: { value: "{\"a\":1}" },
    });

    fireEvent.click(screen.getByRole("button", { name: /prettify/i }));
    fireEvent.click(screen.getByRole("button", { name: /prettify/i }));

    expect(parseSpy).toHaveBeenCalledTimes(1);
  });

  it("shows an error message on invalid JSON", () => {
    render(<PrettifyJson />);

    fireEvent.change(screen.getByPlaceholderText(/paste json to prettify/i), {
      target: { value: "{" },
    });

    fireEvent.click(screen.getByRole("button", { name: /prettify/i }));

    expect(
      screen.getByText(
        /invalid json\. please check that your input is valid json\./i
      )
    ).toBeInTheDocument();
  });

  it("clears input and disables actions", () => {
    render(<PrettifyJson />);

    fireEvent.change(screen.getByPlaceholderText(/paste json to prettify/i), {
      target: { value: "{\"a\":1}" },
    });

    fireEvent.click(screen.getByRole("button", { name: /clear/i }));

    expect(screen.getByRole("button", { name: /prettify/i })).toBeDisabled();
    expect(screen.getByRole("button", { name: /^copy$/i })).toBeDisabled();
  });

  it("copies the formatted JSON", async () => {
    render(<PrettifyJson />);

    const formatted = JSON.stringify({ a: 1 }, null, 2);

    fireEvent.change(screen.getByPlaceholderText(/paste json to prettify/i), {
      target: { value: "{\"a\":1}" },
    });

    fireEvent.click(screen.getByRole("button", { name: /prettify/i }));
    fireEvent.click(screen.getByRole("button", { name: /^copy$/i }));

    await waitFor(() => {
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(formatted);
    });
  });
});
