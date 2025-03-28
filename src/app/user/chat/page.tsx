"use client";

import { ConversationList } from "@/components/chat/conversation-list";
import { MessagePanel } from "@/components/chat/message-panel";
import { conversationsData } from "@/components/chat/mock/conversations.mock";
import { ProfileSidebar } from "@/components/chat/profile-sidebar";
import { useState } from "react";

export default function MessagingInterface() {
  const [activeConversationId, setActiveConversationId] = useState(1);

  const activeConversation = conversationsData.find(
    (conversation) => conversation.id === activeConversationId,
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-2">
      <div className="flex">
        <ConversationList
          conversations={conversationsData}
          activeConversationId={activeConversationId}
          onConversationSelect={setActiveConversationId}
        />
        <MessagePanel activeConversation={activeConversation} />
        <ProfileSidebar />
      </div>
    </div>
  );
}
