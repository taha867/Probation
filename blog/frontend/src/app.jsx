import { useMemo, useState } from "react";
import SigninForm from "./components/SigninForm.jsx";
import SignupForm from "./components/SignupForm";
import AuthTabs from "./components/AuthTabs";
import Dashboard from "./components/Dashboard";
import { useAuth } from "./hooks/authHooks";
import { Alert, AlertDescription } from "./components/custom/alert";
import { Card, CardContent } from "./components/custom/card";

// cva lets you define different styles based on the variant prop.
// variant="destructive" → red alert
// variant="success" → green alert
// variant="default" → normal alert

function StatusAlert({ error, message }) {
  if (!error && !message) return null;
  return (
    <Alert variant={error ? "destructive" : "success"} className="mt-4">
      <AlertDescription>{error || message}</AlertDescription>
    </Alert>
  );
}

function App() {
  const {
    user,
    error,
    message,
    isLoading,
    signin,
    signup,
    signout,
    clearMessages,
  } = useAuth();
  const [view, setView] = useState("signin");

  const handleSignin = async (credentials) => {
    clearMessages();
    try {
      await signin(credentials);
    } catch (err) {
      // Error is already handled by the useAuth hook
      console.error("Signin error:", err);
    }
  };

  const handleSignup = async (userData) => {
    clearMessages();
    try {
      await signup(userData);
    } catch (err) {
      // Error is already handled by the useAuth hook
      console.error("Signup error:", err);
    }
  };

  const handleSignout = () => {
    signout();
    setView("signin");
  };

  const canAccessSignup = useMemo(() => !user, [user]);

  return (
    <div className="container max-w-md mx-auto py-10 px-4">
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <p className="text-sm text-muted-foreground uppercase tracking-wide">
            React 19 Auth Demo
          </p>
          <h1 className="text-3xl font-bold">User Accounts</h1>
          <p className="text-muted-foreground">
            Sign up, sign in, sign out, and keep the session on reload.
          </p>
        </div>

        <Card className="shadow-lg">
          <CardContent className="p-6">
            {user ? (
              <Dashboard user={user} onSignout={handleSignout} />
            ) : (
              <>
                <AuthTabs
                  active={view}
                  onChange={setView}
                  disableSignup={!canAccessSignup}
                />
                {view === "signup" ? (
                  <SignupForm onSubmit={handleSignup} loading={isLoading} />
                ) : (
                  <SigninForm onSubmit={handleSignin} loading={isLoading} />
                )}
              </>
            )}
            <StatusAlert error={error} message={message} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default App;
