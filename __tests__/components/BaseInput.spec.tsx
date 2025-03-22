import React from "react";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { BaseInput } from "../../src/components/BaseInput";

describe("BaseInput", () => {
  test("рендэрлэгдэж, label зөв харагдана", () => {
    render(<BaseInput label="Нэр" value="" onChange={() => {}} />);
    const labelElement = screen.getByText("Нэр");
    expect(labelElement).toBeInTheDocument();
  });

  test("placeholder болон description зөв харагдана", () => {
    render(
      <BaseInput
        label="И-мэйл"
        value=""
        onChange={() => {}}
        placeholder="И-мэйл хаягаа оруулна уу"
        description="Таны и-мэйл хаяг"
      />,
    );
    const inputElement = screen.getByPlaceholderText(
      "И-мэйл хаягаа оруулна уу",
    );
    const descriptionElement = screen.getByText("Таны и-мэйл хаяг");
    expect(inputElement).toBeInTheDocument();
    expect(descriptionElement).toBeInTheDocument();
  });

  test("алдааны мессеж харагдаж, input дээр фокус хийгдэнэ", () => {
    render(
      <BaseInput
        label="Нууц үг"
        value=""
        onChange={() => {}}
        error="Нууц үг оруулна уу"
      />,
    );
    const errorElement = screen.getByText("Нууц үг оруулна уу");
    const inputElement = screen.getByLabelText("Нууц үг");
    expect(errorElement).toBeInTheDocument();
    expect(inputElement).toHaveFocus();
  });

  test("ARIA атрибутууд зөв тохируулагдсан", () => {
    render(
      <BaseInput
        label="Утасны дугаар"
        value=""
        onChange={() => {}}
        error="Утасны дугаар оруулна уу"
        description="Таны утасны дугаар"
      />,
    );
    const inputElement = screen.getByLabelText("Утасны дугаар");
    expect(inputElement).toHaveAttribute("aria-invalid", "true");
    expect(inputElement).toHaveAttribute("aria-describedby");
  });
});
