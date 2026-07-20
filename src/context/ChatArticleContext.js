"use client";

import { createContext, useContext, useMemo, useState } from "react";

const ChatArticleContext = createContext(null);

export function ChatArticleProvider({ children }) {
  const [articleContext, setArticleContext] = useState(null);
  const [requestOpen, setRequestOpen] = useState(false);

  const value = useMemo(
    () => ({
      articleContext,
      setArticleContext,
      requestOpen,
      setRequestOpen,
    }),
    [articleContext, requestOpen]
  );

  return (
    <ChatArticleContext.Provider value={value}>{children}</ChatArticleContext.Provider>
  );
}

export function useChatArticle() {
  return useContext(ChatArticleContext);
}
