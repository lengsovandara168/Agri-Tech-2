"use client";
import React from "react";
import Image from "next/image";
import ThemeToggle from "./ThemeToggle";
const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "";
import { User, PanelLeftDashed } from "lucide-react";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";

type ChatHeaderProps = {
  onOpenSidebarAction: () => void;
  title?: string;
};

export default function ChatHeader({
  onOpenSidebarAction,
  title = "Agri-ChatBot",
}: ChatHeaderProps) {
  const logout = async () => {
    try {
      await fetch(`${API_BASE}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("Logout failed:", error);
    }
    if (typeof window !== "undefined") window.location.href = "/login";
  };

  return (
    <header
      role="banner"
      className="flex h-16 flex-shrink-0 items-center justify-between border-b border-zinc-200/80 bg-white/70 px-4 backdrop-blur-lg dark:border-slate-800 dark:bg-slate-900"
    >
      {/* Left side: Sidebar Toggle and Title */}
      <div className="flex items-center gap-2">
        <button
          aria-label="Toggle sidebar"
          onClick={onOpenSidebarAction}
          className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded-md border border-zinc-300 text-zinc-700 shadow-sm transition-colors duration-150 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
        >
          <PanelLeftDashed className="h-5 w-5 " />
        </button>
        <Image
          src="/web-images/agribot-logo.png"
          alt="Agri-Tech Logo"
          width={32}
          height={32}
          className="h-8 w-auto"
          priority
        />

        <h1 className="hidden sm:block text-lg font-semibold text-zinc-800 dark:text-zinc-200">
          {title}
        </h1>
      </div>

      {/* Right side: Theme Toggle and User Menu */}
      <div className="flex items-center gap-2">
        <ThemeToggle />

        <Menu>
          <MenuButton className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-zinc-300 text-zinc-700 shadow-sm transition-colors duration-150 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800">
            <User size={20} />
            <span className="sr-only">User menu</span>
          </MenuButton>
          <MenuItems
            transition
            anchor="bottom end"
            className="mt-1 w-32 origin-top-end rounded-md border border-zinc-200/80 bg-white/70 p-1 text-sm shadow-lg outline-none backdrop-blur-lg transition duration-200 ease-out [--anchor-gap:4px] data-[closed]:scale-95 data-[closed]:opacity-0 dark:border-zinc-800/80 dark:bg-zinc-950/70"
          >
            <MenuItem>
              {({ focus }: { focus: boolean }) => (
                <button
                  onClick={logout}
                  className={`block w-full rounded px-2 py-1.5 text-left font-medium ${
                    focus
                      ? "bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200"
                      : "text-zinc-700 dark:text-zinc-300"
                  }`}
                >
                  Log out
                </button>
              )}
            </MenuItem>
          </MenuItems>
        </Menu>
      </div>
    </header>
  );
}
