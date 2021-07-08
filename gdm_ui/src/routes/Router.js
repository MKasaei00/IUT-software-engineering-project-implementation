import React, { Suspense, lazy } from "react";
import { Switch, Route } from "react-router-dom";

const Projects = lazy(() => import("../components/Projects/Projects"));

const AppBar = lazy(() => import("../components/AppBar/AppBar"));

const router = () => {
  return (
    <Suspense fallback={<div></div>}>
      <AppBar />
      <Switch>
        <Route path="/" exact component={Projects} />
      </Switch>
    </Suspense>
  );
};

export default router;
