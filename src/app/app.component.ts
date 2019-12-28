import { Component, OnInit } from '@angular/core';
import { DataService, StorageService, MappingService } from './services';
import { StorageType } from './enums';
import { Planet } from './models';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'interstellar';
  graphData: [];
  planetData: Planet[];
  routesWithTraffic: [];
  selectedStartPlanetNode = null;
  selectedEndPlanetNode = null;
  selectedPath: Planet[];
  selectedDistance = 0;
  loadingText = 'Sit tight. Initialising boosters...';
  timerFired = false;
  hideLoader = false;
  notValid = false;
  calculated = false;
  changeButton = false;
  spaceFacts = [];

  constructor(
    private dataService: DataService,
    private storageService: StorageService,
    private mappingService: MappingService,
  ) {}

  ngOnInit() {
    // load data required from storage first.
    this.loadFromStorage();

    // if no data in storage (cleared or first run), fetch the data from the file and format it
    // accordingly and then save to storage.
    if (!this.graphData || !this.planetData) {
      this.dataService.loadDataFile().then(result => {
        if (result && result.PlanetNames && result.Routes && result.Traffic) {
          localStorage.clear();
          const planetsFormatted = this.storageService.formatPlanetsForStorage(
            result.PlanetNames,
          );
          const routesFormatted = this.storageService.formatRoutesForStorage(
            result.Routes,
          );
          const trafficFormatted = this.storageService.formatTrafficForStorage(
            result.Traffic,
          );

          // Since all the data is required in order to perform array merges and mappings further down the order
          // we need the formatting methods to return successful promises before we can continue
          Promise.all([
            planetsFormatted,
            routesFormatted,
            trafficFormatted,
          ]).then(r => {
            this.formatTrafficData();
          });
        }
      });
    }

    // visual changes method does the visual fluff like show and hide fake loading elements etc.
    this.visualChanges();
    this.getFacts();
  }

  // I use this method to merge the 2 route objects into one containing distance and traffic information.
  // this new array is then used for the mapping algorithm
  formatTrafficData(): void {
    const routesArr = this.storageService.getFromStorage(StorageType.routes);
    const trafficArr = this.storageService.getFromStorage(StorageType.traffic);

    const mergedWithTrafficAllowance = [
      ...routesArr
        .concat(trafficArr)
        .reduce(
          (m, o) => m.set(o.routeId, Object.assign(m.get(o.routeId) || {}, o)),
          new Map(),
        )
        .values(),
    ];

    this.storageService
      .formatRoutesWithTrafficForStorage(mergedWithTrafficAllowance)
      .then(r => {
        this.loadFromStorage();
      });
  }

  // this method loads the data required for the application to work.
  loadFromStorage(): void {
    this.graphData = this.storageService.getFromStorage(StorageType.graphData);

    this.planetData = this.storageService.getFromStorage(StorageType.planets);
    this.routesWithTraffic = this.storageService.getFromStorage(
      StorageType.routesWithTraffic,
    );
  }

  // this method calls the mapping service. at this point the assumption is that the array
  // required for the service has already been populated
  runGraph(): void {
    const [path, length] = this.mappingService.calculatePathWithDistance(
      this.graphData,
      this.selectedStartPlanetNode,
      this.selectedEndPlanetNode,
    );

    this.formatGraphResults(path, length);
  }

  // the data returned from the mapping service isn't very visual, so this method adds a bit of fun
  // with some space facts and merges the planet names with the nodes returned so that we have names
  // instead of just node ids
  formatGraphResults(pathArr, length): void {
    this.selectedPath = [];

    pathArr.forEach(pathNode => {
      this.planetData.forEach(planet => {
        if (planet.planetNode === pathNode) {
          const randomIndex = Math.floor(
            Math.random() * this.spaceFacts.length,
          );
          const randomFact = this.spaceFacts[randomIndex];
          const p = {
            ...planet,
            fact: randomFact,
          };
          this.selectedPath.push(p);
        }
      });
    });

    this.selectedDistance = length.toFixed(2);

    this.calculated = true;
  }

  // the next 2 methods are used on the select value change and on the submit button.
  // i have added some time delay to aid in the visual appeal
  onChange(event): void {
    if (event && this.selectedEndPlanetNode && this.selectedStartPlanetNode) {
      this.changeButton = true;
      setTimeout(() => {
        this.runGraph();
      }, 1000);
    }
  }

  calculateDistance() {
    if (this.selectedEndPlanetNode && this.selectedStartPlanetNode) {
      this.changeButton = true;
      setTimeout(() => {
        this.runGraph();
      }, 1000);
    } else {
      this.notValid = true;
    }
  }

  // showing and hiding animations with delay to simulate the application "working"
  visualChanges() {
    setTimeout(() => {
      this.timerFired = true;
    }, 5000);

    setTimeout(() => {
      this.hideLoader = true;
    }, 8000);
  }

  // showing random facts for fun.
  getFacts() {
    this.dataService.getFacts().subscribe(facts => {
      facts.forEach(fact => {
        this.spaceFacts.push(fact);
      });
    });
  }

  goBack() {
    this.clearValues();
  }

  // this resets the objects so a new route can be planned
  clearValues() {
    this.selectedStartPlanetNode = null;
    this.selectedEndPlanetNode = null;
    this.selectedPath = [];
    this.selectedDistance = 0;
    this.notValid = false;
    this.calculated = false;
    this.changeButton = false;
  }
}
