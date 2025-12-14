import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AuthTabs({ active, onChange, disableSignup }) {
  return (
    <Tabs value={active} onValueChange={onChange} className="mb-4">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="signin">Sign in</TabsTrigger>
        <TabsTrigger value="signup" disabled={disableSignup}>
          Sign up
        </TabsTrigger>
        <TabsTrigger value="forgot-password">Forgot Password</TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
