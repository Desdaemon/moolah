import { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { DatapointKeys, Details, queriesOf, queryOr } from "../utils/common";
import { symbolData } from "../utils/server";



type Datapoints = Details;

interface DetailsProps {
  // symbol: string;
  data: Record<string, Datapoints>
}

function getLatestData(data: Datapoints, key = DatapointKeys.close) {
  // return (data[key][0] as number).toFixed(2)
  return data[key][0].toFixed(2)
}


export const Compare: NextPage<DetailsProps> = (props) => {
  const router = useRouter()
  const symbols = queriesOf(router.query.s)
  return (
    <div className="container mx-auto">
      <Head>
        <title>Moolah • Compare</title>
      </Head>
      <div className="card">
        <h1 className="text-3xl">Compare</h1>
        <table className="surface table-auto w-full rounded p-4">
          <thead>
            <tr className="text-left">
              <th>Symbol</th>
              <th>Close</th>
              <th>Open</th>
              <th>High</th>
              <th>Low</th>
            </tr>
          </thead>
          <tbody>
            {symbols
              ? symbols.map(symbol => (
                <tr key={symbol}> 
                  <td>{symbol}</td>
                  <td>{getLatestData(props.data[symbol], DatapointKeys.open)}</td>

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

export const getServerSideProps: GetServerSideProps<DetailsProps> = async context => {
  // const router = useRouter()
  const symbols = queriesOf(context.query.s)
  if (!symbols) return { notFound: true }
  let interval = '1mo'
  let cached = true
  let symbolsData = await Promise.all(symbols.map(async symbol => {
    const {data, error} = await symbolData(symbol, { interval, cached })
    if (error){
      console.log(error)
    }
    if (!data) return null
    // return {
    //   [symbol]: data.toObject()
    // }
    return [symbol, data.toObject()] as const
    // return data?.toObject()
  }))
  if (symbolsData.includes(null)) {
    return {notFound: true}
  }
  // if (error) {
  //   if (error.code == 404) return {notFound: true}
  //   throw new Error(error.message)
  // }
  return {
    props: {
      data: Object.fromEntries(symbolsData)
    }
  }}

export default Compare