import { Tabs, TabsList, TabsTrigger } from "./custom/tabs";

function AuthTabs({ active, onChange, disableSignup }) {
  return (
    <Tabs value={active} onValueChange={onChange} className="mb-4">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="signin">Sign in</TabsTrigger>
        <TabsTrigger value="signup" disabled={disableSignup}>
          Sign up
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}

export default AuthTabs;
