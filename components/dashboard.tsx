import type { NextPage } from "next";
import { useSession } from "./session";

const Dashboard: NextPage = () => {
  const user = useSession();

  return <div className="container">{JSON.stringify(user)}</div>;
};

export default Dashboard;