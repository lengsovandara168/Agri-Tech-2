"use client";

import React, { useEffect, useRef, useState } from "react";
const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:3000";
const STATIC_BASE = process.env.NEXT_PUBLIC_STATIC_BASE || "http://localhost:3000/static";
import Sidebar from "./Sidebar";
import ChatHeader from "./ChatHeader";
import ChatBox from "./ChatBox";
import ChatInput from "./ChatInput";
import {
  Message,
  ChatTitle,
  ApiChatsResponse,
  ApiGetResponse,
  ApiLoadChatResponse,
  ApiMutationOk,
} from "./types";
import { v4 as uuidv4 } from 'uuid';
// Safe JSON parser with runtime content-type guard
function parseJsonSafe<T>(res: Response): Promise<T | null> {
  return (async () => {
    try {
      const ct = res.headers.get("content-type");
      if (ct && ct.includes("application/json")) {
        return (await res.json()) as T;
      }
    } catch {}
    return null;
  })();
}

export default function ChatApp() {
  const [chatTitles, setChatTitles] = useState<ChatTitle[]>([]);
  const [activeChatId, setActiveChatId] = useState<number | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      sender: "bot",
      text: "សូមស្វាគមន៍មកកាន់ Agri-Chatbot! ជាជំនួយការកសិកម្មឌីជីថល ដែលជួយអ្នកក្នុងការដាំដុះ និងថែទាំដំណាំ",
    },
  ]);
  const [userInput, setUserInput] = useState("");
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const chatBoxRef = useRef<HTMLDivElement | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const el = chatBoxRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [messages]);

  // Helpers
  const appendMessage = (m: Message) =>
    setMessages((prev) => [...prev, { ...m, id: uuidv4() }]);

  const previewImage = (file?: File | null) => {
    if (!file || !(file instanceof Blob)) return; // nothing selected or invalid
    // Compress image on the client to speed up upload and reduce backend load
    (async () => {
      try {
        const dataUrl = await fileToCompressedDataUrl(file as File, 1280, 0.8);
        setUploadedImage(dataUrl);
      } catch {
        // Fallback to raw Data URL if compression fails
        const reader = new FileReader();
        reader.onload = () => setUploadedImage(String(reader.result));
        reader.readAsDataURL(file);
      }
    })();
  };

  const removePreview = () => setUploadedImage(null);
    // Convert an image File to a compressed JPEG Data URL (max dimension + quality)
  async function fileToCompressedDataUrl(
    file: File,
    maxDim = 1280,
    quality = 0.8
  ): Promise<string> {
    // Try to decode using createImageBitmap (faster and handles orientation better in some browsers)
    const bitmap = await createImageBitmap(file).catch(() => null);
    if (!bitmap) {
      // Fallback: use HTMLImageElement decoding
      const rawDataUrl = await new Promise<string>((resolve, reject) => {
        const r = new FileReader();
        r.onload = () => resolve(String(r.result));
        r.onerror = reject;
        r.readAsDataURL(file);
      });
      const img = await new Promise<HTMLImageElement>((resolve, reject) => {
        const image = new Image();
        image.onload = () => resolve(image);
        image.onerror = reject;
        image.src = rawDataUrl;
      });
      const { width, height } = img;
      const scale = Math.min(1, maxDim / Math.max(width, height));
      const w = Math.round(width * scale);
      const h = Math.round(height * scale);
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas 2D not available");
      ctx.drawImage(img, 0, 0, w, h);
      return canvas.toDataURL("image/jpeg", quality);
    }
    const { width, height } = bitmap;
    const scale = Math.min(1, maxDim / Math.max(width, height));
    const w = Math.round(width * scale);
    const h = Math.round(height * scale);
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas 2D not available");
    ctx.drawImage(bitmap, 0, 0, w, h);
    return canvas.toDataURL("image/jpeg", quality);
  }

  // no-op

  const redirectToLogin = () => {
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
  };

  // Load chat titles on mount
  useEffect(() => {
    const loadTitles = async () => {
      try {
        const resp = await fetch(`${API_BASE}/api/chat/chats`, {
          credentials: "include",
        });
        if (resp.status === 401) {
          redirectToLogin();
          return;
        }
        if (!resp.ok) {
          await resp.text();
          return;
        }
        const data = await parseJsonSafe<ApiChatsResponse>(resp);
        if (data && Array.isArray(data.chats)) {
          setChatTitles(data.chats);
        }
      } catch {
        // swallow load error in UI
      }
    };
    loadTitles();
  }, []);

  // Start a new chat
  const newChat = async () => {
    setActiveChatId(null);
    setUploadedImage(null);
    setMessages([
      {
        id: "welcome",
        sender: "bot",
        text: "Welcome to Agri-Chatbot! How can I help you with your farming today?",
      },
    ]);
  };

  // Send user message (and optional image)
  const sendMessage = async () => {
    const message = userInput.trim();
    if (!message && !uploadedImage) return;
    if (sending) return;
    setSending(true);

    if (message) appendMessage({ sender: "user", text: message, id: "tmp1" });
    if (uploadedImage)
      appendMessage({ sender: "user", image: uploadedImage, id: "tmp2" });

    setUserInput("");
    
    // Extract base64 data from data URL if present
    let imageData: string | null = null;
    if (uploadedImage) {
      const base64Match = uploadedImage.match(/^data:image\/\w+;base64,(.+)$/);
      imageData = base64Match ? base64Match[1] : uploadedImage;
    }
    
    const payload = {
      message,
      image: imageData,
      imageMimeType: 'image/jpeg',
      chatId: activeChatId
    };
    setUploadedImage(null);

    try {
      console.log('Sending message to:', `${API_BASE}/api/chat/get-response`);
      console.log('Payload:', { ...payload, image: payload.image ? '[base64 data]' : null });
      
      const resp = await fetch(`${API_BASE}/api/chat/get-response`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });
            if (resp.status === 401) {
        redirectToLogin();
        return;
      }
      if (!resp.ok) {
        const txt = await resp.text();
        appendMessage({
          sender: "bot",
          text: `Error: ${txt || resp.status}`,
          id: "err",
        });
        return;
      }

      const data = (await parseJsonSafe<ApiGetResponse>(resp)) || {};
      if (data.response) {
        appendMessage({
          sender: "bot",
          text: data.response,
          id: "tmp3",
        });
      }
      if (data.newChat) {
        setChatTitles((prev) => [{ chat_id: data.newChat!.chatId, title: data.newChat!.title }, ...prev]);
        setActiveChatId(data.newChat.chatId);
      }
    } catch (error) {
      console.error('Fetch error:', error);
      appendMessage({
        sender: "bot",
        text: `Network error: ${error instanceof Error ? error.message : 'Failed to connect to server'}`,
        id: "err",
      });
    } finally {
      setSending(false);
    }
  };

  // Load a chat’s messages
  const loadChat = async (chatId: number) => {
    setActiveChatId(chatId);
    const resp = await fetch(`${API_BASE}/api/chat/load/${chatId}`, {
      credentials: "include",
    });
    if (resp.status === 401) {
      redirectToLogin();
      return;
    }
    if (!resp.ok) {
      await resp.text();
      return;
    }
    const data = (await parseJsonSafe<ApiLoadChatResponse>(resp)) || {
      messages: [],
    };
    if (!Array.isArray(data.messages)) return;
    setMessages(
      data.messages.map((m, idx: number) => {
        let image = undefined;
        if (m.image_path) {
          // If image_path is present, build the static URL
          if (m.image_path.startsWith("http")) {
            image = m.image_path;
          } else if (m.image_path.startsWith("/static/uploads/")) {
            image = m.image_path;
          } else if (m.image_path.startsWith("uploads/")) {
            image = `${STATIC_BASE}/${m.image_path}`;
          } else {
            image = `${STATIC_BASE}/uploads/${m.image_path}`;
          }
        }
        return {
          id: `m-${idx}`,
          sender: m.sender === "assistant" ? "bot" : "user",
          text: m.message,
          image,
        };
      })
    );
    setSidebarOpen(false);
  };

  // Rename a chat
  const renameChat = async (
    chatId: number,
    newTitle: string
  ): Promise<boolean> => {
    const r = await fetch(`${API_BASE}/api/chat/rename`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chatId, newTitle }),
    });
    if (r.status === 401) {
      redirectToLogin();
      return false;
    }
    if (!r.ok) return false;
    const data = (await r
      .json()
      .catch(() => ({ success: false }))) as ApiMutationOk;
    return Boolean(data.success);
  };

  const deleteChat = async (chatId: number): Promise<boolean> => {
    const r = await fetch(`${API_BASE}/api/chat/chats`, {
      method: "DELETE",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chatId }),
    });
    if (r.status === 401) {
      redirectToLogin();
      return false;
    }
    if (!r.ok) return false;
    const data = (await r
      .json()
      .catch(() => ({ success: false }))) as ApiMutationOk;
    const ok = Boolean(data.success);
    if (ok) {
      setChatTitles((prev) => prev.filter((x) => x.chat_id !== chatId));
      if (activeChatId === chatId) {
        setActiveChatId(null);
        setMessages([
          {
            id: "welcome",
            sender: "bot",
            text: "Welcome to Agri-Chatbot! How can I help you with your farming today?",
          },
        ]);
      }
    }
    return ok;
  };
    // UI
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-(--color-bg) text-(--color-text-strong)">
      <Sidebar
        chatTitles={chatTitles}
        activeChatId={activeChatId}
        onNewChatAction={newChat}
        onSelectChatAction={(id) => loadChat(id)}
        onRenameChatAction={async (id, t) => {
          const ok = await renameChat(id, t);
          if (ok) {
            setChatTitles((prev) =>
              prev.map((x) => (x.chat_id === id ? { ...x, title: t } : x))
            );
          } else {
            alert("Failed to rename chat. Please try again.");
          }
          return ok;
        }}
        onDeleteChatAction={deleteChat}
        sidebarOpen={sidebarOpen}
        setSidebarOpenAction={setSidebarOpen}
        logoSrc={`/web-images/agribot-logo.png`}
      />

      <section className="flex flex-1 flex-col">
        <ChatHeader
          onOpenSidebarAction={() => setSidebarOpen(true)}
          title="Agri-ChatBot"
        />
        <ChatBox
          messages={messages}
          chatBoxRef={chatBoxRef}
          botAvatarSrc="/web-images/agribot-logo.png"
        />
        <ChatInput
          uploadedImage={uploadedImage}
          onPreviewFileAction={previewImage}
          onRemovePreviewAction={removePreview}
          userInput={userInput}
          setUserInputAction={setUserInput}
          onSendAction={sendMessage}
          sending={sending}
          canSend={Boolean(userInput.trim() || uploadedImage)}
        />
      </section>
    </div>
  );
}