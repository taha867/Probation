import { useState } from 'react'
import { Button, Stack, TextField } from '@mui/material'

function SignupForm({ onSubmit, loading }) {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()
    onSubmit({ name, phone, email, password, confirmPassword })
  }

  return (
    <Stack component="form" gap={2} onSubmit={handleSubmit}>
      
      <TextField
        label="Full Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        fullWidth
      />

      <TextField
        label="Phone"
        type="tel"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        required
        fullWidth
      />

      <TextField
        label="Email"
        type="email"
        autoComplete="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        fullWidth
      />

      <TextField
        label="Password"
        type="password"
        autoComplete="new-password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        inputProps={{ minLength: 6 }}
        fullWidth
      />

      <TextField
        label="Confirm password"
        type="password"
        autoComplete="new-password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        required
        inputProps={{ minLength: 6 }}
        fullWidth
      />

      <Button type="submit" variant="contained" disabled={loading} size="large">
        {loading ? 'Creating account…' : 'Sign up'}
      </Button>
    </Stack>
  )
}

export default SignupForm
