import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
type Params = Promise<{ slug: string }>
type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>
import { fetchUser } from "@/lib/actions/user.actions";
import { fetchCommunities } from "@/lib/actions/community.actions";
import CommunityCard from "@/components/cards/CommunityCard";
import Searchbar from "@/components/shared/Searchbar";
import Pagination from "@/components/shared/Pagination";

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
  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboard) redirect("/onboarding");

  const searchParams = await props.searchParams;

  const pageNumber = searchParams?.page ? +searchParams.page : 1;

  // Ensure searchParams.q is a string or undefined
  const searchQuery =
    typeof searchParams.q === "string" ? searchParams.q : searchParams.q?.[0];

  const result = await fetchCommunities({
    searchString: searchQuery, // Pass the corrected query
    pageNumber,
    pageSize: 25,
  });

  return (
    <>
      <h1 className="head-text">Communities</h1>

      <div className="mt-5">
        <Searchbar routeType="communities" />
      </div>

      <section className="mt-9 flex flex-wrap gap-4">
        {result.communities.length === 0 ? (
          <p className="no-result">No Result</p>
        ) : (
          <>
            {result.communities.map((community) => (
              <CommunityCard
                key={community.id}
                id={community.id}
                name={community.name}
                username={community.username}
                imgUrl={community.image}
                bio={community.bio}
                members={community.members}
              />
            ))}
          </>
        )}
      </section>

      <Pagination
        path="communities"
        pageNumber={pageNumber}
        isNext={result.isNext}
      />
    </>
  );
}

export default Page;

