"use client";
/* eslint-disable @next/next/no-img-element */
import React, { useRef, useEffect, useState } from "react";
import { Paperclip, Send, X as XIcon, Loader2, Mic } from "lucide-react";

// SpeechRecognition types for webkit compatibility
interface SpeechRecognitionConstructor {
  new (): SpeechRecognition;
}

interface SpeechRecognition extends EventTarget {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  onstart: (() => void) | null;
  onend: (() => void) | null;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  start(): void;
  stop(): void;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message?: string;
}

interface WindowWithSpeech extends Window {
  SpeechRecognition?: SpeechRecognitionConstructor;
  webkitSpeechRecognition?: SpeechRecognitionConstructor;
}

type ChatInputProps = {
  uploadedImage: string | null;
  onPreviewFileAction: (file: File | null | undefined) => void;
  onRemovePreviewAction: () => void;
  userInput: string;
  setUserInputAction: (v: string) => void;
  onSendAction: () => void;
  sending: boolean;
  canSend: boolean;
};

export default function ChatInput({
  uploadedImage,
  onPreviewFileAction,
  onRemovePreviewAction,
  userInput,
  setUserInputAction,
  onSendAction,
  sending,
  canSend,
}: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [listening, setListening] = useState(false);

  // Auto-resize the textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = `${scrollHeight}px`;
    }
  }, [userInput]);

  // 🎤 Speech-to-Text (Khmer)
  const handleVoiceInput = () => {
    const windowWithSpeech = window as unknown as WindowWithSpeech;
    const SpeechRecognition =
      windowWithSpeech.SpeechRecognition || windowWithSpeech.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Your browser does not support Speech Recognition API.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "km-KH"; // Khmer
    recognition.interimResults = true;
    recognition.continuous = false;

    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = Array.from(event.results)
        .map((result: SpeechRecognitionResult) => result[0].transcript)
        .join("");
      setUserInputAction(transcript);
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error("Speech recognition error:", event.error);
      setListening(false);
    };

    recognition.start();
  };

  return (
    <div className="w-full border-t border-zinc-200 bg-zinc-50 p-4 dark:border-neutral-800 dark:bg-neutral-900">
      <div className="mx-auto max-w-full">
        {/* Image Preview */}
        {uploadedImage && (
          <div className="relative mb-3 inline-block">
            <img
              className="h-20 w-20 rounded-lg object-cover ring-2 ring-zinc-200 dark:ring-neutral-700"
              src={uploadedImage}
              alt="Preview"
            />
            <button
              type="button"
              onClick={onRemovePreviewAction}
              className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-neutral-800 text-white shadow-md transition-transform hover:scale-110 dark:bg-neutral-200 dark:text-neutral-900"
              aria-label="Remove image"
            >
              <XIcon size={16} />
            </button>
          </div>
        )}

        {/* Main Input Area */}
        <div className="flex w-full items-end gap-2 rounded-xl border border-zinc-300 bg-white p-2 shadow-sm dark:border-neutral-700 dark:bg-neutral-800">
          {/* Attach Button */}
          <label
            htmlFor="file-upload"
            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-700 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-neutral-200"
          >
            <Paperclip size={20} />
            <span className="sr-only">Attach image</span>
          </label>
          <input
            id="file-upload"
            className="hidden"
            type="file"
            accept="image/*"
            capture="environment"
            onChange={(e) => {
              const file = e.currentTarget.files?.[0] || null;
              onPreviewFileAction(file);
              e.target.value = "";
            }}
          />

          {/* Text Input */}
          <textarea
            ref={textareaRef}
            rows={1}
            placeholder="សូមនិយាយ ឬវាយសំណួររបស់អ្នកនៅទីនេះ..."
            value={userInput}
            onChange={(e) => setUserInputAction(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                if (canSend) onSendAction();
              }
            }}
            className="flex-1 resize-none self-center border-none bg-transparent py-2 text-zinc-900 placeholder:text-zinc-500 focus:outline-none focus:ring-0 dark:text-neutral-100 dark:placeholder:text-neutral-400"
            style={{ maxHeight: "120px" }}
          />

          {/* 🎤 Voice Input Button */}
          <button
            type="button"
            onClick={handleVoiceInput}
            className={`flex h-10 w-10 items-center justify-center rounded-lg ${
              listening
                ? "bg-red-500 text-white animate-pulse"
                : "bg-gray-100 text-zinc-600 hover:bg-gray-200 dark:bg-neutral-700 dark:text-neutral-300"
            } transition-all`}
            title="Speak (Khmer)"
          >
            <Mic size={20} />
          </button>

          {/* Send Button */}
          <button
            type="button"
            onClick={onSendAction}
            disabled={sending || !canSend}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-600 text-white shadow-sm transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-zinc-300 dark:disabled:bg-neutral-700"
          >
            {sending ? (
              <Loader2 size={20} className="animate-spin" />
            ) : (
              <Send size={20} />
            )}
            <span className="sr-only">Send message</span>
          </button>
        </div>
      </div>
    </div>
  );
}
