"use client";
import React from "react";

import Layout from "./layout";
import ChatApp from "./components/ChatApp";

export default function Page() {
  return (
    <Layout>
      <main>
        <ChatApp />
      </main>
    </Layout>
  );
}
