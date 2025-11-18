export type Message = {
  id: string;
  sender: "user" | "bot";
  text?: string;
  image?: string;
};

export type ChatTitle = {
  chat_id: number;
  title: string;
};

// Server-side message shape returned by the backend
export type ServerMessage = {
  sender: "user" | "assistant";
  message: string;
  image_path?: string;
};

// API response models
export type ApiChatsResponse = { chats: ChatTitle[] };
export type ApiGetResponse = {
  response?: string;
  newChat?: { chatId: number; title: string };
};
export type ApiLoadChatResponse = { messages: ServerMessage[] };
export type ApiMutationOk = { success: boolean };
