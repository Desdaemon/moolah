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
  Filler,
} from "chart.js";
import { useRouter } from "next/router";
import { queryOr, uri, Series, SeriesKeys, Hsl} from "../../utils/common";
import HomeLink from "../../components/homelink";
import Link from "next/link";
import { symbolData } from "../../utils/server";
import { col as plCol } from 'nodejs-polars'

ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Filler,
);

type Datapoints = Series;

interface DetailsProps {
  symbol: string;
  data: Datapoints
}

function toDataset(data: Datapoints, ...keys: string[]) {
  if (!keys.length) keys = ['Close Avg', SeriesKeys.close]
  const labels = data.Date
  const datasets = keys.map(key => {
    const fg = Hsl.random(undefined, 100, 75)
    return {
      label: key,
      data: data[key],
      borderColor: fg.toString(),
      fill: key.endsWith('Avg') ? false : {
        target: 'origin',
        above: fg.withAlpha(0.2).toString(),
        below: 'hsla(0, 0%, 0%, 0)',
      },
      tension: 0.1,
      pointRadius: 0,
    }
  })
  return { labels, datasets };
}

// function color(alpha?: number) {
//   const hue = Math.random() * 360
//   if (typeof alpha !== 'undefined') {
//     return `hsla(${hue}, 100%, 32.9%, ${alpha})`
//   } else {
//     return `hsl(${hue}, 100%, 32.9%)`
//   }
// }

// const rand255 = () => Math.floor(Math.random() * 255)

function getLatestData(data: Datapoints, key = SeriesKeys.close) {
  return (data[key][0] as number).toFixed(2)
}

function comparePreviousDay(data: Datapoints, key = SeriesKeys.close) {
  const [todayData, yesterdayData] = data[key]

  const yesterdayHigh = +yesterdayData[key]
  const todayHigh = +todayData[key]
  if (yesterdayHigh <= todayHigh) {
    return <BsChevronDoubleDown className="h-4 w-4 inline text-red-500 fill-current" />
  }
  return <BsChevronDoubleUp className="h-4 w-4 inline text-green-500 fill-current" />
}

const DetailsPage: NextPage<DetailsProps> = props => {
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
                  {getLatestData(props.data, SeriesKeys.open)}
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
                  {getLatestData(props.data, SeriesKeys.high)}{' '}{comparePreviousDay(props.data, SeriesKeys.high)}
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
                  {getLatestData(props.data, SeriesKeys.low)}{' '}{comparePreviousDay(props.data, SeriesKeys.low)}
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
                  {getLatestData(props.data, SeriesKeys.volume)}{' '}{comparePreviousDay(props.data, SeriesKeys.volume)}
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
                  {getLatestData(props.data, SeriesKeys.close)}{' '}{comparePreviousDay(props.data, SeriesKeys.close)}
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

export default DetailsPage

export const getServerSideProps: GetServerSideProps<DetailsProps> = async context => {
  const symbol = queryOr(context.query.symbol)
  if (!symbol) return { notFound: true }
  let interval: string
  switch (context.query.scale) {
    case 'weekly':
      interval = '1wk'
      break
    case 'monthly':
      interval = '1mo'
      break
    case 'daily':
    default:
      interval = '1d'
  }
  const {data, error} = await symbolData(symbol, { interval })
  if (error) {
    if (error.code == 404) return {notFound: true}
    throw new Error(error.message)
 }
  
  const windowSize = Math.ceil(data.getColumn('Date').len() / 18)
  const data_ = data
    .withColumn(plCol('Close').rollingMean({ windowSize, minPeriods: 0 }).as('Close Avg'))
    .sort('Date', true)
    .withColumn(plCol('Date').date.strftime('%Y-%m-%d'))
  return {
    props: {
      symbol,
      data: data_.toObject() as any
    }
  }
}
