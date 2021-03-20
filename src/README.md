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

Run the script `node -r esm loadData.js endomondo workouts.endomondo.20210131`

This will: 
* Create a new index called `workouts.endomondo.20210131`
* Add an index mapping telling ES how to map the fields in the documents
* Alias this index to `workouts` wich means we can e.g. reload the data and switch aliases, or load map my run data into a new index and add to the alias
* Load the contents of all the transformed JSON into the new index

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
Run `node -r esm loadMapMyRunData.js ../data/map.my.run.raw/filename.csv`

This will parse the csv and load into a new index in ES.
The index will be aliased to workouts.
Any old map my run indices will be unaliased but not removed.
