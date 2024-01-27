# hypergro-assignment
BSE stock exchange backend API

### Tech Stack Used
1) Express.js
2) PostgreSQL

### Features
1) Uses postgreSQL deployed on neon.tech cloud for efficient and fast retrieval of queries.
2) Caching mechanism added which caches requests
3) Backend API deployed to vercel : <https://hypergro-assignment-theta.vercel.app/>
4) Scripts to download, extract and seed the database with equity data from bse website.

How to run: 
```
    git clone https://github.com/jsq1234/bombay-stock-exchange-backend-api
    npm install
    Either create a .env file with DATABASE_URL environment variable which is your postgres connection
    string or go to ./config/dbConfig.js and manually add your connection string (remove ssl fields if you
    are using local postgres db).
    npm start
```

## SQL schema 


## API Usage

### /stocks
    curl localhost:3000/stocks
    ```
        {"sc_name":"HEALTHY","sc_code":543473,"date":"2023-11-30T00:00:00.000Z","sc_id":3741,"open":10.24,"high":10.45,"low":10.22,"close":10.38,"last":10.3,"prevclose":10.24,"no_trades":673,"no_of_shrs":56229,"net_turnov":579863},{"sc_name":"BSLNIFTY","sc_code":543474,"date":"2023-11-30T00:00:00.000Z","sc_id":3742,"open":22.8,"high":22.92,"low":22.73,"close":22.85,"last":22.86,"prevclose":22.8,"no_trades":235,"no_of_shrs":12638,"net_turnov":288326},{"sc_name":"EKENNIS","sc_code":543475,"date":"2023-11-30T00:00:00.000Z","sc_id":3743,"open":83,"high":84,"low":82.55,"close":83.05,"last":83.05,"prevclose":88,"no_trades":7,"no_of_shrs":5600,"net_turnov":465360},{"sc_name":"MIDCAPETF","sc_code":543481,"date":"2023-11-30T00:00:00.000Z","sc_id":3745,"open":15.97,"high":16.15,"low":15.88,"close":16.06,"last":16.09,"prevclose":15.98,"no_trades":3378,"no_of_shrs":248250,"net_turnov":3974628},{"sc_name":"EUREKAFORBE","sc_code":543482,"date":"2023-11-30T00:00:00.000Z","sc_id":3746,"open":517.15,"high":524.95,"low":517,"close":521.4,"last":521.4,"prevclose":516.5,"no_trades":1614,"no_of_shrs":20250,"net_turnov":10550270}
    ```
    
