# EDIG Real-Time Stock Exchange Application

## Technology used
This web application was build with ASP core 6 and Angular 15.2:
Real time updates are done using SignalR, Angular WebSocket and RxJS.
They are done by sending updates from the server for a random stock price update within 0.50 of its current price, code at Stock_Exchange\Controllers\StocksController.cs
in the private void UpdateStocks() functionn

### Database Disclamer
  As no database was mentioned in the assessment and the submission being a git repository with no docker I used server side Static list to simulate the database (reset everytime the app is restarted)
  Implementation of a database can be done if requested.
### Backend 
- ASP core 6
#### Dependencies

- Microsoft.AspNetCore.SpaProxy 6.0.26
  For MVC core
- Swashbuckle.AspNetCore 6.5.0
  For SignalR
Installed through visual studio package manager

### Backend 
- Angular 15.2
#### Dependencies
- Our dependencies and their verison :
"@angular/animations": "^15.2.8",
"@angular/common": "^15.2.8",
"@angular/compiler": "^15.2.8",
"@angular/core": "^15.2.10",
"@angular/forms": "^15.2.8",
"@angular/platform-browser": "^15.2.8",
"@angular/platform-browser-dynamic": "^15.2.8",
"@angular/platform-server": "^15.2.8",
"@angular/router": "^15.2.10",
"@aspnet/signalr": "^1.0.27",
"@fortawesome/fontawesome-free": "^6.5.2",
"bootstrap": "^5.3.3",
"jquery": "^3.6.4",
"oidc-client": "^1.11.5",
"popper.js": "^1.16.0",
"run-script-os": "^1.1.6",
"rxjs": "~7.8.1",
"sweetalert2": "^11.10.8",
"tslib": "^2.5.0",
"zone.js": "~0.13.0"

  
## Installation for manual start up


- Make sure you have [NodeJS](https://nodejs.org/en/) installed on your machine

  You can check by running

         node -v

  in your terminal to make sure NodeJS is setup correctly

-You can either choose a New Visual Studio ASP.NET Core with Angular project
![image](https://github.com/minashady/assets/blob/main/CoreProject.png)

-Or Make sure you have [AngularJS](https://angular.io/guide/setup-local) installed in your project

You can check by running

         ng -version

### Backend required installations:
1. In your Visual Studio click on tools from the ribbon
2. Choose NuGet Package Manager
3. Manage NuGet Pacakge for Solution
   3.1. search for
   - Microsoft.AspNetCore.SpaProxy 6.0.26
   - Swashbuckle.AspNetCore 6.5.0
     and Install them
  

         npm i

### Frontend required installations:

1.  In your terminal from folder navigate to

         /ClientApp
    
    by Using cd ClientApp from root directory


3.  Install required packages by running

         npm i

4.  Spin up the development server using

          npm run dev

    open your browser at http://localhost:3000

### How to run:

Backend Will run on port 7272 (configurable within the file /Properties/launchSettings.json
Frontend will run on port 44422 (should be redirected automatically to it whe launching)

1.  In your Visual Studio run the solution to make sure that both the backend and front end work together

![image](https://github.com/minashady/assets/blob/main/RunCore.png)



## API reference
As we use query for all our require(s) from the server we have included screenshots with the included query requirements for all functions referenced 
**Notice!**
Since we do not use a database for this assessment we use static list which reset each time you restart the server, so you need to create orders before you can see them
We do however populate some sample stocks and price histories from the get go.

**API KEY**
key:X-Api-Key

value:EDIG_Assessment

add these to your headers in postman to authorize the API
![image](https://github.com/minashady/assets/blob/main/APIKey.png)
### /apartments

1.  /stocks (get) 

    Request query
![image](https://github.com/minashady/assets/blob/main/Stocks.png)


2.  /stocks/{symbol}/history (get)
    
    Request query
     ![image](https://github.com/minashady/assets/blob/main/Stock%20History.png)

3. /orders (post)
    Request query
      ![image](https://github.com/minashady/assets/blob/main/PostOrdes.png)
   
4. /orders (get)
    Request query
      ![image](https://github.com/minashady/assets/blob/main/GetOrders.png)


## Tests

- Postman can be used to test the functionality of different API endpoints make sure to attach bearer token if endpoint requires token

- Any browser can be used to test the functionality of the frontend webpages and web compenents

## Some Screenshots 


## Credits

Mina Shady Mourad Kamel
