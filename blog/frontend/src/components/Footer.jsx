import { Github, Instagram, Twitter, Linkedin } from "lucide-react";

export default function Footer() {
  const socialLinks = [
    {
      name: "GitHub",
      href: "https://github.com",
      icon: Github,
    },
    {
      name: "Instagram",
      href: "https://instagram.com",
      icon: Instagram,
    },
    {
      name: "Twitter",
      href: "https://twitter.com",
      icon: Twitter,
    },
    {
      name: "LinkedIn",
      href: "https://linkedin.com",
      icon: Linkedin,
    },
  ];

  return (
    <footer className="border-t bg-white">
      <div className="mx-auto flex max-w-6xl items-center px-4 py-8">
        {/* Logo/Brand - Extreme Left */}
        <div className="flex-shrink-0">
          <div className="flex items-center gap-2 text-lg font-semibold text-slate-900">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white font-bold">
              B
            </span>
            Blogify
          </div>
        </div>

        {/* Center Text */}
        <div className="flex-1 flex justify-center">
          <p className="text-sm text-slate-500 text-center">
            Stories, tutorials, and news from the blog community.
          </p>
        </div>

        {/* Social Links - Extreme Right */}
        <div className="flex-shrink-0">
          <div className="flex items-center gap-4">
            {socialLinks.map((social) => {
              const Icon = social.icon;
              return (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-400 hover:text-slate-600 transition-colors"
                  aria-label={social.name}
                >
                  <Icon className="h-5 w-5" />
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </footer>
  );
}
