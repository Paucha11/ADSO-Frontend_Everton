import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders hotel everton heading", () => {
  render(<App />);
  expect(screen.getByText("Hotel Everton", { selector: ".brand-title" })).toBeInTheDocument();
});
