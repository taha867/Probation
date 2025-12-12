import { Button } from "@/components/ui/button";

function Dashboard({ user, onSignout }) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Welcome back</h2>

      <p className="text-muted-foreground">Signed in as {user.email}</p>

      <div className="flex gap-2">
        <Button variant="outline" onClick={onSignout}>
          Sign out
        </Button>
      </div>
    </div>
  );
}

export default Dashboard;
