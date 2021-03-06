#!/usr/bin/env python
# Name:
# Student number:
"""
This script scrapes IMDB and outputs a CSV file with highest rated movies.
"""

import csv
import re
from requests import get
from requests.exceptions import RequestException
from contextlib import closing
from bs4 import BeautifulSoup


TARGET_URL = "https://www.imdb.com/search/title?title_type=feature&release_\
date=2008-01-01,2018-01-01&num_votes=5000,&sort=user_rating,desc"
BACKUP_HTML = 'movies.html'
OUTPUT_CSV = 'movies.csv'


def extract_movies(dom):
    """
    Extract a list of highest rated movies from DOM (of IMDB page).
    Each movie entry should contain the following fields:
    - Title
    - Rating
    - Year of release (only a number!)
    - Actors/actresses (comma separated if more than one)
    - Runtime (only a number!)
    """

    # Extract data per movie
    movies = dom.find_all('div', class_ = 'lister-item mode-advanced')

    # Make an empty list
    movies_list = []

    # For every movie look into the data
    for movie in movies:

        # Create an empty dictionary
        moviedict = {}

        # Fill the dictionary with title and rating
        moviedict['title'] = movie.h3.a.text
        moviedict['rating'] = float(movie.strong.text)

        # Year of release, strip the string where necessary, only take
        # year and append to dictionary
        year = movie.find("span", class_="lister-item-year text-muted unbold")
        year = year.get_text()
        if len(year) > 6:
            year = year[-6:]
            year = year.strip("()")
        else:
            year = year.strip("()")
        moviedict['year'] = year

        # Loop over actors/actresses, store as list and make string to
        # fill in the dictionary
        actors = movie.find_all(href=re.compile("adv_li_st"))
        list_actors = []
        for actor in actors:
            list_actors.append(actor.text)
        actors_string = ", ".join(list_actors)
        moviedict['actors/actresses'] = actors_string

        # Only take the number of runtime and append to dictionary
        runtime = movie.find("span", class_="runtime")
        runtime = runtime.get_text()
        runtime = runtime.split(" ")[0]
        moviedict['runtime'] = runtime

        # Append dictionary to list
        movies_list.append(moviedict)

    # Return the list
    return movies_list


def save_csv(outfile, movies_list):
    """
    Output a CSV file containing highest rated movies.
    """
    writer = csv.writer(outfile)
    writer.writerow(['Title', 'Rating', 'Year', 'Actors', 'Runtime'])

    # Write values into csv file
    for movie in movies_list:
        writer.writerow([movie["title"], movie["rating"], movie["year"],
        movie["actors/actresses"], movie["runtime"]])


def simple_get(url):
    """
    Attempts to get the content at `url` by making an HTTP GET request.
    If the content-type of response is some kind of HTML/XML, return the
    text content, otherwise return None
    """
    try:
        with closing(get(url, stream=True)) as resp:
            if is_good_response(resp):
                return resp.content
            else:
                return None
    except RequestException as e:
        print('The following error occurred during HTTP GET request to {0} : \
              {1}'.format(url, str(e)))
        return None


def is_good_response(resp):
    """
    Returns true if the response seems to be HTML, false otherwise
    """
    content_type = resp.headers['Content-Type'].lower()
    return (resp.status_code == 200
            and content_type is not None
            and content_type.find('html') > -1)


if __name__ == "__main__":

    # get HTML content at target URL
    html = simple_get(TARGET_URL)

    # save a copy to disk in the current directory, this serves as an backup
    # of the original HTML, will be used in grading.
    with open(BACKUP_HTML, 'wb') as f:
        f.write(html)

    # parse the HTML file into a DOM representation
    dom = BeautifulSoup(html, 'html.parser')

    # extract the movies (using the function you implemented)
    movies = extract_movies(dom)

    # write the CSV file to disk (including a header)
    with open(OUTPUT_CSV, 'w', newline='') as output_file:
        save_csv(output_file, movies)
