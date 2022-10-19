import { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { queriesOf } from "../utils/common";

export const Compare: NextPage = () => {
  const router = useRouter()
  const symbols = queriesOf(router.query.s)
  return (
    <div className="container mx-auto">
      <Head>
        <title>Moolah • Compare</title>
      </Head>
      <div className="card">
        <h1 className="text-3xl">Compare</h1>
        <table className="bg-neutral-500 table-auto w-full rounded p-4">
          <thead>
            <tr className="text-left">
              <th>Symbol</th>
            </tr>
          </thead>
          <tbody>
            {symbols
              ? symbols.map(symbol => (
                <tr key={symbol}>
                  <td>{symbol}</td>
                </tr>
              ))
              : (
                <span>Nothing to compare.</span>
              )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Compare