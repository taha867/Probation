import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UpdateProfileForm from "../components/profile/UpdateProfileForm";
import ChangePasswordForm from "../components/auth/form/ChangePasswordForm";
import { User, ShieldCheck } from "lucide-react";

const ProfileContainer = () => {
  return (
    <div className="container max-w-4xl mx-auto py-10 px-4">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Account Settings</h1>
        </div>

        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-2 lg:w-[400px] bg-zinc-100 p-1 rounded-xl mb-6">
            <TabsTrigger 
              value="general" 
              className="flex items-center gap-2 rounded-lg py-2.5 text-sm font-semibold transition-all data-[state=active]:bg-black data-[state=active]:text-white data-[state=active]:shadow-lg"
            >
              <User className="h-4 w-4" />
              General
            </TabsTrigger>
            <TabsTrigger 
              value="security" 
              className="flex items-center gap-2 rounded-lg py-2.5 text-sm font-semibold transition-all data-[state=active]:bg-black data-[state=active]:text-white data-[state=active]:shadow-lg"
            >
              <ShieldCheck className="h-4 w-4" />
              Security
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="general" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
              </CardHeader>
              <CardContent>
                <UpdateProfileForm />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="security" className="mt-6">
            <Card>
              <CardContent className="pt-6 flex flex-col items-center">
                <div className="w-full max-w-lg">
                   <ChangePasswordForm />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ProfileContainer;
