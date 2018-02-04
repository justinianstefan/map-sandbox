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
        return this.http.get("../assets/stations.json")
            .map(res => res.json())
    }
}