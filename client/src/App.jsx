import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "./components/ui/toaster";
import { TooltipProvider } from "./components/ui/tooltip";
import { AuthProvider } from "./context/AuthContext";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import WasteClassification from "./pages/WasteClassification";
import Campaigns from "./pages/Campaigns";
import Blog from "./pages/Blog";
import Leaderboard from "./pages/Leaderboard";
import Profile from "./pages/Profile";
import AdminDashboard from "./pages/admin/AdminDashboard";
import NotFound from "./pages/not-found";
import BlogDetail from "./pages/BlogDetail";

import './App.css'

function Router() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} />
          <Route path="/classify">
            {/* <ProtectedRoute> */}
              <WasteClassification />
            {/* </ProtectedRoute> */}
          </Route>
          <Route path="/campaigns" component={Campaigns} />
          <Route path="/blog" component={Blog} />
          <Route path="/leaderboard" component={Leaderboard} />
          <Route path="/profile">
            {/* <ProtectedRoute> */}
              <Profile />
            {/* </ProtectedRoute> */}
          </Route>
          <Route path="/blog/:id" component={BlogDetail} />
          <Route path="/admin">
            {/* <ProtectedRoute requireAdmin> */}
              <AdminDashboard />
            {/* </ProtectedRoute> */}
          </Route>
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
