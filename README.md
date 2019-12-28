# Interstellar SpaceWays

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 8.3.3.

The Interstellar Spaceways application has been developed to present planetary node distancing information in a conceptual UI by Darko Arnautovic as a Discovery Angular / Front End Developer assessment task.

It has been built using the Angular CLI, and utilises the following Libraries & Technologies:

- [Bootstrap V4](https://getbootstrap.com/)
- [Animate.css](https://daneden.github.io/animate.css/)
- [Google Fonts](https://fonts.google.com/)

Bootstrap & Animate have been downloaded manually and added to the assets folder, then loaded via the index file. This is to aid in keeping the bundle size down of the generated build. AM Charts has been added as an npm package.

### Tech

The Interstellar Spaceways App allows the user to view the fastest route between planets.

To achieve this, it uses a list of planets and routes stored in the assets folder and loaded on view initialization. Once the data has been loaded, it is passed through a simplified application of the Dijkstra algorithm. The least expensive route is returned to the user. 

### Installation

Interstellar Spaceways requires [Node.js](https://nodejs.org/) v4+ as well as [Angular CLI](https://github.com/angular/angular-cli) v8+ to run.

Install the dependencies and start the server.

```sh
$ cd interstellar
$ npm install
$ ng serve
```

### Inspiration

In order to present a UI driven by imagery and colours, various portals and tools were used to craft an idea, and ones that sparked the right creative notes have been included below:

| Source | Link |
| ------ | ------ |
| Undraw | https://undraw.co/search |
| Dribbble | https://dribbble.com/shots/2411149-Weather-Icons-Presentation |
| Coolors | https://coolors.co/dc417b-0b1430-000000-ffffff-494949 |

Thank you for the opportunity to complete this assessment for you. 

Darko.