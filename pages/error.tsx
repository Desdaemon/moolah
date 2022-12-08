import { useRouter } from "next/router";
import HomeLink from "../components/homelink";
import { queryOr } from "../utils/common";

export default function ErrorPage() {
  const router = useRouter()
  const cause = queryOr(router.query['cause'])
  return (
    <div className="container mx-auto">
      <HomeLink className="text-3xl mt-4" />
      <div className="card">
        <h1 className="text-3xl">Oops!</h1>
        {cause && (
          <pre>{cause}</pre>
        )}
      </div>
    </div>
  );
}
