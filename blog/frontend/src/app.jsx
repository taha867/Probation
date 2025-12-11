import { useMemo, useState } from "react";
import { Alert, Box, Container, Paper, Stack, Typography } from "@mui/material";
import { jwtDecode } from "jwt-decode";
import SigninForm from "./components/signinForm";
import SignupForm from "./components/signupForm";
import AuthTabs from "./components/authTabs";
import Dashboard from "./components/dashboard";
import { useAuthState, useAuthDispatch } from "./utils/authContext";

const TOKEN_KEY = "auth_token";

async function apiRequest(url, body) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Request failed");
  }
  return res.json();
}

function StatusAlert({ error, message }) {
  if (!error && !message) return null;
  return (
    <Alert
      sx={{ mt: 2 }}
      severity={error ? "error" : "success"}
      variant="outlined"
    >
      {error || message}
    </Alert>
  );
}

function ComponentA() {
  useEffect(() => {
    console.log("Displaying Component A");
  }, []);

  return <ComponentB />;
}

function ComponentB() {
  useEffect(() => {
    console.log("Displaying Component ");
  }, []);

  return <ComponentB />;
}

function ComponentC() {
  useEffect(() => {
    console.log("Displaying Component A");
  }, []);

  return <p>12345</p>;
}

function App() {
  const { user, status, error, message } = useAuthState();
  const dispatch = useAuthDispatch();
  const [view, setView] = useState("signin");

  const resetAlerts = () => dispatch({ type: "AUTH_ERROR", payload: "" });

  const handleSignin = async ({ email, password }) => {
    resetAlerts();
    dispatch({ type: "LOGIN_START" });

    try {
      const data = await apiRequest("http://localhost:3000/auth/login", {
        email,
        password,
      });

      localStorage.setItem(TOKEN_KEY, data.data.accessToken);
      const decodedUser = jwtDecode(data.data.accessToken);
      dispatch({
        type: "LOGIN_SUCCESS",
        payload: {
          user: decodedUser,
          token: data.data.accessToken,
          message: data.data.message,
        },
      });
    } catch (err) {
      dispatch({ type: "AUTH_ERROR", payload: err.message });
    }
  };

  const handleSignup = async ({
    name,
    phone,
    email,
    password,
    confirmPassword,
  }) => {
    resetAlerts();
    if (password !== confirmPassword) {
      dispatch({ type: "AUTH_ERROR", payload: "Passwords do not match" });
      return;
    }
    dispatch({ type: "SIGNUP_START" });

    try {
      const data = await apiRequest("http://localhost:3000/auth/register", {
        name,
        phone,
        email,
        password,
      });
      dispatch({
        type: "SIGNUP_SUCCESS",
        payload: { message: data.data.message },
      });
    } catch (err) {
      dispatch({ type: "AUTH_ERROR", payload: err.message });
    }
  };

  const handleSignout = () => {
    localStorage.removeItem(TOKEN_KEY);
    dispatch({ type: "LOGOUT" });
    setView("signin");
  };

  const canAccessSignup = useMemo(() => !user, [user]);

  return (
    <Container maxWidth="sm" sx={{ py: 5, px: 2.5 }}>
      <Stack spacing={2.5}>
        <Box>
          <Typography variant="overline" color="text.secondary">
            React 19 Auth Demo
          </Typography>
          <Typography variant="h4" component="h1" sx={{ mt: 0.5 }}>
            User Accounts
          </Typography>
          <Typography color="text.secondary">
            Sign up, sign in, sign out, and keep the session on reload.
          </Typography>
        </Box>

        <Paper elevation={3} sx={{ p: 3 }}>
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
                <SignupForm
                  onSubmit={handleSignup}
                  loading={status === "busy"}
                />
              ) : (
                <SigninForm
                  onSubmit={handleSignin}
                  loading={status === "busy"}
                />
              )}
            </>
          )}
          <StatusAlert error={error} message={message} />
        </Paper>
      </Stack>
    </Container>
  );
  // return <ComponentA/>
}

export default App;
