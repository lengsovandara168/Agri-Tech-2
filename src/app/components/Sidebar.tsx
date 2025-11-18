"use client";
import React, { useState } from "react";
import {
  PanelLeftDashed,
  Pencil,
  Trash2,
  Check,
  X,
  MessageSquarePlus,
  History,
  Settings,
  HelpCircle,
  ChevronDown,
} from "lucide-react";
import { ChatTitle } from "./types";

type SidebarProps = {
  chatTitles: ChatTitle[];
  activeChatId: number | null;
  onNewChatAction: () => void;
  onSelectChatAction: (id: number) => void;
  onRenameChatAction: (
    id: number,
    newTitle: string
  ) => Promise<boolean> | boolean;
  onDeleteChatAction?: (id: number) => Promise<boolean> | boolean;
  sidebarOpen: boolean;
  setSidebarOpenAction: (v: boolean) => void;
  logoSrc: string; // Keep logoSrc prop, but we won't display it in Gemini style
};

// Reusable button for the bottom action menu
const ActionMenuButton = ({
  onClick,
  icon,
  label,
  isCollapsed,
}: {
  onClick?: () => void;
  icon: React.ReactNode;
  label: string;
  isCollapsed: boolean;
}) => (
  <button
    onClick={onClick}
    className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-200/70 dark:text-zinc-300 dark:hover:bg-zinc-800"
  >
    {icon}
    {!isCollapsed && <span className="truncate">{label}</span>}
  </button>
);

// Reusable button for edit/delete actions
const ChatActionButton = ({
  onClick,
  children,
  className = "",
}: {
  onClick: (e: React.MouseEvent) => void;
  children: React.ReactNode;
  className?: string;
}) => (
  <button
    onClick={onClick}
    className={`flex h-7 w-7 items-center justify-center rounded-md text-zinc-500 transition-colors hover:bg-zinc-200 hover:text-zinc-700 dark:hover:bg-zinc-700 dark:hover:text-zinc-200 ${className}`}
  >
    {children}
  </button>
);

export default function Sidebar({
  chatTitles,
  activeChatId,
  onNewChatAction,
  onSelectChatAction,
  onRenameChatAction,
  onDeleteChatAction,
  sidebarOpen,
  setSidebarOpenAction,
}: SidebarProps) {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [draft, setDraft] = useState("");
  const [savingId, setSavingId] = useState<number | null>(null);
  const [isHistoryVisible, setIsHistoryVisible] = useState(true);

  const startEdit = (chat: ChatTitle) => {
    setEditingId(chat.chat_id);
    setDraft(chat.title);
  };
  const cancelEdit = () => {
    setEditingId(null);
    setDraft("");
  };
  const commitEdit = async (chatId: number) => {
    const val = draft.trim();
    if (!val) return cancelEdit();
    setSavingId(chatId);
    const ok = await onRenameChatAction(chatId, val);
    setSavingId(null);
    if (ok) cancelEdit();
  };

  const cx = (...classes: (string | false | undefined)[]) =>
    classes.filter(Boolean).join(" ");

  const sidebarContent = (isCollapsed: boolean) => (
    <div className="flex h-full flex-col p-2">
      {/* Top Section: Toggle and New Chat */}
      <div
        className={cx(
          "flex items-center",
          isCollapsed ? "justify-center" : "justify-between"
        )}
      >
        <button
          onClick={() => setSidebarOpenAction(!sidebarOpen)}
          className="rounded-md p-2.5 text-zinc-600 transition-colors hover:bg-zinc-200 dark:text-zinc-400 dark:hover:bg-zinc-800"
        >
          <PanelLeftDashed size={20} />
        </button>
        {!isCollapsed && (
          <button
            onClick={onNewChatAction}
            className="flex items-center gap-2 rounded-md bg-emerald-600 px-3 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700"
          >
            <MessageSquarePlus size={16} />
            New Chat
          </button>
        )}
      </div>

      {/* Middle Section: Chat History */}
      <div className="mt-4 flex-1 overflow-hidden">
        {!isCollapsed && (
          <>
            <button
              onClick={() => setIsHistoryVisible(!isHistoryVisible)}
              className="flex w-full items-center justify-between px-3 pb-2 text-xs font-semibold uppercase text-zinc-500 transition-colors hover:text-zinc-600 dark:hover:text-zinc-400"
            >
              <span>History</span>
              <ChevronDown
                size={16}
                className={cx(
                  "transition-transform duration-200",
                  !isHistoryVisible && "-rotate-90"
                )}
              />
            </button>
            <div
              className={cx(
                "space-y-1.5 overflow-y-auto transition-all duration-300 ease-in-out",
                isHistoryVisible
                  ? "max-h-full opacity-100"
                  : "max-h-0 opacity-0"
              )}
            >
              {(chatTitles || []).map((c) => {
                const isActive = activeChatId === c.chat_id;
                const isEditing = editingId === c.chat_id;
                return (
                  <div
                    key={c.chat_id}
                    onClick={() => {
                      if (isEditing) return;
                      onSelectChatAction(c.chat_id);
                    }}
                    className={cx(
                      "group flex w-full cursor-pointer items-center justify-between rounded-md px-3 py-2.5 text-sm",
                      isActive
                        ? "bg-emerald-100 font-semibold text-emerald-800 dark:bg-emerald-900/50"
                        : "text-zinc-700 hover:bg-zinc-200/70 dark:text-zinc-300 dark:hover:bg-zinc-800"
                    )}
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      {isEditing ? (
                        <input
                          className="w-full rounded-md border border-zinc-300 bg-white px-2 py-1 text-sm text-zinc-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100"
                          value={draft}
                          autoFocus
                          maxLength={120}
                          onChange={(e) => setDraft(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") commitEdit(c.chat_id);
                            if (e.key === "Escape") cancelEdit();
                          }}
                          onClick={(e) => e.stopPropagation()}
                        />
                      ) : (
                        <>
                          <History size={16} className="flex-shrink-0" />
                          <span className="truncate">{c.title}</span>
                        </>
                      )}
                    </div>
                    <div className="ml-2 flex flex-shrink-0 items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                      {isEditing ? (
                        <>
                          <ChatActionButton
                            onClick={(e) => {
                              e.stopPropagation();
                              commitEdit(c.chat_id);
                            }}
                          >
                            <Check size={16} />
                          </ChatActionButton>
                          <ChatActionButton
                            onClick={(e) => {
                              e.stopPropagation();
                              cancelEdit();
                            }}
                          >
                            <X size={16} />
                          </ChatActionButton>
                        </>
                      ) : (
                        <>
                          <ChatActionButton
                            onClick={(e) => {
                              e.stopPropagation();
                              startEdit(c);
                            }}
                          >
                            <Pencil size={16} />
                          </ChatActionButton>
                          {onDeleteChatAction && (
                            <ChatActionButton
                              className="text-red-500 hover:bg-red-100 dark:hover:bg-red-900/40"
                              onClick={(e) => {
                                e.stopPropagation();
                                if (onDeleteChatAction) {
                                  onDeleteChatAction(c.chat_id);
                                }
                              }}
                            >
                              <Trash2 size={16} />
                            </ChatActionButton>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar: Collapsible */}
      <aside
        className={cx(
          "z-20 hidden flex-shrink-0 flex-col bg-zinc-100 transition-all duration-300 lg:flex dark:bg-zinc-900",
          sidebarOpen ? "w-72" : "w-20"
        )}
      >
        {sidebarContent(!sidebarOpen)}
      </aside>

      {/* Mobile Sidebar: Slide-in Panel */}
      <div
        className={cx(
          "fixed inset-0 z-30 lg:hidden",
          sidebarOpen ? "block" : "hidden"
        )}
      >
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm"
          onClick={() => setSidebarOpenAction(false)}
        />
        <aside className="fixed inset-y-0 left-0 z-40 w-[min(85vw,320px)] flex-col bg-zinc-100 dark:bg-zinc-900">
          {sidebarContent(false)}
        </aside>
      </div>
    </>
  );
}
