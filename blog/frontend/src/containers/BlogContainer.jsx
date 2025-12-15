/**
 * BlogContainer - Blog listing container
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

export default function BlogContainer() {
  const { isAuthenticated } = useAuth();

  const blogPosts = [
    {
      id: 1,
      title: "Getting Started with React",
      excerpt:
        "Learn the basics of React and start building modern web applications.",
      author: "John Doe",
      date: "Dec 10, 2024",
      readTime: "5 min read",
    },
    {
      id: 2,
      title: "Advanced JavaScript Patterns",
      excerpt:
        "Explore advanced JavaScript patterns and best practices for modern development.",
      author: "Jane Smith",
      date: "Dec 8, 2024",
      readTime: "8 min read",
    },
    {
      id: 3,
      title: "Building RESTful APIs",
      excerpt:
        "A comprehensive guide to building scalable RESTful APIs with Node.js.",
      author: "Mike Johnson",
      date: "Dec 5, 2024",
      readTime: "12 min read",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Blog</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover stories, thinking, and expertise from writers on any topic.
          </p>
          {!isAuthenticated && (
            <div className="mt-8">
              <Link to="/auth">
                <Button size="lg">Start Writing</Button>
              </Link>
            </div>
          )}
        </div>

        {/* Blog Posts */}
        <div className="space-y-8">
          {blogPosts.map((post) => (
            <Card key={post.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
                  <span>{post.author}</span>
                  <span>
                    {post.date} · {post.readTime}
                  </span>
                </div>
                <CardTitle className="text-2xl hover:text-blue-600 cursor-pointer">
                  {post.title}
                </CardTitle>
                <CardDescription className="text-base">
                  {post.excerpt}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" size="sm">
                  Read More
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        {!isAuthenticated && (
          <div className="text-center mt-16 p-8 bg-white rounded-lg shadow-sm">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Ready to start writing?
            </h2>
            <p className="text-gray-600 mb-6">
              Join our community of writers and share your stories with the
              world.
            </p>
            <Link to="/auth">
              <Button size="lg">Get Started</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
