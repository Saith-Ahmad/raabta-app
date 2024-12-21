"use client";

import { deleteThread } from "@/lib/actions/thread.action";
import { useToast } from "@/hooks/use-toast"
import { Trash2 } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

interface Props {
  threadId: string;
  currentUserId: string;
  authorId: string;
  parentId: string | null;
  isComment?: boolean;
}

function DeleteThread({
  threadId,
  currentUserId,
  authorId,
  parentId,
  isComment,
}: Props) {
  const pathname = usePathname();
  const router = useRouter();

  if (currentUserId !== authorId || pathname === "/") return null;
  const { toast } = useToast()

  return (
    <div>
      <Trash2
        size={18}
        strokeWidth={3}
        className="cursor-pointer hover:text-red-700 hover:scale-110 text-white"
        onClick={async () => {
          await deleteThread(JSON.parse(threadId), pathname);
          toast({
            title: "Thread Deleted Sucessfully",
            variant:"dark",
          })
          if (!parentId || !isComment) {
            router.push("/");
          }
          
        }}
      />
    </div>
  );
}

export default DeleteThread;
