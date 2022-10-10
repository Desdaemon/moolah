import { GetServerSideProps, NextPage } from "next";
import { Datapoints, timeseries } from "../../utils/api";

interface DetailsProps {
  symbol: string
  data: Datapoints
}

const Details: NextPage<DetailsProps> = (props) => {
  return (
    <div className="container mx-auto">
      <div className="card">
        <h1 className="text-3xl">{props.symbol}</h1>
        <pre>{JSON.stringify(props.data, undefined, 2)}</pre>
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
