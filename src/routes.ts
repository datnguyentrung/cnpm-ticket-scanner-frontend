import { createBrowserRouter } from "react-router-dom";
import ScannerPage from "./pages/ScannerPage/ScannerPage";
import StaffHome from "./pages/StaffHome/StaffHome";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: StaffHome,
  },
  {
    path: "/scan",
    Component: ScannerPage,
  },
]);
