
import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";


type Params = Promise<{ slug: string }>
type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>

import UserCard from "@/components/cards/UserCard";
import Searchbar from "@/components/shared/Searchbar";
import Pagination from "@/components/shared/Pagination";

import { fetchUser, fetchUsers } from "@/lib/actions/user.actions";

export async function generateMetadata(props: {
  params: Params
  searchParams: SearchParams
}) {
  const params = await props.params
  const searchParams = await props.searchParams
  const slug = params.slug
  const query = searchParams.query
}



async function Page(props: { searchParams: SearchParams }) {
  // Await the dynamic `searchParams`
  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboard) redirect("/onboarding");

  const searchParams = await props.searchParams;

  const pageNumber = searchParams?.page ? +searchParams.page : 1;

  // Ensure searchParams.q is a string or undefined
  const searchQuery =
    typeof searchParams.q === "string" ? searchParams.q : searchParams.q?.[0];
  const result = await fetchUsers({
    userId: user.id,
    serachString: searchQuery,
    pageNumber,
    pageSize: 25,
  });

  return (
    <section>
      <h1 className='head-text mb-10'>Search</h1>

      <Searchbar routeType='search' />

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

      <Pagination
        path='search'
        pageNumber={pageNumber}
        isNext={result.isNext}
      />
    </section>
  );
}

export default Page;
