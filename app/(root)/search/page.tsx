import UserCard from "@/components/cards/UserCard";
import { fetchUser, fetchUsers } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation";

async function page() {
    const user = await currentUser();
    if(!user) return null!

    const userInfo = await fetchUser(user.id);
    if(!userInfo?.onboard) redirect("/onboarding");

    //Fetch Users
    const result = await fetchUsers({userId : user.id, serachString:"A"});
  return (
    <section>
        <h1 className="text-white">Search</h1>

        <div className='mt-14 flex flex-col gap-9'>
        {result.users.length === 0 ? (
          <p className='no-result'>No Result</p>
        ) : (
          <>
            {result.users.map((person) => (
              <UserCard
                key={person.id}
                id={person.id}
                name={person.name}
                username={person.username}
                imgUrl={person.image}
                personType='User'
              />
            ))}
          </>
        )}
      </div>
    </section>
  )
}

export default page