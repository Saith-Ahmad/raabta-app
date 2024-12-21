import ThreadCard from "@/components/cards/ThreadCard";
import Comment from "@/components/forms/Comment";
import { fetchThreadById } from "@/lib/actions/thread.action";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";


export default async function Page({params,}: {params: Promise<{ id: string }>}) {
    const id = (await params).id
    if(!id) return null;

    const user = await currentUser();
    if(!user) return null;

    const userInfo = await fetchUser(user.id);
    if(!userInfo?.onboard) redirect('/onboarding');

    const thread = await fetchThreadById(id);

    return(
      <section className="relative">
       <div>
        <ThreadCard
            id={thread._id}
            currentUserId={user.id}
            parentId={thread.parentId}
            content={thread.text}
            author={thread.author}
            community={thread.community}
            createdAt={thread.createdAt}
            comments={thread.children}
            threadImage={thread.threadImage}
        />
       </div>

       <div className="mt-7">
        <Comment
          threadId={id}
          currentUserImg={userInfo?.image}
          currentUserId={JSON.stringify(userInfo._id)}
        />
       </div>

       <div className="mt-10">
        {thread.children.map((threadChild:any)=>(
          <ThreadCard
            key={threadChild?.id}
            id={threadChild?._id}
            currentUserId={threadChild?.id}
            parentId={threadChild?.parentId}
            content={threadChild?.text}
            author={threadChild?.author}
            community={threadChild?.community}
            createdAt={threadChild?.createdAt}
            comments={threadChild?.children}
            isComment
      />
        )).reverse()}
        
       </div>
      </section>
    )
  }