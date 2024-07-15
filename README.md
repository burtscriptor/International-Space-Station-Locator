# International-Space-Station-Locator 
### The second Iternation of what was originally ISS-tracker
<img width="605" alt="ISS standard" src="https://github.com/user-attachments/assets/5a92343a-03d5-41f1-bd51-40134d5d09a2">

This app combines a love for knowing where things are and amazement with the technological achievement of having people live in a hostile environment: space!

Integrating Google Maps into a JS create-react application, this website aims to display the location of the International Space Station (ISS) on an interactive Google map.

## Purpose

Originally created as ISS-tracker, due to deployment issues with Render and not being overly fimilar with Vite deployment configuration, I re-created the application in create-react-apps as International-Space-Station-Locator. Being more fimilar with create-react-app deployment and Heroku, my thinking was that I would have more success deploying.

## Problems, Learnings and Solutions
However... when it came to deploying with Heroku I came across a "Mixed content" error preventing the application from loading. This was because the deployed application was being accessed by https but a few lines of code in the application responible for API communication (open notify/ ISS) was attempting to communicate over http. Thinking a quick solution could be to put an 's' (http vs https) in the GET request to the API url, I commited the change and re-deployed but alas it did not work. This was my first introduction to the key differecnes between http and https.
I still had a problem I didn't entirely understand...

### Learnings

http was invented in the 1990s and is the foundation of data communication over the internet. It transmit data as plain text, if you intercepted it you could
could easily read it and do what you want with it. Along came https in 1994, this transmit data but in a secure encypted format, not plain text. This encryption ensures data integrity and confidentiality between the user's browser and the server. https is now the standard, however there are still older sites around that were built using http (opennotify / ISS). https applications don't like communiating with http application because there is a greater cybersecurity risk.

One of the StackOverFlow solutions was to create a server/backend/proxy that servered up data to the application/frontend, this avoids the frontend code directly calling an API over a http connection as that is now the job of the backend/server. The flow of the GET request goes from frontend to backend to api then reverese that order to provide the response. This fixed the mixed content error because the browser was on longer making an unsecure http request, it was making a secure https request to the server/backend/proxy which then made the unsecure http request, when the response came through the server/backend/proxy then forwarded on the response to the browser via the inital secure https connection.


## Inital purpose 
The purpose was to familiarize myself with using Google React Maps—passing props such as coordinates, using markers, and setting up default settings for the map on page load. Additionally, I wanted to practice the safe storage and retrieval of API keys via a .env file. API keys are essential for Google services and many web services. I created a project in the Google Cloud Console, navigated to ‘APIs and services,’ enabled Google Maps, navigated to ‘Credentials’ to create an API key, and then set the key up to allow its use from different IP addresses/users. I stored the API key in a .env file within the application and accessed it using process.env.

The Open Notify API (http://open-notify.org/Open-Notify-API/ISS-Location-Now/) allows users to access the ISS geolocation every 5 seconds. So rather than just rendering a static marker on Google Maps, I used setInterval() to time calls to get the ISS location, then continually passed the updated coordinates as props to Google React Maps.

## Problems and Solutions
I initially followed a tutorial for 
Google React Maps; however, it was two years old, and the package had been updated since that time. This meant that the tutorial steps did not work. Specifically, there were changes to google.maps.Marker, which is used to mark a location. To overcome this, I got to know the React Google Maps documentation on GitHub (https://visgl.github.io/react-google-maps/docs). This contained the latest information. Not going to lie, this was my first time really digging into the documentation, and it took many hours to get things working. But I got it working!

The next problem I encountered occurred when attempting to deploy the site on Render. The problem was:

Failed to load resource: the server responded with a status of 404 ()
iss-tracker-t7v2.onrender.com/:1 Refused to apply style from ‘https://iss-tracker-t7v2.onrender.com/ISS-tracker/assets/index-BP86sDtK.css 3’ because its MIME type (‘text/plain’) is not a supported stylesheet MIME type, and strict MIME checking is enabled.
Having little experience with deployment and not knowing what this meant, I did some digging around on Stack Overflow. I found a few people with similar issues and attempted to implement the solutions put forward by the community. However, they did not work.

I took the next step and directly posted to the Render help forums. An experienced member kindly replied:

"Static sites showing “MIME type (‘text/plain’)” will often be because the asset is being incorrectly referenced. You need to check the structure of your static files to ensure they’re configured correctly to reference valid paths and that the “Publish Directory” is set correctly to where your static files are stored/generated.”

I took the advice and checked to be sure everything was configured correctly, things were named correctly, and paths were referenced correctly. However, I could not locate an error.

I spent a good few hours trying to figure this out and reached out to a few friends I thought might have some insight. But alas, we could not figure out where the error was, and so I did not deploy on Render.

However it does exist here on Heroku https://space-station-locator-90bf1b592e8e.herokuapp.com/

<img width="605" alt="ISS list names" src="https://github.com/user-attachments/assets/7068015a-8875-4965-8da1-2b6b7119c5b6">
Clicking on the spaceman shows a list of everyone currently in space.


## Improvements, next iteration 
Google-react-maps is initally slow to load, this could be improved?
Intially wanted to have the users location display but thought people might not like that, so removed it, but I think putting it back in as an option 
could be a nice touch.
When you zoom out far enought on google maps a grey border appears? Should be able to set a maxium zoom out to avoid getting to this point.
The small spaceman image is hard coded into the application and image uploaded into the build rather then referenced in the code to a cloud storage location. That would speed things up.
