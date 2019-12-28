import { Injectable } from '@angular/core';
import { Decimal } from 'decimal.js';

@Injectable({
  providedIn: 'root',
})
export class MappingService {
  constructor() {}

  // a typescript implementation of the Dijkstra algorithm according to the pseudo code section via Wikipedia
  // https://en.wikipedia.org/wiki/Dijkstra%27s_algorithm#Pseudocode

  calculatePathWithDistance(paths, source, target) {
    const Q = new Set();
    const prev = {};
    const dist = {};
    const adj = {};

    const vertexWithMinDist = (q, d) => {
      let minDistance = Infinity;
      let u = null;

      for (const v of q) {
        if (dist[v] < minDistance) {
          minDistance = d[v];
          u = v;
        }
      }
      return u;
    };

    for (const path of paths) {
      const v1 = path[0];
      const v2 = path[1];
      let len = path[2];

      // calculate the impact of traffic on the travelling time. the usage
      // of decimal.js is required to ensure accurate decimal division.
      // i then convert the new length back to the number as the rest of
      // the algorith requires it.

      let lenDec = new Decimal(path[2]);
      const traffic = new Decimal(path[3]);

      if (traffic.greaterThan(0)) {
        lenDec = lenDec.dividedBy(traffic).toDecimalPlaces(2);
        len = lenDec.toNumber();
      }

      Q.add(v1);
      Q.add(v2);

      dist[v1] = Infinity;
      dist[v2] = Infinity;

      if (adj[v1] === undefined) {
        adj[v1] = {};
      }
      if (adj[v2] === undefined) {
        adj[v2] = {};
      }

      adj[v1][v2] = len;
      adj[v2][v1] = len;
    }

    dist[source] = 0;

    while (Q.size) {
      const u = vertexWithMinDist(Q, dist);
      const neighbors = Object.keys(adj[u]).filter(v => Q.has(v));

      Q.delete(u);

      if (u === target) {
        break;
      }

      for (const v of neighbors) {
        const alt = dist[u] + adj[u][v];
        if (alt < dist[v]) {
          dist[v] = alt;
          prev[v] = u;
        }
      }
    }

    {
      let u = target;
      const S = [u];
      let len = 0;

      while (prev[u] !== undefined) {
        S.unshift(prev[u]);
        len += adj[u][prev[u]];
        u = prev[u];
      }
      return [S, len];
    }
  }
}
