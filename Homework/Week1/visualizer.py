#!/usr/bin/env python
# Name:
# Student number:
"""
This script visualizes data obtained from a .csv file
"""

import csv
import numpy as np
import matplotlib.pyplot as plt

# Global constants for the input file, first and last year
INPUT_CSV = "movies.csv"
START_YEAR = 2008
END_YEAR = 2018

# Global dictionary for the data
data_dict = {str(key): [] for key in range(START_YEAR, END_YEAR)}


if __name__ == "__main__":

    # Read in csv file
    with open(INPUT_CSV) as csvfile:
        reader = csv.DictReader(csvfile)

        # Append csv file to dictionary
        for row in reader:
            data_dict[row['Year']].append(float(row['Rating']))

    # Calculate the averages by key
    averages = {}
    for k, v in data_dict.items():
        averages[k] = sum(v) / float(len(v))

    # Sorted by key and return list
    list_keys = sorted(averages.items())
    x, y = zip(*list_keys)

    # Create a plot
    plt.plot(x, y, 'k-', x, y, 'ro')
    plt.title('Average rating a movie in top 50 of IMDB', fontsize=18, color='darkblue')
    plt.xlabel('Year of release', fontsize=14)
    plt.ylabel('Average rating', fontsize=14)
    plt.ylim(8,9)
    plt.show()
