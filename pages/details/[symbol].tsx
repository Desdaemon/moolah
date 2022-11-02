import { GetServerSideProps, NextPage } from "next";
import { MdInfo } from 'react-icons/md'
import { BsChevronDoubleDown, BsChevronDoubleUp } from 'react-icons/bs'
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
} from "chart.js";
import { useRouter } from "next/router";
import { queryOr, uri, Details, DatapointKeys } from "../../utils/common";
import HomeLink from "../../components/homelink";
import Link from "next/link";
import { symbolData } from "../../utils/server";

ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
);

type Datapoints = Details;

interface DetailsProps {
  symbol: string;
  data: Datapoints
}

function toDataset(data: Datapoints, key = DatapointKeys.close) {
  const dp: number[] = [];
  const labels: string[] = [];
  for (let i = 0; i < data[key].length; ++i) {
    labels.push(data.Date[i])
    dp.push(data[key][i])
  }
  return {
    labels,
    datasets: [
      {
        label: key,
        data: dp,
        borderColor: "#00a86b",
        backgroundColor: "rbga(255, 120, 120, 0.5)",
        fill: false,
        tension: 0.1,
        pointRadius: 0,
      },
    ],
  };
}

function getLatestData(data: Datapoints, key = DatapointKeys.close) {
  return (data[key][0] as number).toFixed(2)
}

function comparePreviousDay(data: Datapoints, key = DatapointKeys.close) {
  const [todayData, yesterdayData] = data[key]

  const yesterdayHigh = +yesterdayData[key]
  const todayHigh = +todayData[key]
  if (yesterdayHigh <= todayHigh) {
    return <BsChevronDoubleDown className="h-4 w-4 inline text-red-500 fill-current" />
  }
  return <BsChevronDoubleUp className="h-4 w-4 inline text-green-500 fill-current" />
}

const Details: NextPage<DetailsProps> = (props) => {
  const router = useRouter()
  const current = new Date()
  return (
    <div className="container mx-auto">
      <HomeLink className="text-3xl mt-4" />
      <div className="card">
        <h1 className="text-3xl">{props.symbol}
          <span className="text-sm">
            <br />{`${current.getDate()}/${current.getMonth() + 1}/${current.getFullYear()}`}
          </span>
        </h1>
        <select
          name="scale"
          id="scale"
          title="Scale"
          className="rounded text-black my-2"
          defaultValue={router.query.scale}
          onChange={event => {
            router.replace(uri`/details/${props.symbol}?scale=${event.target.value}`)
          }}>
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>

        <div className="flex mb-4">
          <div className="w-1/4">
            <ul className="list-none text-2xl">
              <li>
                <div className="inline-block">
                  <Link href="/glossary">
                    <MdInfo
                      title="Opening price that is first traded within a day.&#013;Click for more info..."
                      className="cursor-pointer h-4 w-4 inline" />
                  </Link>
                  {' Open: '}
                  {getLatestData(props.data, DatapointKeys.open)}
                </div>
              </li>
              <li>
                <div className="inline-block">
                  <Link href="/glossary">
                    <MdInfo
                      title="Security's intraday highest trading price.&#013;Click for more info..."
                      className="cursor-pointer h-4 w-4 inline" />
                  </Link>
                  {' High: '}
                  {getLatestData(props.data, DatapointKeys.high)}{' '}{comparePreviousDay(props.data, DatapointKeys.high)}
                </div>
              </li>
              <li>
                <div className="inline-block">
                  <Link href="/glossary">
                    <MdInfo
                      title="Security's intraday lowest trading price.&#013;Click for more info..."
                      className="cursor-pointer h-4 w-4 inline" />
                  </Link>
                  {' Low: '}
                  {getLatestData(props.data, DatapointKeys.low)}{' '}{comparePreviousDay(props.data, DatapointKeys.low)}
                </div>
              </li>
              <li>
                <div className="inline-block">
                  <Link href="/glossary#volume">
                    <MdInfo
                      title="Total number of buyers and sellers exchanging shares within a day. &#010;Click for more info..."
                      className="cursor-pointer h-4 w-4 inline" />
                  </Link>
                  {' Volume: '}
                  {getLatestData(props.data, DatapointKeys.volume)}{' '}{comparePreviousDay(props.data, DatapointKeys.volume)}
                </div>
              </li>
              <li>
                <div className="inline-block">
                  <Link href="/glossary">
                    <MdInfo
                      title="Last price that is traded within a day. Click for more info..."
                      className="cursor-pointer h-4 w-4 inline" />
                  </Link>
                  {' Close: '}
                  {getLatestData(props.data, DatapointKeys.close)}{' '}{comparePreviousDay(props.data, DatapointKeys.close)}
                </div>
              </li>
            </ul>
          </div>

          <div className="w-3/4">
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default Details;

export const getServerSideProps: GetServerSideProps<DetailsProps> = async context => {
  const symbol = queryOr(context.query.symbol)
  if (!symbol) return { notFound: true }
  let interval: string
  let cached: boolean
  switch (context.query.scale) {
    case 'weekly':
      interval = '1wk'
      cached = false
      break
    case 'monthly':
      interval = '1mo'
      cached = false
      break
    case 'daily':
    default:
      interval = '1d'
      cached = true
  }
  const {data, error} = await symbolData(symbol, { interval, cached })
  if (error) {
    if (error.code == 404) return {notFound: true}
    throw new Error(error.message)
  }
  return {
    props: {
      symbol,
      data: data.toObject() as any
    }
  }
}
