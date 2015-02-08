# home-economy

## Development

### Install bower dependencies

```sh
$ ./node_modules/bower/bin/bower install
```

### Run

```sh
$ npm start
```

### Code lint

```sh
$ npm run lint
```
## App info 



### Transaction fields

Field           | Type   | Required | Description               | Available in 
---|---|---|---|---
__ds__          | String | required | Transaction description   | santander, ing
__type__        | String | required | Transaction type          | santander, ing
__amount__      | Number | required | Amount of money transfered| santander, ing
__balance__     | Number | required | Account balance after TX  | santander, ing
__fee__         | Number | optiona  | Charged fee in a TX       | santander
__opDate__      | Date   | required | Transaction's date        | santander, ing
__valDate__     | Date   | optional | Validation date           | santander
__atmDate__     | Date   | optional | ATM withdraw date         | santander
__purchaseDate__| Date   | optional | Date for purchase TX      | santander
__company__     | String | optional | Involved company in TX    | santander
__concept__     | String | optional | Concept for transer TX    | santander
__from__        | String | optional | Origin in a transfer TX   | santander
__creditCard__  | String | optional | Credit card number used in TX | santander 


### Query notes

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

