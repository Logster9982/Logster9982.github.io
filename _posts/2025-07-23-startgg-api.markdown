---
layout: post
title:  "How to access the Start.gg API with Python"
date:   2025-07-24 00:39:45 -0400
categories: Python
---
You'll find that [start.gg](https://start.gg/) has a very robust developer portal, but their documentation is a little on the light side. To help people learn how to use their API, I've made a basic template that prints out data and shows you how to use Python's `requests` plugin to obtain data from the website.

The [Start.gg API](https://developer.start.gg/) uses [GraphQL](https://graphql.org/learn/) for querying requests, which is very good at getting specific data, but is difficult to learn how to use for a newcomer. Start.gg helps with this by offering an [API explorer](https://developer.start.gg/explorer/) to allow you to test requests. 

![The API data for the fetcher](/assets/startgg-api/APICoder.png)

This is the code the explorer gives to show the events avaliable alongside their internal ID. However, we can't get anything, but that's where the bottom section comes in:

![Empty Variable Field](/assets/startgg-api/EmptyVarHead.png)

You can use the variables tab to add in any of the strings to the list, letting you get the tournament data.

![Variables with slug filled in](/assets/startgg-api/VarHead.png)
*By putting the string in, the query now knows where to go when getting data.*

The header is where your API key goes, and Start.gg is very specific in that it *has* to go in the following template

```
{"Authorization": "Bearer 0000000000000"}
```

![T header with an API key](/assets/startgg-api/APIKey.png)
*Replace the fake API key with a real one to access the data.*

After those are added in, just rerun the explorer and you should be good to go

![alt text](/assets/startgg-api/DataCollected.png)
*Viola*

You will now see an array of arrays formatted nicely to the side of the window. From here, you should now be able to play around with what you can get from the explorer. You can find a few more keys to access data from an event in the [glossary](https://developer.start.gg/docs/glossary). Mix and match to get the data you want, but what about when you want to access this data in your code?

## Accessing the API with the Python Requests API

The GraphQL endpoint for start.gg is *very fickle* and requires specific variables to go through. We will recreate the explorer in the code. To start, there is the three sections of the request to the API:

* The URL
* The Header
* The JSON

### URL
The URL is the easiest, as it is always `https://api.start.gg/gql/alpha`.

### Header
The Header is the 2nd easiest. For this, just copy the formatting *exactly* from how the header was:

 `{"Authorization": "Bearer 0000000000000"}`

*Again make sure to replace only Zero's with your own api, keep the Bearer.*

You'll notice is that this has created a dictionary, don't forget this, as the next request requires us to put 2 dictionaries in a dictionary.

### JSON 
The hardest is the JSON. This is where you store both your variables and your query, and they must be in the exact formatting as before. For the query, it needs to have the same spacing as before, so if we want to keep the same request as the explorer I show above, you want to make a variable like this:

![query](/assets/startgg-api/query.png)

This keeps the same spacing and format by using the three double quotes in python.

The variables also need to match the explorer example, so you need to wrap them in a dictionary again. Here's the example we used before:

`vars = {"slug": "tournament/genesis-9-1"}`

### Requesting the Data
for the final section, we need to add these into the requests api in a way it likes. For API expects a POST request, so use `requests.POST()` to add the data.

1.  Add a url variable inside the post request and have it equal the string to the start.gg api above. 

2. Add a json variable inside that equals a dictionary containing the query and variables keys **in that order**. 

3. Add a headers variable inside that equals the dictionary containing the Authorization key.

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

`data = json.loads(response.content)`

`print(data)`

![The data from the print command on data](/assets/startgg-api/Data.png)
*viola (1)*

You now have the data in python! Remember that this is a Dictionary of Arrays, so to access the first event for example, you would need to use the following command:

`print(data["data"]["tournament"]["events"][0]["name"]`
`Melee Singles`

I hope this helped you learn how to use the start.gg api, here's the full example code here:

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
print(data["data"]["tournament"]["events"][0]["name"])
```