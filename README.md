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

1) /stocks
    
