import { Github, Instagram, Twitter, Linkedin } from "lucide-react";
import { SOCIAL_LINKS } from "../utils/constants";

const Footer = () => {
  // Map icon names to Lucide components
  const iconMap = {
    GitHub: Github,
    Instagram: Instagram,
    Twitter: Twitter,
    LinkedIn: Linkedin,
  };

  return (
    <footer className="border-t bg-white">
      <div className="mx-auto flex max-w-6xl items-center px-4 py-8">
        {/* Center Text */}
        <div className="flex-1 flex justify-center">
          <p className="text-sm text-slate-500 text-center">
            Stories, tutorials, and news from the blog community.
          </p>
        </div>

        {/* Social Links - Extreme Right */}
        <div className="flex-shrink-0">
          <div className="flex items-center gap-4">
            {SOCIAL_LINKS.map((social) => {
              const Icon = iconMap[social.name];
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
};

export default Footer;
