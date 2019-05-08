import pandas as pd
import numpy as np
import csv
import json


def convertion(infile, outfile):
    # Open CSV file
    csvfile = open(infile, 'r')

    # Change appropriate filednames
    fieldnames = ("Categorie", "Aandeel")
    reader = csv.DictReader( csvfile, delimiter=";")
    list = []
    for row in reader:
        row["Aandeel"] = row["Aandeel"].replace(",",".")
        row["Aandeel"] = float(row["Aandeel"])
        list.append(row)

    out = json.dumps(list)

    # Save as JSON file
    jsonfile = open(outfile, 'w')
    jsonfile.write(out)

if __name__ == "__main__":
    convertion("zelfrapportage.csv", "zelfrapportage.json")
