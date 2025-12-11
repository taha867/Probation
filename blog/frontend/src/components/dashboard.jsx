import { Button, Stack, Typography } from "@mui/material";

function Dashboard({ user, onSignout }) {
  return (
    <Stack gap={1.5}>
      <Typography variant="h5" component="h2">
        Welcome back
      </Typography>

      <Typography color="text.secondary">Signed in as {user.email}</Typography>

      <Stack direction="row" gap={1}>
        <Button variant="outlined" onClick={onSignout}>
          Sign out
        </Button>
      </Stack>
    </Stack>
  );
}

export default Dashboard;
