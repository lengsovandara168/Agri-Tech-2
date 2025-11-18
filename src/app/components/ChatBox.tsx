"use client";
/* eslint-disable @next/next/no-img-element */
import React from "react";
import { Message } from "./types";
import { User } from "lucide-react"; // Import the User icon

type ChatBoxProps = {
  messages: Message[];
  chatBoxRef: React.RefObject<HTMLDivElement | null>;
  botAvatarSrc?: string;
};

export default function ChatBox({
  messages,
  chatBoxRef,
  botAvatarSrc = "/web-images/agribot-logo.png",
}: ChatBoxProps) {
  return (
    <div id="chat-box" ref={chatBoxRef} className="flex-1 overflow-y-auto p-4">
      <div className="mx-auto max-w-full space-y-6">
        {messages.map((m) => {
          const isUser = m.sender === "user";
          return (
            <div
              key={m.id}
              className={`flex items-start gap-3 ${
                isUser ? "justify-end" : "justify-start"
              }`}
            >
              {/* Bot Avatar */}
              {!isUser && (
                <img
                  src={botAvatarSrc}
                  alt="Bot"
                  width={32}
                  height={32}
                  className="h-8 w-8 flex-shrink-0 select-none rounded-full border border-zinc-200 object-cover dark:border-zinc-700"
                />
              )}

              {/* Container for text bubble and image */}
              <div
                className={`flex max-w-[80%] flex-col gap-2 ${
                  isUser ? "items-end" : "items-start"
                }`}
              >
                {/* Text Bubble */}
                {m.text && (
                  <div
                    className={`whitespace-pre-wrap px-4 py-2.5 shadow-sm ${
                      isUser
                        ? "rounded-t-xl rounded-bl-xl bg-emerald-600 text-white"
                        : "rounded-t-xl rounded-br-xl border border-zinc-200 bg-white text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                    }`}
                  >
                    <span>{m.text}</span>
                  </div>
                )}

                {/* Image (now outside the bubble) */}
                {m.image && (
                  <img
                    src={m.image.startsWith("static/uploads/") ? "/" + m.image : m.image}
                    alt="Uploaded"
                    className="max-w-[240px] cursor-pointer rounded-lg transition-transform hover:scale-105"
                  />
                )}
              </div>

              {/* User Avatar */}
              {isUser && (
                <div
                  className="flex h-8 w-8 flex-shrink-0 select-none items-center justify-center rounded-full bg-zinc-700 text-white dark:bg-zinc-600"
                  aria-hidden
                >
                  <User size={18} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
