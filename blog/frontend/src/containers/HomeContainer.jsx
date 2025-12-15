/**
 * HomeContainer - Home page container
 */
import { useAuth } from "../hooks/authHooks";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Link } from "react-router-dom";
import { PenTool, Users, BookOpen, Zap } from "lucide-react";

function HomeContainer() {
  const { isAuthenticated, user } = useAuth();

  const features = [
    {
      icon: PenTool,
      title: "Write & Publish",
      description: "Create beautiful stories and share them with the world.",
    },
    {
      icon: Users,
      title: "Build Community",
      description: "Connect with readers and fellow writers in our community.",
    },
    {
      icon: BookOpen,
      title: "Discover Stories",
      description:
        "Explore a vast collection of stories from talented writers.",
    },
    {
      icon: Zap,
      title: "Easy to Use",
      description:
        "Simple, intuitive interface that lets you focus on writing.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Welcome to <span className="text-blue-600">Blogify</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            A platform where stories come to life. Write, share, and discover
            amazing content from writers around the world.
          </p>

          {isAuthenticated ? (
            <div className="space-y-4">
              <p className="text-lg text-gray-700">
                Welcome back,{" "}
                <span className="font-semibold">
                  {user?.name || user?.email}
                </span>
                !
              </p>
              <div className="flex gap-4 justify-center">
                <Link to="/dashboard">
                  <Button size="lg">Go to Dashboard</Button>
                </Link>
                <Link to="/blog">
                  <Button variant="outline" size="lg">
                    Browse Blog
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="flex gap-4 justify-center">
              <Link to="/auth">
                <Button size="lg">Get Started</Button>
              </Link>
              <Link to="/blog">
                <Button variant="outline" size="lg">
                  Explore Blog
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card
                key={index}
                className="text-center hover:shadow-lg transition-shadow"
              >
                <CardHeader>
                  <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{feature.description}</CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* CTA Section */}
        {!isAuthenticated && (
          <div className="text-center bg-white rounded-2xl p-12 shadow-lg">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Ready to start your writing journey?
            </h2>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              Join thousands of writers who are already sharing their stories on
              Blogify. Create your account today and start writing.
            </p>
            <Link to="/auth">
              <Button size="lg" className="px-8">
                Join Blogify Today
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default HomeContainer;
