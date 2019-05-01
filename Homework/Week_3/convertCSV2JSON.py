import csv
import json


def convertion(infile, outfile):
    # Open CSV file
    csvfile = open(infile, 'r')

    # Change appropriate filednames
    fieldnames = ("Year", "Total Burnout Rate")
    reader = csv.DictReader( csvfile, delimiter=";")
    out = json.dumps( [ row for row in reader ] )

    # Save as JSON file
    jsonfile = open(outfile, 'w')
    jsonfile.write(out)

if __name__ == "__main__":
    convertion("burnout.csv", "burnout.json")
