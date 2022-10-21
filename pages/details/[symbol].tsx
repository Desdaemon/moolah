import { GetServerSideProps, NextPage } from "next";
import { InformationCircleIcon, ChevronDoubleDownIcon, ChevronDoubleUpIcon } from '@heroicons/react/24/solid';
import { Line } from "react-chartjs-2";
import { DatapointKeys, Datapoints, timeseries } from "../../utils/api";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
} from "chart.js";
import { useRouter } from "next/router";
import { uri } from "../../utils/common";
import HomeLink from "../../components/homelink";
import { getDefaultSettings } from "http2";
import Link from "next/link";

ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip
);

interface DetailsProps {
  symbol: string;
  data: Datapoints
}

function toDataset(data: Datapoints, key = DatapointKeys.close) {
  const dp: string[] = [];
  const labels: string[] = [];
  for (const date in data) {
    const stats = data[date];
    labels.push(date);
    dp.push(stats[key]);
  }
  return {
    labels,
    datasets: [
      {
        label: key,
        data: dp,
        borderColor: "rgb(255, 120, 120)",
        backgroundColor: "rbga(255, 120, 120, 0.5)",
        fill: false,
        tension: 0.1,
      },
    ],
  };
}

function getLatestData(data: Datapoints, key = DatapointKeys.close){
  const dp: string[] = [];
  const labels: string[] = [];
  return Object.entries(data).shift()!
}

function comparePreviousDay(data: Datapoints, key = DatapointKeys.close){
  const [
    [todayDate, todayData],
    [yesterdayDate, yesterdayData]
  ] = Object.entries(data)

  const yesterdayHigh = +yesterdayData[key]
  const todayHigh = +todayData[key]
  if(yesterdayHigh <= todayHigh){
    return <ChevronDoubleDownIcon className="h-4 w-4 inline text-red-500 fill-current"></ChevronDoubleDownIcon>
    
  }
  return <ChevronDoubleUpIcon className="h-4 w-4 inline text-green-500 fill-current"></ChevronDoubleUpIcon>
}

const Details: NextPage<DetailsProps> = (props) => {
  const router = useRouter()
  const current = new Date()
  return (
    <div className="container mx-auto">
      <HomeLink className="text-3xl mt-4" />
      <div className="card">
        <h1 className="text-3xl">{props.symbol} {`(${current.getDate()}/${current.getMonth()+1}/${current.getFullYear()})`}</h1>
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

        <div className="grid grid-cols-2">

          <div className="col-span-1 w-30">
            {(() => {
              const [date, data] = getLatestData(props.data)
              return <ul className="list-none text-2xl">
                <li>
                  <div className="inline-block">
                  <Link href="/glossary"><InformationCircleIcon title="Opening price that is first traded within a day.&#013;Click for more info..." className="cursor-pointer h-4 w-4 inline"></InformationCircleIcon></Link>
                    &nbsp;Open:
                  </div> {data[DatapointKeys.open]}&nbsp;{comparePreviousDay(props.data, DatapointKeys.open)}
                </li>
                <li>
                  <div className="inline-block">
                  <Link href="/glossary"><InformationCircleIcon title="Security's intraday highest trading price.&#013;Click for more info..." className="cursor-pointer h-4 w-4 inline"></InformationCircleIcon></Link>
                    &nbsp;High:
                  </div> {data[DatapointKeys.high]}&nbsp;{comparePreviousDay(props.data, DatapointKeys.high)}
                </li>
                <li>
                  <div className="inline-block">
                  <Link href="/glossary"><InformationCircleIcon title="Security's intraday lowest trading price.&#013;Click for more info..." className="cursor-pointer h-4 w-4 inline"></InformationCircleIcon></Link>
                    &nbsp;Low:
                  </div> {data[DatapointKeys.low]}&nbsp;{comparePreviousDay(props.data, DatapointKeys.low)}
                </li>
                <li>
                  <div className="inline-block">
                  <Link href="/glossary"><InformationCircleIcon title="Total number of buyers and sellers exchanging shares within a day. &#010;Click for more info..." className="cursor-pointer h-4 w-4 inline"></InformationCircleIcon></Link>
                    &nbsp;Volume:
                  </div> {data[DatapointKeys.volume]}&nbsp;{comparePreviousDay(props.data, DatapointKeys.volume)}
                </li>
                <li>
                  <div className="inline-block">
                  <Link href="/glossary"><InformationCircleIcon title="Last price that is traded within a day. Click for more info..." className="cursor-pointer h-4 w-4 inline"></InformationCircleIcon></Link>
                    &nbsp;Close:
                  </div> {data[DatapointKeys.close]}&nbsp;{comparePreviousDay(props.data, DatapointKeys.close)}
                </li>
              </ul>
            })()}
          </div>

          <div className="row-span-2">
            <Line
              data={toDataset(props.data)}
              options={{
                responsive: true,
                scales: {
                  x: { type: "category", reverse: true },
                  y: { type: "linear" },
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

export const getServerSideProps: GetServerSideProps<DetailsProps> =
  async context => {
    const s = context.params?.symbol ?? ""
    let scale: 'daily' | 'weekly' | 'monthly'
    switch (context.query.scale) {
      case 'daily':
      case 'weekly':
      case 'monthly':
        scale = context.query.scale
        break
      default:
        scale = 'daily'
        break
    }
    const full = !!context.query.full
    const symbol = typeof s === "string" ? s : s[0]
    const data = await timeseries({ symbol, scale, full })
    if (!data) return { notFound: true }
    return {
      props: {
        symbol,
        data,
      },
    }
  }
