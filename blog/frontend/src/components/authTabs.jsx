import { Tab, Tabs } from '@mui/material'

function AuthTabs({ active, onChange, disableSignup }) {
  return (
    <Tabs
      value={active}
      onChange={(_, newValue) => onChange(newValue)}
      textColor="primary"
      indicatorColor="primary"
      sx={{ mb: 2 }}
    >
      <Tab value="signin" label="Sign in" />
      <Tab value="signup" label="Sign up" disabled={disableSignup} />
    </Tabs>
  )
}

export default AuthTabs

