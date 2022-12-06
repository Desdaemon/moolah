# imports
import argparse
import matplotlib.pyplot as plot
import pandas as pd
from datetime import datetime


# class to visualize census data via graphs
class Visualize_Census:

    # initialize parameters
    def __init__(self, data_folder_path, is_wealth, table_number, category, sub_category,
                     group, sub_group):
        self._data_folder_path = data_folder_path
        self._is_wealth = is_wealth
        self._table_number = table_number
        self._category = category
        self._sub_category = sub_category
        self._group = group
        self._sub_group = sub_group
        self._years = [2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020]
        
        
    # main method
    def main(self):
        curr = datetime.now()
        year = curr.strftime("%Y")
        month = curr.strftime("%m")
        day = curr.strftime("%d")
        hour = curr.strftime("%H")
        minute = curr.strftime("%M")
        second = curr.strftime("%S")
        dateString = year + month + day + '_' + hour + minute + second
        outputPath = self._data_folder_path + 'census_viz_' + dateString + '.jpg'
        
        plot = self._graph()
        plot.savefig(outputPath)
            
        
    
    ###########################################################################
    #####
    ##### method to create a dataframe for excel table
    ##### 
    ##### @param year - the data year
    #####
    ###########################################################################
    def _create_dataframe(self, year):
        year = str(year)
        dataLocation = self._data_folder_path
        
        if self._is_wealth == True:
            dataLocation += 'wealth/'
        else:
            dataLocation += 'debt/'
        filePath = dataLocation + year + '.xlsx'
        
        sheet = pd.read_excel(filePath, 
                      header = [2, 3],
                      index_col = [0],
                      sheet_name = self._table_number)
        
        return sheet
    
    
    ###########################################################################
    #####
    ##### method to get desired value for the data year
    ##### 
    ##### @param sheet - the excel sheet
    #####
    ###########################################################################
    def _get_value(self, sheet):
        value = sheet[self._category][self._sub_category][self._sub_group]
        return value
    
    
    ###########################################################################
    #####
    ##### method to create data to be used for graph
    #####
    ###########################################################################
    def _generate_data(self):
        dataVals = []
        
        for year in self._years:
            sheet = self._create_dataframe(year)
            value = self._get_value(sheet)
            dataVals.append(value)
            
        return dataVals
    
    
    ###########################################################################
    #####
    ##### method to create graph
    #####
    ###########################################################################
    def _graph(self):
        dataValues = self._generate_data()
        
        wealthOrDebt = 'Wealth'
        if self._is_wealth == False:
            wealthOrDebt = 'Debt'
        
        title = '{0} from 2013-2020\n Category: {1} - {2}\n Group: {3}'.format(
            wealthOrDebt, self._category, self._sub_category, self._sub_group)
        
        fig, ax = plot.subplots()
        ax.set_xlabel('Year')
        ax.set_ylabel('Value')
        ax.set_title(title)
        barVals = ax.bar(self._years, dataValues)
        ax.bar_label(barVals)
        
        return plot
    
    
if __name__ == '__main__':
    descrip = 'visualize census data'
    arguments = argparse.ArgumentParser(description = descrip)

    arguments.add_argument('-p',
                           '--data_folder_path',
                           action='store',
                           type=str,
                           required=True,
                           help='file path of data')
    arguments.add_argument('-w',
                           '--is_wealth',
                           action='store',
                           type=bool,
                           required=False,
                           default=True,
                           help='set False if looking for debt [default = True]')
    arguments.add_argument('-t',
                           '--table_number',
                           action='store',
                           type=int,
                           required=True,
                           help='table index')
    arguments.add_argument('-c',
                           '--category',
                           action='store',
                           type=str,
                           required=True,
                           help='the category for data')
    arguments.add_argument('-s_c',
                           '--sub_category',
                           action='store',
                           type=str,
                           required=True,
                           help='the subcategory for data')
    arguments.add_argument('-g',
                           '--group',
                           action='store',
                           type=str,
                           required=True,
                           help='the group for data')
    arguments.add_argument('-s_g',
                           '--sub_group',
                           action='store',
                           type=str,
                           required=True,
                           help='the subgroup for data')

    parsed = arguments.parse_args()
    variables = vars(parsed)

    path = variables['data_folder_path']
    wealth = variables['is_wealth']
    table = variables['table_number']
    cat = variables['category']
    subCat = variables['sub_category']
    group = variables['group']
    subGroup = variables['sub_group']

    Visualize_Census(path, wealth, table, cat, subCat, group, subGroup).main()
    

# example
# /usr/local/bin/python3 /Users/mtjen/Desktop/395/census.py -p '/Users/mtjen/desktop/table_data/' -w True -t 2 -c 'Percent Owning Assets at Financial Institutions' -s_c 'Total' -g 'Race' -s_g 'White alone'