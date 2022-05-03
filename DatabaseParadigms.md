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

Apps like github use redis for real time delivery of their data.

Best for caching, pub/sub, leaderboards

More often, key/value databases are used as a cache to reduce data latency (you wouldn't want to use this as your main db) on top of more persistent data layer.
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

Where they generally fall short is when you have a lot of disconnected but related data that is updated often, like a social app that has many users, that has many friends, who have many comments, who have many likes, and you wanna see comments that your friends like.

NOT IDEAL FOR:
- Graphs

Data like this needs to be joined, and it's not easily done in a document DB at scale.

## 4. Relational Database
MySQL, PostGres, and SQL Server
Example query:

```
SELECT Orders.OrderID, Customers.CustomerName
FROM Orders
INNER JOIN Customers ON Orders.CustomerID = Customers.CustomerID
```
Probably most familar with this type as it is the most common, will do further documentation on another page with a cheatsheet of popular query joins, and maybe some stored procedure guides or common date stuff.

![relational](/images/relational_db.png)

The id of something in a table is a primary key.

The "engine_id" or "prop_id" on the airplane table are foreign keys, because they refer to the primary key, from another table. We can join on the foregin keys to get more info from that particular part in other columns.

Potential drawback, is it needs a schema and so you need to know the shape upfront of your data. That said, relational databases are **ACID** compliant.

**ACID**, meaning **A**tomicity, **C**onsistency, **I**solation,and **D**urability.

means, whenever there's a transaction in the db, data validity is guranateed, even if there are network or hardware failures. Good for banks and other finanacial institutions, but harder to scale. Note: there are modern relational databases like CockroachDB which are designed to operate at scale.

BEST FOR: Most apps<br>
NOT IDEAL FOR: unstructured data
## 5. Graph Database
Neo4J and DGraph

So what if rather than modeling a relationship in a schema, we just treated the relationship itself as data.
Enter, Graph databases.

![graph](/images/graph_db.png)

The data itself is represented as a **node**, and the relationships between them as **edges**.

![relational-vs-graph](/images/relational_vs_graph.png)

In a relational DB, we might have a join table to show the **many-to-many** relationship between depts and employees, and we do that by putting respective foreign keys in that join table.

In a graph db, we don't need this middle man table, we define and **edge**, and connect that to the other record.

We can now query this data in a statement that is much more concise and readable.

SQL
```
SELECT name FROM Person
LEFT JOIN Person_Department
    ON Person.Id = Person_Department.PersonId
LEFT JOIN Department
    ON Department.Id = Person_Department.DepartmentId
WHERE Department.name = "IT Department"
```

condenses down to:

CYPHER (neo4j)
```
MATCH (p:Person)-[:WORKS_AT:]->(d:Dept)
WHERE d.name = "IT Department"
RETURN p.name
```

In addition, we can now achieve better performance, especially on larger datasets. Graph databases can be a great alternative to relational dbs, especially if you're running a lot of joins, and performance is taking a hit due to that.

BEST FOR:
- Graphs!
- Knowledge Graphs
- Reccomendation Engines

Often used for fraud detection in finance, for building internal knowledge graphs, and power recc engines, like the one used for AirBnB.

## 6. Search Engines
Elastisearch, Solr, or (cloud-based options like) MeiliSearch & Algolia <br>

Let's imagine you wanna build a search engine like google. A user provides a small amount of text, then your database needs to return the most relevant results, ranked in proper order from a huge amounts of data.

![search](/images/search_engine.png)

From a dev perspective, works very similar to a document oriented db. Start with an index, then add a bunch of data objects to it. The difference is under the hood, the search db will analyze all the text in the document then create an index of the searchable terms. So essentially, it works very simnilar to an index you would find in the back of a textbook.

![index](/images/index.png)

When a user performs a search, it only has to scan the index, rather than every document in the database. That makes it fast even with very large datasets.

The db can run a variety of algorithims to rank those results, filter irrelevant hits, handle typos, and so on.

This does add a lot of overhead and can be expensive to run at scale, but at the same time they can add a ton of value to the user experience if you're building something like a typeahead search box.

BEST FOR:
- Search engines
- typeahead

## 7. Multi-model Database
FaunaDB

![fauna](/images/fauna.png)

If you're a front-end dev, you probably only care about the data you consume in the front-end application, you just want some JSON. You don't want to think about schemas, replication, or shards, or anything like that.

With FaunaDB, you describe how you want to access your data using the GraphQL api.
```
type Query{
    userWithPosts(id: Int): [User!]!
}

type User {
    name: String!
    id: Int!
    posts: [Post!]!
}

type Post {
    title: String!
    author: User!
}
```
In the above example, we have a *User* model and *Post* model, where a *User* can have **many** *Posts*.

When you upload your GraphQL schema to Fauna, it automatically creates Collections where you can store data, and Index to query the data.

Images below are sample data already provided by Fauna.

![fauna-collection](/images/fauna_collection.png)

![fauna-index](/images/fauna_index.png)

Behind the scenes, it's figuring out how to take advantage of multiple db paradigms (graph, relational, document), and determining how best to use these paradigms based on the GraphQL pair you provided.

You create data by adding documents to collections just like you would with a document database, but not stuck with the inherent limitations when it comes to data modeling. It's also ACID compliant, very fast, and you never have to worry about provisioning the actual infrastrcture. You just decided how you want to consume your data, and let Fauna figure out the rest. I suppose downside would be having to pay a monthly fee in perpetuity once you became a commercial business.

BEST FOR:
- Everything?

## Honorable Mentions:

### DataWareHouse
Designed like a database, but optimized for centralizing the data for analytical purposes.

TODO: add more here later.

Time-Series

## BONUS

### Sharding

What is sharding? Sharding is a method of horizontal scaling where you split your database up across multiple servers via chunking the rows. For example. If you havew a db with 1000 rows, rows 1-550 will be on one server, and 501-1000 will be on the second and so forth.

Advantages:
- Multiple points of failures (if one server goes down not all your data is offline)
- faster queries (you can query for one set of information twice as fast by going over both servers with less total indexes) search server1 & server2 in parallel
- if sharding is ton intelligently, let's say you split them db by market (euro vs US dbs) you can automatically infer where to search and skip some shards to improve performance.
Disadvantages:
- Data or indexes are often only sharded one way, so that some searches are optimal, and others are slow or impossible.
- A heavier reliance on the interconnection between servers
- Increased latency when querying, especially where more than one shard must be searched.
- Issues of consistency and durability due to the more complex failure modes of a set of servers, which often result in systems making no guarantees about cross-shard consistency or durability

Implementations:
- Azure SQL Database Elastic Database tools shards to scale out and in the data-tier of an application.[
- MongoDB shards since version 1.6.
- Elasticsearch enterprise search server shards
- SQL Server, since SQL Server 2005 shards with help of 3rd party tools.

CryptoSpace
- blockchain platform like Etherum are adopting sharding because of issues with scaling blockhain. As the chain grows, so does more space required to store the public ledger on each user's machine.
- location of each node is mapped to blockahin rather thasn the entire ledger
- must guard against shard takeovers, corrupting nodes in a shard can lead to loss od data
- Ethereum tackles this by randonmyl assigning a node a shard, then randomly re-assigning those nodes to other shards
- 2nd challenge involves thin clients, aka siimplified verfication wallets, insuring that the clients have full picture of the ledger while its split into shards, to address this they connect to various networks and maintain local state copies for each shard
- 3rd challange is intershard connection, is good for security but still poses challenge as each shard is technically it's own blockchain network
