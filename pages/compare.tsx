import { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { DatapointKeys, Details, queriesOf } from "../utils/common";
import { symbolData } from "../utils/server";
import { Line } from "react-chartjs-2";

import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
} from "chart.js";

ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
);

type Datapoints = Details;

interface DetailsProps {
  data: Record<string /* symbol */, Datapoints>
}

function randomColor(S = 100, V = 66) {
  return `hsl(${Math.floor(Math.random() * 360)}, ${S}%, ${V}%)`
}

function toDataset(data: Record<string, Datapoints>, key = DatapointKeys.close) {
  let labels: any[] = []
  const datasets: any[] = []
  for (const symbol in data) {
    const dps = data[symbol]
    labels = dps.Date
    datasets.push({
      label: symbol,
      data: dps[key],
      borderColor: randomColor(),
      backgroundColor: 'rgba(255, 120, 120, 0.5)',
      fill: false,
      tension: .1,
      pointRadius: 0
    })
  }
  return { labels, datasets }
}

function getLatestData(data: Datapoints, key = DatapointKeys.close) {
  try {
    return data[key][0].toFixed(2)
  } catch (err) {
    console.error(err)
    return 'unknown'
  }
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
        <table className="surface table-auto w-full rounded p-4 mt-2">
          <thead>
            <tr className="text-left border-b">
              <th className="p-4">Symbol</th>
              <th className="p-4">Close</th>
              <th className="p-4">Open</th>
              <th className="p-4">High</th>
              <th className="p-4">Low</th>
            </tr>
          </thead>
          <tbody>
            {symbols
              ? symbols.map(symbol => (
                <tr key={symbol} className="border-b"> 
                  <td className="p-4">{symbol}</td>
                  <td className="p-4">{getLatestData(props.data[symbol], DatapointKeys.open)}</td>
                  <td className="p-4">{getLatestData(props.data[symbol], DatapointKeys.close)}</td>
                  <td className="p-4">{getLatestData(props.data[symbol], DatapointKeys.high)}</td>
                  <td className="p-4">{getLatestData(props.data[symbol], DatapointKeys.low)}</td>
                </tr> 
              ))
              : (
                <span>Nothing to compare.</span>
              )}
          </tbody>
        </table>
        {symbols && (
          <Line
            data={toDataset(props.data)}
            options={{
              responsive: true,
              scales: {
                x: { type: "category", reverse: true },
                y: { type: "linear" },
              },
              interaction: {
                intersect: false
              },
              plugins: {
                tooltip: {},
              },
            }}
          />
        )}
      </div>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps<DetailsProps> = async context => {
  const symbols = queriesOf(context.query.s)
  if (!symbols) return { notFound: true }
  let interval = '1mo'
  let cached = true
  try {
    let symbolsData = await Promise.all(symbols.map(async symbol => {
      const {data, error} = await symbolData(symbol, { interval, cached })
      if (error) {
        console.error({ symbol, error })
        throw new Error(`Symbol ${symbol} could not be retrieved:\n${error.message}`, {cause: error})
      }
      return [symbol, data!.toObject()] as const
    }))
    return {
      props: {
        data: Object.fromEntries(symbolsData as any)
      }
    }
  } catch (err: unknown) {
    return {
      redirect: {
        destination:`/error?${new URLSearchParams({
          cause: (err as Error).message
        })}` 
      },
      props: {data: {}}
    }
  }
}

export default Compare