import { fetchUser, getActivity } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs/server";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

async function Activity_Page() {
  const user = await currentUser();
  if(!user) return null!

  const userInfo = await fetchUser(user.id);
  if(!userInfo?.onboard) redirect ("/onboarding");

  const activity = await getActivity(userInfo._id);

  const getTimeAgo = (createdAt: number) => {
    const diff = Date.now() - createdAt;

    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const months = Math.floor(diff / (1000 * 60 * 60 * 24 * 30));

    if (minutes < 60) {
      return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`;
    } else if (hours < 24) {
      return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
    } else if (days < 30) {
      return `${days} day${days !== 1 ? "s" : ""} ago`;
    } else {
      return `${months} month${months !== 1 ? "s" : ""} ago`;
    }
  };

  return (
    <>
      <h1 className='head-text'>Activity</h1>

      <section className='mt-10 flex flex-col gap-5'>
        {activity.length > 0 ? (
          <>
            {activity.map((activity) => (
              <Link key={activity._id} href={`/thread/${activity.parentId}`}>
                <article className='activity-card'>
                  <Image
                    src={activity.author.image}
                    alt='user_logo'
                    width={20}
                    height={20}
                    className='rounded-full object-cover'
                  />
                  <p className='!text-small-regular text-light-1'>
                    <span className='mr-1 text-primary-500'>
                      {activity.author.name}
                    </span>{" "}
                    replied to your thread
                  </p>

                  <p className="mr-1 !text-small-regular  text-primary-500 ms-auto"> {getTimeAgo(activity.createdAt)}</p>
                </article>
              </Link>
            ))}
          </>
        ) : (
          <p className='!text-base-regular text-light-3'>No activity yet</p>
        )}
      </section>
    </>
  )
}

export default Activity_Page