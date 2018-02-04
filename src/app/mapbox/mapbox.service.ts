import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { GeoJson } from './map';
import * as mapboxgl from 'mapbox-gl';
import { environment } from '../../environments/environment';

import 'rxjs/add/operator/map';

@Injectable()
export class MapService {
    markers: any;
    constructor(private http: Http) {
        (mapboxgl as any).accessToken = environment.mapbox.accessToken
    }

    loadMarkers() {
        return this.http.get("../assets/features.geojson")
            .map(res => res.json())
    }

    loadEarthquakes() {
        return this.http.get("../assets/earthquakes.geojson")
            .map(res => res.json())
    }
}