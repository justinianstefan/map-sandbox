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

    constructor(private mapService: MapService) {
    }

    ngOnInit() {
        this.mapService.loadMarkers().subscribe(data => {
            this.markers = new FeatureCollection(data);
            this.buildMap();
        });
    }

    buildMap() {
        this.map = new mapboxgl.Map({
            container: 'map', // container id
            style: 'mapbox://styles/mapbox/streets-v9', // stylesheet location
            center: [8.6821, 50.1109], // starting position [lng, lat]
            zoom: 5 // starting zoom
        });
        this.map.on('load', this.onMapLoad.bind(this));
    }

    onMapLoad(event) {
        this.loadMarkers();
    }

    loadMarkers() {
        /// register source
        this.map.addSource('dataSource', {
            type: 'geojson',
            data: {
                type: 'FeatureCollection',
                features: []
            }
        });
        /// get source
        this.source = this.map.getSource('dataSource');
        this.source.setData(this.markers.features);
        console.log(this.markers);

        /// create map layers with realtime data
        this.map.addLayer({
            id: 'dataSource',
            source: 'dataSource',
            type: 'symbol',
            layout: {
                'text-field': '{message}',
                'text-size': 24,
                'text-transform': 'uppercase',
                'icon-image': 'rocket-15',
                'text-offset': [0, 1.5]
            },
            paint: {
                'text-color': '#f16624',
                'text-halo-color': '#fff',
                'text-halo-width': 2
            }
        });
    }

}
