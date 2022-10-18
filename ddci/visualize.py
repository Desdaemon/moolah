# imports
import argparse
import numpy as np
import pandas as pd
from datetime import datetime
from matplotlib import pyplot as plot


# class to visualize stock price via graphs
class Visualize_Stocks:
    
    # initialize parameters
    def __init__(self, stock_one, file_path_one, desired_variable, time_period,
                 stock_two = None, file_path_two = None, result_file_path = None, 
                 days_per_average = 7):
        self._stock_one = stock_one
        self._file_path_one = file_path_one
        self._desired_variable = desired_variable
        self._time_period = time_period
        self._stock_two = stock_two
        self._file_path_two = file_path_two
        self._result_file_path = result_file_path
        self._isTwoStocks = False
        self._days_per_average = days_per_average
        
        # see if there are two stocks given to plot
        if (file_path_two != None) and (stock_two != None):
            self._isTwoStocks = True
            
    
    # main method
    def main(self):
        # create paths for both images
        if self._result_file_path != None:
            path = self._result_file_path
        else:
            curr = datetime.now()
            year = curr.strftime("%Y")
            month = curr.strftime("%m")
            day = curr.strftime("%d")
            hour = curr.strftime("%H")
            minute = curr.strftime("%M")
            second = curr.strftime("%S")
            dateString = year + month + day + '_' + hour + minute + second
            
            folder = self._file_path_one.rsplit('/', 1)[0]
            path = folder + '/visualization_' + dateString + '.jpg'
            
        splitPath = path.rsplit('.')
        pathWoExt = splitPath[0]
        pricePlotPath = pathWoExt + '_price.' + splitPath[1]
        movingPlotPath = pathWoExt + '_moving.' + splitPath[1]
        
        
        # if one stock input
        if self._isTwoStocks == False:
            data = pd.read_csv(self._file_path_one, usecols = ['Date', self._desired_variable])
            pricePlot = self._graph_one_stock(data, self._stock_one, self._file_path_one, self._desired_variable, self._time_period)
            pricePlot.savefig(pricePlotPath, bbox_inches='tight')
            movingPlot = self._one_graph_moving_average(data, self._desired_variable, self._days_per_average)
            movingPlot.savefig(movingPlotPath, bbox_inches='tight')
        else:
            data = pd.read_csv(self._file_path_one, usecols = ['Date', self._desired_variable])
            data['stockTwoVals'] = pd.read_csv(self._file_path_two, usecols = [self._desired_variable])
            pricePlot = self._graph_two_stocks(data,self._stock_one, self._file_path_one, 
                                               self._desired_variable, self._time_period,
                                               self._stock_two, self._file_path_two)
            pricePlot.savefig(pricePlotPath, bbox_inches='tight')
            movingPlot = self._two_graph_moving_average(data, self._desired_variable, self._days_per_average)
            movingPlot.savefig(movingPlotPath, bbox_inches='tight')
        
     
    
    ###########################################################################
    #####
    ##### method to graph one stock price
    ##### 
    ##### @param data - the dataframe of data
    ##### @param stock - the stock symbol
    ##### @param path - the path to the stock price data
    ##### @param variable - the variable to look at in the data [ex. 'Close']
    ##### @param period - the time period of the data
    #####
    ###########################################################################
    def _graph_one_stock(self, data, stock, path, variable, period):
        # read data
        data = pd.read_csv(path, usecols = ['Date', variable])
        
        # get key variable values
        yLabel = variable + ' Price'
        beginPrice = data[variable][0]
        closePrice = data[variable][len(data) - 1]
        averagePrice = data[variable].mean()
        minPriceY = min(data[variable])
        maxPriceY = max(data[variable])
        
        # find min and max indices
        for index in range(len(data)):
            minIndexFound = False
            maxIndexFound = False
            if data[variable][index] == minPriceY:
                minPriceX = index
                minPriceDate = data['Date'][index]
                minIndexFound = True
            if data[variable][index] == maxPriceY:
                maxPriceX = index
                maxPriceDate = data['Date'][index]
                maxIndexFound = True
            if (minIndexFound == True) and (maxIndexFound == True):
                break
        
        # plot points    
        data.plot(kind = 'line', 
                      x = 'Date', 
                      y = variable, 
                      color = 'blue',
                      title = '{0} Price for Last {1}'.format(stock, period),
                      xlabel = 'Date', 
                      ylabel = yLabel,
                      legend = False)

        # plot beginning price line
        plot.axhline(y = beginPrice, 
                     color = 'orange', 
                     linestyle = 'dotted',
                     label = 'Open Price: {0}'.format(round(beginPrice, 2)))
        
        # plot close price line
        plot.axhline(y = closePrice, 
                     linestyle = 'none',
                     label = 'Close Price: {0}'.format(round(closePrice, 2)))

        # plot average price line
        plot.axhline(y = averagePrice, 
                     linestyle = 'none',
                     label = 'Average Price: {0}'.format(round(averagePrice, 2)))

        # plot points for max and min prricees
        plot.plot(maxPriceX, maxPriceY, color = 'green', marker=".", markersize = 15, label = 'Max Price: {0} [{1}]'.format(round(maxPriceY, 2), maxPriceDate))
        plot.plot(minPriceX, minPriceY, color = 'red', marker=".", markersize = 15, label = 'Min Price: {0} [{1}]'.format(round(minPriceY, 2), minPriceDate))

        plot.legend(bbox_to_anchor = (1, 1))
        
        return plot
    
    
    ###########################################################################
    #####
    ##### method to graph one stock moving average
    ##### 
    ##### @param data - the dataframe of data
    ##### @param variable - the variable to look at in the data [ex. 'Close']
    ##### @param daysPerAverage - the amount of days in the moving average
    #####
    ###########################################################################
    def _one_graph_moving_average(self, data, variable, daysPerAverage):    
        count = 0
        moving = []
        averages = []

        # create array of moving average values
        for val in data[variable]:
            if count != daysPerAverage:
                moving.append(val)
                averages.append(None)
                count += 1
            else:
                avg = np.mean(moving)
                averages.append(avg)
                del moving[0]
                moving.append(val)

        # add column to dataframe
        data['Moving Average for {0} Days'.format(daysPerAverage)] = averages    

        data.plot(x = 'Date', 
                  y = [variable, 'Moving Average for {0} Days'.format(daysPerAverage)])

        plot.title('{0} Price and {1} Day Moving Average'.format(variable, daysPerAverage))
        plot.xlabel('Date')
        plot.ylabel(variable + ' Price')

        return plot
        
        
    ################################################################################
    #####
    ##### method to graph two stocks
    ##### 
    ##### @param stockOne - the stock symbol of the first stock
    ##### @param pathOne - the path to the stock price data of the first stock
    ##### @param variable - the variable to look at in the data [ex. 'Close']
    ##### @param period - the time period of the data
    ##### @param stockTwo - the stock symbol of the second stock
    ##### @param pathTwo - the path to the stock price data of the second stock
    #####
    ################################################################################
    def _graph_two_stocks(self, data, stockOne, pathOne, variable, period, stockTwo, pathTwo):       
        # get key variable values
        closePriceOne = data[variable][len(data) - 1]
        closePriceTwo = data['stockTwoVals'][len(data) - 1]
        avgPriceOne = data[variable].mean()
        avgPriceTwo = data['stockTwoVals'].mean()
        

        # determine colors of stock lines
        colors = ['red', 'green']
        if closePriceOne > closePriceTwo:
            colors = ['green', 'red']

        # plot the data
        data.plot(x = 'Date', 
                  y = [variable, 'stockTwoVals'],
                  label = [stockOne, stockTwo],
                  color = colors)

        plot.title('{0} Price for Last {1}: {2} v. {3}'.format(variable, period, stockOne, stockTwo))
        plot.xlabel('Date')
        plot.ylabel(variable + ' Price')

        # plot close price line [one]
        plot.axhline(y = closePriceOne, 
                     linestyle = 'dotted',
                     color = colors[0],
                     label = 'Close Price {0}: {1}'.format(stockOne, round(closePriceOne, 2)))

        # plot close price line [two]
        plot.axhline(y = closePriceTwo, 
                     linestyle = 'dotted',
                     color = colors[1],
                     label = 'Close Price {0}: {1}'.format(stockTwo, round(closePriceTwo, 2)))
        
        # plot average price line [one]
        plot.axhline(y = avgPriceOne, 
                     linestyle = 'none',
                     label = 'Average Price {0}: {1}'.format(stockOne, round(avgPriceOne, 2)))
        
        # plot average price line [two]
        plot.axhline(y = avgPriceTwo, 
                     linestyle = 'none',
                     label = 'Average Price {0}: {1}'.format(stockTwo, round(avgPriceTwo, 2)))

        plot.legend(bbox_to_anchor = (1, 1))
        
        return plot
    
    
    ###########################################################################
    #####
    ##### method to graph one stock moving average
    ##### 
    ##### @param data - the dataframe of data
    ##### @param variable - the variable to look at in the data [ex. 'Close']
    ##### @param daysPerAverage - the amount of days in the moving average
    #####
    ###########################################################################
    def _two_graph_moving_average(self, data, variable, daysPerAverage):
        count = 0
        movingOne = []
        movingTwo = []
        averagesOne = []
        averagesTwo = []

        # create array of moving average values
        for index in range(len(data)):
            stockOneVal = data[variable][index]
            stockTwoVal = data['stockTwoVals'][index]
            if count != daysPerAverage:
                movingOne.append(stockOneVal)
                movingTwo.append(stockTwoVal)
                averagesOne.append(None)
                averagesTwo.append(None)
                count += 1
            else:
                avgOne = np.mean(movingOne)
                avgTwo = np.mean(movingTwo)
                averagesOne.append(avgOne)
                averagesTwo.append(avgTwo)
                del movingOne[0]
                del movingTwo[0]
                movingOne.append(stockOneVal)
                movingTwo.append(stockTwoVal)

        # add column to dataframe
        data['Moving Average for {0} Days {1}'.format(daysPerAverage, self._stock_one)] = averagesOne
        data['Moving Average for {0} Days {1}'.format(daysPerAverage, self._stock_two)] = averagesTwo

        data.plot(x = 'Date', 
                  y = ['Moving Average for {0} Days {1}'.format(daysPerAverage, self._stock_one), 
                       'Moving Average for {0} Days {1}'.format(daysPerAverage, self._stock_two)])

        plot.title('{0} Day Moving Average'.format(daysPerAverage))
        plot.xlabel('Date')
        plot.ylabel(variable + ' Price')

        return plot



if __name__ == '__main__':
    descrip = 'visualize stock(s)'
    arguments = argparse.ArgumentParser(description=descrip)

    arguments.add_argument('-s_1',
                           '--stock_one',
                           action='store',
                           type=str,
                           required=True,
                           help='the symbol of the first stock')
    arguments.add_argument('-p_1',
                           '--path_one',
                           action='store',
                           type=str,
                           required=True,
                           help='the file path of the first stock data')
    arguments.add_argument('-v',
                           '--desired_variable',
                           type=str,
                           required=True,
                           help='the desired variable to visualize')
    arguments.add_argument('-t',
                           '--time_period',
                           type=str,
                           required=True,
                           help='the time period of the data')
    arguments.add_argument('-s_2',
                           '--stock_two',
                           action='store',
                           type=str,
                           required=False,
                           default=None, 
                           help='the symbol of the second stock')
    arguments.add_argument('-p_2',
                           '--path_two',
                           action='store',
                           type=str,
                           required=False,
                           default=None, 
                           help='the file path of the second stock data')
    arguments.add_argument('-r',
                           '--result_path',
                           action='store',
                           type=str,
                           required=False,
                           default=None, 
                           help='the file path of the result')
    arguments.add_argument('-d',
                           '--days',
                           action='store',
                           type=int,
                           required=False,
                           default=7, 
                           help='the amount of days included in moving average [default=7]')

    parsed = arguments.parse_args()
    variables = vars(parsed)

    stockOne = variables['stock_one']
    pathOne = variables['path_one']
    desiredVar = variables['desired_variable']
    period = variables['time_period']
    stockTwo = variables['stock_two']
    pathTwo = variables['path_two']
    result = variables['result_path']
    days = variables['days']

    Visualize_Stocks(stockOne, pathOne, desiredVar, period, stockTwo, pathTwo, result, days).main()




# run one stock example
# /usr/local/bin/python3 /Users/mtjen/Desktop/395/visualize.py -s_1 'AAPL' -p_1 '/Users/mtjen/Desktop/395/AAPL.csv' -v 'Close' -t '1Y' -r '/Users/mtjen/Desktop/395/AAPL_result.jpg' -d 25

# run two stocks example
# /usr/local/bin/python3 /Users/mtjen/Desktop/395/visualize.py -s_1 'AAPL' -p_1 '/Users/mtjen/Desktop/395/AAPL.csv' -v 'Close' -t '1Y' -s_2 'ZS' -p_2 '/Users/mtjen/Desktop/395/ZS.csv'
