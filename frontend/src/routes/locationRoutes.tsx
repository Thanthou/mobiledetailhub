import { Header } from "@/features/header";
import { HomePage } from "@/features/home";

export const locationRoutes = [
  // Location routes - use same components as main site
  {
    path: "/az/bullhead-city",
    element: (
      <>
        <Header />
        <HomePage />
      </>
    )
  },
  {
    path: "/nv/las-vegas",
    element: (
      <>
        <Header />
        <HomePage />
      </>
    )
  }
];
