### Description

Basic repo to extract Endomondo data into ElasticSearch

### Requirements

Requires docker (to run ES/Kibana) and node to run transformations.

### Notes

The raw json is a bit weird, each file is an array of objects where each object has a single key and a value - we need to turn this array into an object with sensible keys and values.

At the same time, we translate some fields, strip some out and tidy up some problems with my specific tags.

### Instructions

* Copy all `.json` files from `/Workouts` in Endomondo zip into `/data/endomondo.raw`
* Run `node transform.js` from inside `/src` directory.

This will create transformed versions of each workout in `/data/array.to.object`

* Run `docker-compose up` from inside `/src` directory

Kibana is now available on localhost port 5601.  ElasticSearch is now available on localhost port 9200

* Open http://localhost:5601 to visit Kibana UI

Next we want to create an index and a mapping to tell ES what types to use when we import data.  

* Inside Kibana choose Hamburger menu and then scroll down and select dev tools from under Management.

This lets us send API requests to ElasticSearch - we could do this externally through the API, but I don't have that setup yet.

Copy the contents of `/src/mappings`, paste into dev tools and run each of the 3 requests.  (DELETE request will fail first time, so doesn't need to be run)

We can now load data into ElasticSearch - the following nasty bash snippet will do the trick

`ls data/array.to.object/*.json | sed "s/\(.*\)/curl -X POST -H \"Content-Type: application\/json\" -d '@\1' http:\/\/localhost:9200\/workouts\/_doc/" | bash`

This will use curl to add every transformed JSON file to the workouts index within ElasticSearch.

Finally set up Kibana to work with the new index

* Hamburger menu -> stack management under Management.
* Then choose index patterns under Kibana
* Click create index pattern
* Set the pattern to `workouts`
* Select a time field (Start time?)
* Click `Create Index Pattern`

Now we can start querying the data

* Hamburger menu -> Kibana -> Visualisation
* Click `Create new visualisation`
* Select a chart (e.g. Pie)
* Choose workouts
* Update date filter in top right to show entire date range
* Then you e.g. click add a bucket
* Split slices
* Choose a terms aggregation
* Choose `sport.keyword` field
* Now have a pie chart showing all activities split by sport.

### Map My Run

Put the CSV in `data/map.my.run.raw/`
Run `node transform2.js data/map.my.run.raw/filename.csv`
Load to ES with:

`ls data/csv.to.object/*.json | sed "s/\(.*\)/curl -X POST -H \"Content-Type: application\/json\" -d '@\1' http:\/\/localhost:9200\/workouts\/_doc/" | bash`

### Next steps

* Add scripts to create mappings/load data
* Load data into different indexes, we can then use an alias to choose what data we want to include - means we can load new data without destroying old data
* Improve import process for map my run CSV