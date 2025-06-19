
import requests
from heapdict import heapdict
from collections import defaultdict
import json

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from pydantic import BaseModel
from typing import List

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Replace with your frontend URL for better security
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



class Coordinates(BaseModel):
    coordinates: List[List[float]]  # Each point is a [lat, lng]
    stationCoordinates:List[List[float]]
    
    
user_coordinates = []
station_coordinates = []

# # Convert user coordinates to desired format (longitude, latitude)
# locations = [{"location": [lon, lat]} for lat, lon in user_coordinates]

# # Create the payload
# payload = {
#     "mode": "drive",
#     "sources": locations,
#     "targets": locations
# }

# url = "https://api.geoapify.com/v1/routematrix?apiKey=4085f2a1922b4f0daa62d74cc56120bc"
# headers = {"Content-Type": "application/json"}
# data = json.dumps(payload)      
      
# try:
#     resp = requests.post(url, headers=headers, data=data)
#     data=resp.json()
#     matrix=data['sources_to_targets']
#     # print(matrix)
    
# except requests.exceptions.HTTPError as e:
#     print (e.response.text)

def Gourp_house_to_gasStation(distance_matrix):
    groupings = {i: [] for i in range(len(distance_matrix))}
     
    for house in range(len(distance_matrix[0])):
        min_distance = float('inf')
        leader=-1
        for station in range(len(distance_matrix)):
            dist=distance_matrix[station][house]['distance']
            if dist!=None and dist<min_distance:
                min_distance = dist
                leader = station
        groupings[leader].append(house)
    return groupings

def prims(matrix,locations):
    parent=defaultdict(lambda:-1)
    minDistance=0
    pq=heapdict()
    
    for node in range(len(matrix)):
        if node==0:
            pq[node]=0
        else :
            pq[node]=1000000000000

    
    while pq:
        currentNode,dist=pq.popitem()
        minDistance=minDistance+dist
        for i in range(len(matrix)):
            if i!=currentNode and matrix[currentNode][i]['distance']!=None:
                if i in pq and matrix[currentNode][i]['distance']< pq[i]:
                    pq[i]=matrix[currentNode][i]['distance']
                    parent[i]=currentNode
                
                    
    path=[]                           
    for node,parent in parent.items():
        print("node:",node,"parent:",parent)
        route=[]
        route.append(locations[node]["location"])
        route.append(locations[parent]["location"])
        
        path.append(route)
    
    
    return path,minDistance
    
    
Data={}





@app.get("/map-get")
def get_paths():
    return Data


@app.post("/map-post")
def post_coordinates(data: Coordinates):
    global user_coordinates,Data,station_coordinates
    Data={}
    allroutes=[]
    optimizeDistance=0
    user_coordinates = data.coordinates
    station_coordinates=data.stationCoordinates
        
    src_locations = [{"location": [lon, lat]} for lat, lon in station_coordinates]
    tar_locations = [{"location": [lon, lat]} for lat, lon in user_coordinates]

    
    payload = {
    "mode": "bicycle",
    "sources": src_locations,
    "targets": tar_locations,
    "type": "short"
    
    }
    
    url = "https://api.geoapify.com/v1/routematrix?apiKey=4085f2a1922b4f0daa62d74cc56120bc"
    
    headers = {"Content-Type": "application/json"}
    
    data = json.dumps(payload)      

    try:
        resp = requests.post(url, headers=headers, data=data)
        data=resp.json()
        gas_to_house_dist=data['sources_to_targets']
        print(gas_to_house_dist)
        
    
    except requests.exceptions.HTTPError as e:
        print (e.response.text)
    
    
    
    # Grouping of each house only to its neighbour gas stations (minimum distance based)
    groups=Gourp_house_to_gasStation(gas_to_house_dist)
    print(groups)
    
    for key, value in groups.items():
        locations=[]
        locations.append(src_locations[key])
        for house in value:
            locations.append(tar_locations[house])
            
        payload = {
        "mode": "bicycle",
        "sources": locations,
        "targets": locations,
        "type": "short"
        }
        url = "https://api.geoapify.com/v1/routematrix?apiKey=4085f2a1922b4f0daa62d74cc56120bc"
        headers = {"Content-Type": "application/json"}
        data = json.dumps(payload)      

        try:
            resp = requests.post(url, headers=headers, data=data)
            data=resp.json()
            matrix=data['sources_to_targets']
            print(matrix)
    
        except requests.exceptions.HTTPError as e:
            print (e.response.text)
            
        routes,Distance=prims(matrix,locations)
        print("Dist: ",Distance,"\n\nroutes: ",routes)
        allroutes=allroutes+routes
        optimizeDistance=optimizeDistance+Distance
        
    Data["optimizeDistance"]=optimizeDistance
    Data["routes"]=allroutes

    
    
    
    
        
        

    
    
    # ---------------------------------------------------------------------------------------------------------------------------
    # allroutes=prims(matrix)
    # locations = [{"location": [lon, lat]} for lat, lon in station_coordinates + user_coordinates]

    
    # payload = {
    # "mode": "walk",
    # "sources": src_locations,
    # "targets": tar_locations,
    # "type": "short"
    
    # }
    
    # url = "https://api.geoapify.com/v1/routematrix?apiKey=4085f2a1922b4f0daa62d74cc56120bc"
    
    # headers = {"Content-Type": "application/json"}
    
    # data = json.dumps(payload)      

    # try:
    #     resp = requests.post(url, headers=headers, data=data)
    #     data=resp.json()
    #     matrix=data['sources_to_targets']
    #     print(matrix)
    
    # except requests.exceptions.HTTPError as e:
    #     print (e.response.text)
    
    