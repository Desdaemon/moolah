#!/usr/bin/env python3
import argparse
import tempfile
import time

from visualize import Visualize_Stocks
from datetime import datetime, timedelta
from subprocess import run as system

def unix_timestamp(datet: datetime):
    return int(time.mktime(datet.timetuple()))

BASE = "https://query1.finance.yahoo.com/v7/finance/download"

if __name__ == '__main__':
    parser = argparse.ArgumentParser(
        prog='yahoo',
        description='Create plots from Yahoo Finance data.'
    )
    parser.add_argument('symbol',
        metavar='SYMBOL',
        help='The symbol of a stock to generate plots for.'
    )
    parser.add_argument('-f', '--from',
        help='The datetime from which to process data.',
        type=datetime.fromisoformat,
        default=datetime.now() - timedelta(days=365)
    )
    parser.add_argument('-t', '--to',
        help='The datetime up until which to process data.',
        type=datetime.fromisoformat,
        default=datetime.now(),
    )
    parser.add_argument('-i', '--interval',
        help='The interval between data points.',
        default='1d',
    )
    parser.add_argument('-e', '--events',
        help='The kind of event to filter for.',
        choices=['history', 'div', 'split', 'capitalGain'],
        default='history',
    )
    parser.add_argument('--freq', '--frequency',
        help='The frequency of data points.',
        choices=['daily', 'weekly', 'monthly'],
        default='daily',
    )
    parser.add_argument('-o', '--output',
        help="Path to the output file (JPEG format)",
        default="out.jpg",
    )
    parser.add_argument('-m', '--metric',
        help='The data metric to process.',
        choices=['Open', 'High', 'Low', 'Close', 'Adj Close', 'Volume'],
        default='Close',
    )
    args = vars(parser.parse_args())
    period: timedelta = args['to'] - args['from']
    if year := period.days // 365:
        period_d = '{} year{}'.format(year, 's' if year > 1 else '')
    elif month := period.days // 28:
        period_d = '{} month{}'.format(month, 's' if month > 1 else '')
    else:
        period_d = '{} day{}'.format(period.days, '' if period.days == 1 else 's')

    _, file = tempfile.mkstemp()
    ret = system(["curl", "-L", "{}/{}?period1={}&period2={}&interval={}&events={}&includeAdjustedClose=true".format(
        BASE,
        args['symbol'],
        unix_timestamp(args['from']),
        unix_timestamp(args['to']),
        args['interval'],
        args['events'],
    ), '-o', file, '--fail-with-body'])

    with open(file, 'r') as f:
        print(''.join((f.readline() for _ in range(0, 4))))
    if ret.returncode != 0:
        exit(ret.returncode)
           
    Visualize_Stocks(
        stock_one=args['symbol'],
        file_path_one=file,
        desired_variable=args['metric'],
        time_period=period_d,
        result_file_path=args['output'],
    ).main()

