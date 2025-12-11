import { useState } from 'react'
import { Button, Stack, TextField } from '@mui/material'

function SigninForm({ onSubmit, loading }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()
    onSubmit({ email, password })
  }

  return (
    <Stack component="form" gap={2} onSubmit={handleSubmit}>
      <TextField
        label="Email"
        type="email"
        autoComplete="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        required
        fullWidth
      />
      <TextField
        label="Password"
        type="password"
        autoComplete="current-password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        required
        fullWidth
      />
      <Button type="submit" variant="contained" disabled={loading} size="large">
        {loading ? 'Signing in…' : 'Sign in'}
      </Button>
    </Stack>
  )
}

export default SigninForm

