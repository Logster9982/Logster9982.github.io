---
layout: post
title:  "How to access the Start.gg API with Python"
date:   2025-07-24 00:39:45 -0400
categories: Python
---
[Start.gg](https://start.gg/) has a very robust developer portal, but their documentation is a little on the light side. To help people learn how to use their API for a program, I've made a basic template that prints out data and shows you how to use Python's `requests` plugin to obtain data from the website.

The [Start.gg API](https://developer.start.gg/) uses [GraphQL](https://graphql.org/learn/) for querying requests, which is very good at getting specific data, but is difficult to learn how to use for a newcomer. Start.gg helps with this by offering an [API explorer](https://developer.start.gg/explorer/) to allow you to test requests. 

![The API data for the fetcher](/assets/startgg-api/APICoder.png)
*This is a picture of the API request through GraphQL*

This is the code the explorer gives to show the events avaliable alongside their internal ID. It takes a tournament and spits out the internal start.gg id for it, the name of the tournament, and every event name and id in said tournament. These requests won't show up yet because we haven't added the relavent information to fetch data yet, but that's where the bottom section comes in:

![Empty Variable Field](/assets/startgg-api/EmptyVarHead.png)

This section contains two important elements of an API request: The api key and the variable name, in this case a path to whoch tourney we want. We can use the variable tab to assign a value to the string we named slub above.

![Variables with slug filled in](/assets/startgg-api/VarHead.png)
*By putting the string in, the query now knows where to go when getting data.*

The header is where your API key goes, and Start.gg is very specific in that it *has* to go in the following template

![T header with an API key](/assets/startgg-api/APIKey.png)
*Replace the fake API key with a real one to access the data.*

After those are added in, just rerun the explorer! You should now see the data formatted in the side window.

![alt text](/assets/startgg-api/DataCollected.png)
*Viola*

You can see an array of arrays formatted nicely to the side of the window. I encourage you to try and mess around with what data you can request with start.gg. You can find a few more keys to access data from an event in the [glossary](https://developer.start.gg/docs/glossary). From here, we are going to move to accesing the data through code.

## Accessing the API with the Python Requests API

The GraphQL endpoint for start.gg is *very fickle* and requires specific variables to go through. We will need to use the Python `requests` library to be able to send a `POST` request to start.gg. In this request, there are three sections the `requests` module needs to obtain before communicating with start.gg.

* A URL
* A Header
* A JSON

### URL
The URL is the easiest, as it is always https://api.start.gg/gql/alpha.

### Header
The Header is the 2nd easiest. For this, just copy the formatting *exactly* from how the header was in the explorer:

 ```python
 {"Authorization": "Bearer 0000000000000"}
 ```

*Again make sure to replace only Zero's with your own api, keep the Bearer.*

You'll notice is that this has created a dictionary, don't forget this, as the next request requires us to put 2 dictionaries in a dictionary.

### JSON 
The hardest is the JSON. This is where you store both your variables and your query, and they must be in specific dictionary formatting. For the query, it needs to have the same spacing as we saw in the explorer, so I would suggest using triple quotes to make the string, letting you do something like this:

![query](/assets/startgg-api/query.png)
*This makes it a straight copy-paste job.*

The variables also need to be wrapped in a dictionary. Here's the example we used before:

```python
vars = {"slug": "tournament/genesis-9-1"}
```

Assuming you have your query in a variable, the final JSON variable should look like this:

```python
json={"query": query, "variables": vars}
```



### Requesting the Data
For the final recap, we will be sending a post request containing

1. A String variable named url equal the string to the start.gg api above. 

2. A dictionary variable named json containing the query and a dictionary of the variables keys.

3. A A dictionary variable named header that equals a dictionary containing the API key.

After all that is done, it should look like this:

```python
# Organizes the variables for the response.
url = "https://api.start.gg/gql/alpha"
vars = {"slug": "tournament/genesis-9-1"}
head = {"Authorization": "Bearer 000000000000"}
query = """ 
query TournamentQuery($slug: String) {
		tournament(slug: $slug){
			id
			name
			events {
				id
				name
			}
		}
}
"""

# Fetches data, then turns it into a long object of arrays.
response = requests.post(url=url, json={"query": query, "variables": vars}, headers=head) 
```

After this, just use JSON to read the request:

```python
data = json.loads(response.content)

print(data)
```

![The data from the print command on data](/assets/startgg-api/Data.png)
*viola (1)*

You now have the data in python! Remember that this is a Dictionary of Arrays, so to access the first event for example, you would need to use the following command:

```python
print(data["data"]["tournament"]["events"][0]["name"]
'Melee Singles'
```

I hope this helped you learn how to use the start.gg api! For a broad scope view (or a template to work off of) here's the full example code from the Explorer recreated in python.:

```python
# imports request for graphql rest fetches and json for parsing the result.
import requests 
import json


# Making the variables required for the POST request. The url for the endpoint, the header for the api token, 
# the query for the request, and variables for which tourney
url = "https://api.start.gg/gql/alpha"
vars = {"slug": "tournament/genesis-9-1"}
head = {"Authorization": "Bearer 00000000000000"}
query = """ 
query TournamentQuery($slug: String) {
		tournament(slug: $slug){
			id
			name
			events {
				id
				name
			}
		}
}
"""
# Fetches data, then turns it into a long object of arrays.
response = requests.post(url=url, json={"query": query, "variables": vars}, headers=head) 
data = json.loads(response.content)

# Print the first event
print(data)
```