# Overview
This repo includes the data-snapshot jobs, server, and frontend for my can collection (i.e. sapporo), Steam, Strava, and other things. 

## Data Fetching

### Steam

See [Steam API documentation](https://developer.valvesoftware.com/wiki/Steam_Web_API#GetGlobalAchievementPercentagesForApp_.28v0001.29). I setup a workflow that calls the Steam API for my *recently played games* and figures out which of those games I played today. You'll find the script in `~/data/steam/`. I schedule the jobs with Windows Task Scheduler since everything is still local.

### Strava

See [Strava API documentation](https://developers.strava.com/docs/). I setup a similar workflow for Strava that will record my acitvities in a daily snapshot.

## Server
Express server for fetching the daily snapshots. It also hosts the images for my can-collection.

## Frontend
A react webapp that uses vite and tailwind.

![](./demo.png)