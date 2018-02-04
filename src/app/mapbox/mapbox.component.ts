import { Component, OnInit, ViewChild } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import { MapService } from './mapbox.service';
import { FeatureCollection } from './map';

@Component({
    selector: 'app-mapbox',
    templateUrl: './mapbox.component.html',
    styleUrls: ['./mapbox.component.scss']
})
export class MapboxComponent implements OnInit {
    @ViewChild('map') map: mapboxgl.Map;
    source: any;
    markers: any;
    earthquakes: any;

    constructor(private mapService: MapService) {
    }

    ngOnInit() {
        this.buildMap();
    }

    buildMap() {
        this.map = new mapboxgl.Map({
            container: 'map', // container id
            style: 'mapbox://styles/mapbox/streets-v9', // stylesheet location
            center: [8.6821, 50.1109], // starting position [lng, lat]
            zoom: 5 // starting zoom
        });

        // Add zoom and rotation controls to the map.
        this.map.addControl(new mapboxgl.NavigationControl());
        this.map.on('load', this.onMapLoad.bind(this));
    }

    onMapLoad(event) {
        this.loadData();
    }

    loadData() {
        this.mapService.loadMarkers().subscribe(data => {
            this.markers = new FeatureCollection(data);
            this.loadMarkers();
        });
        this.mapService.loadEarthquakes().subscribe(data => {
            this.earthquakes = new FeatureCollection(data);
            this.loadEarthquakes();
        });
    }

    loadMarkers() {
        /// register source
        this.map.addSource('dataSource', {
            type: 'geojson',
            data: this.markers.features,
            cluster: true,
            clusterMaxZoom: 14, // Max zoom to cluster points on
            clusterRadius: 50 // Radius of each cluster when clustering points (defaults to 50)
        });

        /// create map layers with realtime data
        this.map.addLayer({
            id: 'dataSource',
            source: 'dataSource',
            type: 'symbol',
            layout: {
                'text-field': '{message}',
                'text-size': 24,
                'text-transform': 'uppercase',
                'icon-image': 'marker-15',
                'text-offset': [0, 1.5]
            },
            paint: {
                'text-color': '#f16624',
                'text-halo-color': '#fff',
                'text-halo-width': 2
            }
        });
    }

    loadEarthquakes() {
        console.log(this.earthquakes);
        this.map.addSource("earthquakes", {
            type: "geojson",
            // Point to GeoJSON data. This example visualizes all M1.0+ earthquakes
            // from 12/22/15 to 1/21/16 as logged by USGS' Earthquake hazards program.
            data: this.earthquakes.features,
            cluster: true,
            clusterMaxZoom: 14, // Max zoom to cluster points on
            clusterRadius: 50 // Radius of each cluster when clustering points (defaults to 50)
        });

        this.map.addLayer({
            id: "clusters",
            type: "circle",
            source: "earthquakes",
            filter: ["has", "point_count"],
            paint: {
                // Use step expressions (https://www.mapbox.com/mapbox-gl-js/style-spec/#expressions-step)
                // with three steps to implement three types of circles:
                //   * Blue, 20px circles when point count is less than 100
                //   * Yellow, 30px circles when point count is between 100 and 750
                //   * Pink, 40px circles when point count is greater than or equal to 750
                "circle-color": [
                    "step",
                    ["get", "point_count"],
                    "#51bbd6",
                    100,
                    "#f1f075",
                    750,
                    "#f28cb1"
                ],
                "circle-radius": [
                    "step",
                    ["get", "point_count"],
                    20,
                    100,
                    30,
                    750,
                    40
                ]
            }
        });

        this.map.addLayer({
            id: "cluster-count",
            type: "symbol",
            source: "earthquakes",
            filter: ["has", "point_count"],
            layout: {
                "text-field": "{point_count_abbreviated}",
                "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
                "text-size": 12
            }
        });

        this.map.addLayer({
            id: "unclustered-point",
            type: "circle",
            source: "earthquakes",
            filter: ["!has", "point_count"],
            paint: {
                "circle-color": "#11b4da",
                "circle-radius": 4,
                "circle-stroke-width": 1,
                "circle-stroke-color": "#fff"
            }
        });
    }

}
