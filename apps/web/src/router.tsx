import { createRootRoute, createRoute, createRouter } from "@tanstack/react-router";
import { StudioShell } from "./components/studio-shell.js";
import { CheckInView } from "./views/check-in-view.js";
import { CompassView } from "./views/compass-view.js";
import { JournalView } from "./views/journal-view.js";
import { OdysseyView } from "./views/odyssey-view.js";
import { PrototypesView } from "./views/prototypes-view.js";
import { StudioOverviewView } from "./views/studio-overview-view.js";

const rootRoute = createRootRoute({
  component: StudioShell,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: StudioOverviewView,
});

const checkInRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/check-in",
  component: CheckInView,
});

const compassRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/compass",
  component: CompassView,
});

const journalRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/journal",
  component: JournalView,
});

const odysseyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/odyssey",
  component: OdysseyView,
});

const prototypesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/prototypes",
  component: PrototypesView,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  checkInRoute,
  compassRoute,
  journalRoute,
  odysseyRoute,
  prototypesRoute,
]);

export const router = createRouter({
  routeTree,
  defaultPreload: "intent",
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
