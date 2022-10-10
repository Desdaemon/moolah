import { GetServerSideProps, NextPage } from "next";
import { Line } from "react-chartjs-2";
import { DatapointKeys, Datapoints, timeseries } from "../../utils/api";
import { Chart as ChartJS, LineElement, PointElement, LinearScale, CategoryScale, Tooltip } from 'chart.js';

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Tooltip)

interface DetailsProps {
  symbol: string
  data: Datapoints
}

function toDataset(data: Datapoints, key = DatapointKeys.close) {
  const dp: string[] = []
  const labels: string[] = []
  for (const date in data) {
    const stats = data[date]
    labels.push(date)
    dp.push(stats[key])
  }
  return {
    labels,
    datasets: [{
      label: 'Close',
      data: dp,
      borderColor: 'rgb(255, 120, 120)',
      backgroundColor: 'rbga(255, 120, 120, 0.5)',
      fill: false,
      tension: 0.1,
    }]
  }
}

const Details: NextPage<DetailsProps> = (props) => {
  return (
    <div className="container mx-auto">
      <div className="card">
        <h1 className="text-3xl">{props.symbol}</h1>
        <Line
          data={toDataset(props.data)}
          options={{
            responsive: true,
            scales: {
              x: { type: 'category', reverse: true },
              y: { type: 'linear' },
            },
            plugins: {
              tooltip: {},
            },
          }} />
      </div>
    </div>
  )
}

export default Details

export const getServerSideProps: GetServerSideProps =
  async context => {
  const s = context.query.symbol ?? ''
  const symbol = typeof s === 'string' ? s : s[0]
  const data = await timeseries({ symbol, scale: 'daily' })
  return {
    props: {
      symbol,
      data
    }
  }
}
