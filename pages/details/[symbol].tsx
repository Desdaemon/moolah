import { GetServerSideProps, NextPage } from "next";
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

const Details: NextPage<DetailsProps> = (props) => {
  const router = useRouter()
  return (
    <div className="container mx-auto">
      <div className="card">
        <h1 className="text-3xl">{props.symbol}</h1>
          <select
            name="scale"
            id="scale"
            title="Scale"
            className="rounded text-black my-2"
            defaultValue={router.query.scale}
            onChange={event => {
              router.replace(encodeURI(`/details/${props.symbol}?scale=${event.target.value}`))
            }}>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
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
