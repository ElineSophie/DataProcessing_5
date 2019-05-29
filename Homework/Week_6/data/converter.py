import pandas as pd


def dataframe():
    """
    Output a dataframe from a CSV file containing the data per
    specific columns
    """
    # Load in dataframe with missing values
    data = pd.read_csv("HPI_data.csv", sep=';', na_values="Data unavailable")

    df = data[["ISO", "HPI Rank", "Country", "Average Life Expectancy", "Average Wellbeing (0-10)", "Happy Planet Index"]]

    df.set_index("ISO", inplace=True)

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
    dataframe["HPI Rank"] = dataframe["HPI Rank"].astype(int)
    dataframe["Average Life Expectancy"] = dataframe["Average Life Expectancy"].str.replace(",",".").astype(float)
    dataframe["Average Wellbeing (0-10)"] = dataframe["Average Wellbeing (0-10)"].str.replace(",",".").astype(float)
    dataframe["Happy Planet Index"] = dataframe["Happy Planet Index"].str.replace(",",".").astype(float)
    dataframe["GlobalAverageLifeExpectancy"] = 70.9
    dataframe["GlobalAverageWellBeing"] = 5.4

    return dataframe


if __name__ == "__main__":
    # Load in CSV file and save
    dataframe = dataframe()

    # Clean up dataframe and save
    cleaned = clean_up(dataframe)

    # Write cleaned data to JSON file
    cleaned.to_json("HPI_data.json", orient="index")
