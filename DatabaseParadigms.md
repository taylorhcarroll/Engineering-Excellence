# 7 Database Paradigms

## 1. Key-Value
Redis, Memcached, ETCD

![key-value](/images/key-value.png)

The database itself is structured like a python dictionary or javasscript object

in redis for example you can read and write data using commands:
```
redis> SET user:23:bio "I like turtles"
>> OK

redis > GET user:23:bio
>> "I like turtles"
```
In the case of redis and memchached, all the data is held in the machines memory.

![memcached](/images/memcache.png)

As opposed to other databases that keep their data on the disk. This limits the amount of data you can store, but makes the database extremely fast. It also does not perform queries or joins so you are limited in your datamodeling, but again super fast, like sub-milisecond fast.

Apps like github use redis for real tile delivery of their data.

Best for caching, pub/sub, leaderboards

More often, key/value databases are used as a cached on top of more persistent data layer.
![memcache2](/images/memcache2.png)

## 2. Wide Column
HBASE, Cassandra

![wide-column](/images/wide-column.png)
Similar to a key/value db but you've essentially added another dimension to it.

At the outer layer, you have a key space, which holds one or more column families, and each column family holds a set of ordered rows.

This makes it possible to group related data together, but unlike a relational db, it doesn't have a schema, so it can handle unstructured data. This is nice for devs, because you get a language called CQL, that's similar to SQL, although much more limited, and you can't do joins. However it's much easier to scale up and replicate data across nodes, unlike an SQL db, it's decentralized, and can scale horizontally.

```
SELECT * | select_expression
FROM [keyspace_name.] table_name
[WHERE partition_value
    [AND clustering_filters]
[ORDER BY PK_column_name ASC|DESC]
[LIMIT N]
```

![wide-column scaling](/images/wide-column2.png)

BEST FOR:
- Time-series
- Historical (netflix record of shows you've watched)
- high-write, low-read

ie: records for IOT device, weather sensors, netflix history

## 3. Document Oriented Database
MongoDB, FireStore, DynamoDB, CouchDB, etc
![document DB](/images/document.png)

Documents, where each document is a container for key-value pairs. **Unstructured**, and don't required a schema. Then documents are grouped together in collections.

Fields within a collection can be indexed.And collections can be organized into a logical hierarchy, allowing you to model and retrieve relational data to a significant degree.
![document2](/images/document2.png)

TRADEOFF:
- schema-less +
- relational-ish queries +
- no joins -

Don't support Joins, so instead, of normalizing data into a bunch of small parts, you're encouraged to embed the data into a single document.

This creates a tradeoff, where reads from a front-end app are much faster, however writing or updating data tends to be more complex.

Document DB's are far more general purpose than other DB's looked at so far.

BEST FOR:
- Most apps
- Games
- IOT
- Content Management

If unsure of how data is structured, document database is a great place to start.

Wher they generally fall short is when you have a lot of disconnected but related data that is updated often, like a social app that has many users, that has many friends, who have many comments, who have many likes, and you wanna see comments that your friends like.

NOT IDEAL FOR:
- Graphs

Data like this needs to be joined, and it's not easily done in a document DB at scale.

## 4. Relational Database


