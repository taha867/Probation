/**
 * CommentActionsMenu - Dropdown menu for comment actions (Edit/Delete)
 * Reusable component following UserProfileMenu pattern
 * Only visible to comment author
 */
import { memo, useState, useRef, useEffect, useCallback } from "react";
import { MoreVertical, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const CommentActionsMenu = memo(({ onEdit, onDelete, disabled = false }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isMenuOpen]);

  // Close menu on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isMenuOpen]);

  const toggleMenu = useCallback(() => {
    setIsMenuOpen((prev) => !prev);
  }, []);

  const handleEdit = useCallback(() => {
    setIsMenuOpen(false);
    if (onEdit) {
      onEdit();
    }
  }, [onEdit]);

  const handleDelete = useCallback(() => {
    setIsMenuOpen(false);
    if (onDelete) {
      onDelete();
    }
  }, [onDelete]);

  return (
    <div className="relative" ref={menuRef}>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={toggleMenu}
        disabled={disabled}
        className="h-7 w-7 text-gray-500 hover:text-gray-700 hover:bg-gray-100"
        aria-label="Comment options"
        aria-expanded={isMenuOpen}
      >
        <MoreVertical className="h-4 w-4" />
      </Button>

      {/* Dropdown Menu */}
      {isMenuOpen && (
        <div className="absolute right-0 top-8 z-50 w-40 rounded-md shadow-lg bg-white border border-gray-200 py-1">
          <button
            type="button"
            onClick={handleEdit}
            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
            disabled={disabled}
          >
            <Edit className="h-4 w-4" />
            Edit
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
            disabled={disabled}
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </button>
        </div>
      )}
    </div>
  );
});


export default CommentActionsMenu;

