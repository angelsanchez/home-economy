# home-economy

## Development

### Run

```sh
$ npm start
```

### Code lint

```sh
$ npm run lint
```



db.transactions.aggregate([
 { $group : { _id : '$type', total : { $sum : '$amount' } } },
 { $sort : {total : 1} }
])

db.transactions.aggregate([
 { $match : {type : 'bill'} },
 { $group : { _id : '$company', total : { $sum : '$amount' } } }
])


db.transactions.aggregate([
 { $match : {type : 'purchase'} },
 { $group : { _id : '$company', total : { $sum : '$amount' } } },
 { $sort : {total : 1} }
])

db.transactions.find({}).sort({balance:-1}).limit(1)

db.transactions.find({}).sort({balance:1}).limit(1)

