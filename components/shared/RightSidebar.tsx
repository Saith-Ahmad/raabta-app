import { currentUser } from "@clerk/nextjs/server";

import UserCard from "../cards/UserCard";

import { fetchCommunities } from "@/lib/actions/community.actions";
import { fetchUsers } from "@/lib/actions/user.actions";
import SidebarCard from "../cards/SidebarCard";

async function RightSidebar() {
  const user = await currentUser();
  if (!user) return null;

  const similarMinds = await fetchUsers({
    userId: user.id,
    pageSize: 4,
  });

  const suggestedCOmmunities = await fetchCommunities({ pageSize: 4 });

  return (
    <section className='custom-scrollbar rightsidebar'>
      <div className='flex flex-1 flex-col justify-start'>
        <h3 className='text-heading4-medium text-light-1'>
          Suggested Communities
        </h3>

        <div className='mt-7 flex w-[220px] flex-col gap-2'>
          {suggestedCOmmunities.communities.length > 0 ? (
            <>
              {suggestedCOmmunities.communities.map((community) => (
                <SidebarCard
                  key={community.id.toString()}
                  id={community.id.toString()}
                  name={community.name}
                  username={community.username}
                  imgUrl={community.image}
                  personType='Community'
                />
              ))}
            </>
          ) : (
            <p className='!text-base-regular text-light-3'>
              No communities yet
            </p>
          )}
        </div>
      </div>

      <div className='flex flex-1 flex-col justify-start'>
        <h3 className='text-heading4-medium text-light-1'>Similar Minds</h3>
        <div className='mt-7 flex w-[220px] flex-col gap-2'>
          {similarMinds.users.length > 0 ? (
            <>
              {similarMinds.users.map((person) => (
                <SidebarCard
                  key={person.id}
                  id={person.id}
                  name={person.name}
                  username={person.username}
                  imgUrl={person.image}
                  personType='User'
                />
              ))}
            </>
          ) : (
            <p className='!text-base-regular text-light-3'>No users yet</p>
          )}
        </div>
      </div>
    </section>
  );
}

export default RightSidebar;