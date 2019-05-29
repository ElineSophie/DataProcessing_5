import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import json
from scipy import stats
from numpy import percentile

def dataframe():
    """
    Output a dataframe from a CSV file containing data per specific
    columns.
    """

    # Making list of missing values
    missing_values = ["unknown", "NaN"]

    # Load in dataframe with NaN as missing values
    data = pd.read_csv("input.csv", sep=',', na_values=missing_values)

    df = data[["Country", "Region", "Pop. Density (per sq. mi.)", \
            "Infant mortality (per 1000 births)", "GDP ($ per capita) dollars"]]
    # Remove index
    df.set_index("Country", inplace=True)

    # Return dataframe
    return df

def clean_up(dataframe):
    """
    Function for cleaning up the dataframe. String are being removed
    and replaced by floats. Rows with missing values are removed and
    rows with outstanding values that are not representative are also
    deleted.
    """

    # Remove the strings and replace
    dataframe["GDP ($ per capita) dollars"] = dataframe["GDP ($ per capita) dollars"].str.strip(" dollars")
    dataframe["Region"] = dataframe["Region"].str.replace(" ","")
    dataframe["Pop. Density (per sq. mi.)"] = dataframe["Pop. Density (per sq. mi.)"].str.replace(",",".").astype(float)
    dataframe["Infant mortality (per 1000 births)"] = dataframe["Infant mortality (per 1000 births)"].str.replace(",",".").astype(float)
    dataframe["GDP ($ per capita) dollars"] = dataframe['GDP ($ per capita) dollars'].astype(float)

    # Remove rows
    dataframe.dropna(inplace=True)
    dataframe = dataframe.drop(dataframe['GDP ($ per capita) dollars'].idxmax())

    return dataframe

def calculate(cleaned):
    """
    Function for calculations. For GDP dollars this function will Calculate
    the central tendency. For infant mortality it will calculate the Five
    number summary. Lastly, it will print the calculations.
    """

    # Calculate Central Tendency
    mean = cleaned["GDP ($ per capita) dollars"].mean()
    median = cleaned["GDP ($ per capita) dollars"].median()
    mode = cleaned["GDP ($ per capita) dollars"].mode()[0]

    # Print the calculations
    print("The mean of GDP dollars is: %.2f" % mean)
    print("The median of GDP dollars is: %.2f" % median)
    print("The mode of GDP dollars is: %.2f" % mode)

    # Calculate Five Number Summary
    min = cleaned["Infant mortality (per 1000 births)"].min()
    max = cleaned["Infant mortality (per 1000 births)"].max()
    quartiles = percentile(cleaned["Infant mortality (per 1000 births)"], [25, 50, 75])

    # Print the calculations
    print('Minimum Infant Mortality: %.2f' % min)
    print('Q1 Infant Mortality: %.2f' % quartiles[0])
    print('Median Infant Mortality: %.2f' % quartiles[1])
    print('Q3 Infant Mortality: %.2f' % quartiles[2])
    print('Max Infant Mortality: %.2f' % max)

def visualisation(cleaned):
    """
    Visualizing a histogram for GDP and a boxplot for infant mortality
    in the same plot.
    """

    fig, axs = plt.subplots(1, 2, constrained_layout=True)
    fig.suptitle('Infant Mortality and GDP dollars', fontsize=16)

    # Subplot for GDP
    axs[0].hist(cleaned["GDP ($ per capita) dollars"])
    axs[0].set_title('GDP ($ per capita) dollars')
    axs[0].set_xlabel('GDP')
    axs[0].set_ylabel('Number of Countries')

    # Subplot for infant mortality
    axs[1].boxplot(cleaned["Infant mortality (per 1000 births)"])
    axs[1].set_title('Infant Mortality Rate Boxplot')
    axs[1].set_xticklabels(["Infant Mortality (per 1000 births)"])

    plt.show()

if __name__ == "__main__":
    # Load in CSV file and save
    dataframe = dataframe()

    # Clean up dataframe and save
    cleaned = clean_up(dataframe)

    # Give documentation of data
    calculate(cleaned)

    # Visualize the cleaned dataframe
    visualisation(cleaned)

    # Write cleaned data to JSON file
    cleaned.to_json("ds.json", orient="index")
