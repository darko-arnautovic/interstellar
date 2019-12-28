import { Injectable } from '@angular/core';
import { StorageType } from '../enums';
import { Planet, Route, Traffic } from '../models';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  constructor() {}

  // The formatting methods below are mainly used to return promise results from the spacing methods. 
  // These methods are publicly available.

  formatPlanetsForStorage(planetsData) {
    return new Promise(res => {
      res(this.removePlanetSpaces(planetsData));
    });
  }

  formatRoutesForStorage(routesData) {
    return new Promise(res => {
      res(this.removeRouteSpaces(routesData));
    });
  }

  formatTrafficForStorage(trafficData) {
    return new Promise(res => {
      res(this.removeTrafficSpaces(trafficData));
    });
  }

  formatRoutesWithTrafficForStorage(mergedData) {
    return new Promise(res => {
      res(this.createGraphObjectArray(mergedData));
    });
  }

  // The removing spaces methods return promises once the data has been iterated and spaces removed from the
  // objects. Removing spaces is neccessary as it makes iterating on the front end easier. 

  private removePlanetSpaces(data) {
    return new Promise(resolve => {
      const planetArr: Planet[] = [];
      Object.keys(data).forEach(key => {
        const planetData = data[key];
        const planetObj: Planet = {
          planetName: planetData['Planet Name'],
          planetNode: planetData['Planet Node'],
        };
        planetArr.push(planetObj);
      });
      this.saveToStorage(StorageType.planets, planetArr);
      resolve();
    });
  }

  private removeRouteSpaces(data) {
    return new Promise(resolve => {
      const routeArr: Route[] = [];
      Object.keys(data).forEach(key => {
        const routeData = data[key];
        const routeObj: Route = {
          routeId: routeData['Route Id'],
          planetOrigin: routeData['Planet Origin'],
          planetDestination: routeData['Planet Destination'],
          distance: routeData['Distance(Light Years)'],
        };
        routeArr.push(routeObj);
      });
      this.saveToStorage(StorageType.routes, routeArr);
      resolve();
    });
  }

  private removeTrafficSpaces(data) {
    return new Promise(resolve => {
      const trafficArr: Traffic[] = [];
      Object.keys(data).forEach(key => {
        const trafficData = data[key];
        const trafficObj: Traffic = {
          routeId: trafficData['Route Id'],
          planetOrigin: trafficData['Planet Origin'],
          planetDestination: trafficData['Planet Destination'],
          trafficDelay: trafficData['Traffic Delay (Light Years)'],
        };
        trafficArr.push(trafficObj);
      });
      this.saveToStorage(StorageType.traffic, trafficArr);
      resolve();
    });
  }

  private createGraphObjectArray(data) {
    return new Promise(resolve => {
      const graphArr = [];
      data.forEach(route => {
        const graphNode = [];
        graphNode.push(route.planetOrigin);
        graphNode.push(route.planetDestination);
        graphNode.push(route.distance);
        graphNode.push(route.trafficDelay);
        graphArr.push(graphNode);
      });

      this.saveToStorage(StorageType.graphData, graphArr);
      this.saveToStorage(StorageType.routesWithTraffic, data);

      resolve();
    });
  }

  // The save to storage method utilizes and enum that references the storage object to save and get conveniently.
  // I have chosen to use local storage as it doesnt require any additional library installations and dependencies. 
  // It is universally available across all browsers and allows up to 10MB of data. 

  private saveToStorage(key: StorageType, objectToSave: any): void {
    localStorage.setItem(key, JSON.stringify(objectToSave));
  }

  getFromStorage(key: StorageType): any {
    return JSON.parse(localStorage.getItem(key));
  }
}
