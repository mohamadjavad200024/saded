"use client";

import { AdminChat } from "@/components/admin/admin-chat";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function AdminChatPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(true);
  const initialCustomerPhone = searchParams.get("phone") || undefined;

  // Handle back navigation
  const handleClose = () => {
    router.push("/admin");
  };

  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col overflow-hidden" style={{ margin: 0, padding: 0 }}>
      <AdminChat
        isOpen={isOpen}
        onOpenChange={(open) => {
          setIsOpen(open);
          if (!open) {
            handleClose();
          }
        }}
        initialCustomerPhone={initialCustomerPhone}
      />
    </div>
  );
}

