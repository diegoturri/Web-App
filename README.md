# Web-App

The application uses theMealDB API to retrieve information about different recipes and allows users to discover them , save them as favourites, and review them. 

Technical details:
- The application was implemented using the local storage, not an external DB. This way the project can be tested without setting particular environments.
- The number of request has been optimized and new recipes are being requested only if they haven’t been requested before. This is achieved by storing the history of the requests in the local storage
