import { OnInit, ViewChild, ElementRef } from '@angular/core';
import Map from '@arcgis/core/Map';
import MapView from '@arcgis/core/views/MapView';
import Directions from '@arcgis/core/widgets/Directions';
import RouteLayer from '@arcgis/core/layers/RouteLayer';
import Graphic from '@arcgis/core/Graphic';
import Point from '@arcgis/core/geometry/Point';
import SimpleMarkerSymbol from '@arcgis/core/symbols/SimpleMarkerSymbol';
import Polyline from '@arcgis/core/geometry/Polyline';
import PictureMarkerSymbol from '@arcgis/core/symbols/PictureMarkerSymbol';
// import { Library } from 'src/app/models/library';
// import { LibraryService } from 'src/app/services/library.service';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
// import { WebSocketService } from 'src/app/services/websocket.service';
import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { RouterOutlet } from '@angular/router';


@Component({
  selector: 'app-arcgis-map',
  templateUrl: './bucharestmap.component.html',
  styleUrls: ['./bucharestmap.component.css'],
  encapsulation  : ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone     : true,
  imports        : [RouterOutlet],
})
export class BucharestMapComponent implements OnInit {
  @ViewChild('mapViewNode', { static: true }) private mapViewEl!: ElementRef;
  map!: __esri.Map;
  mapView!: __esri.MapView;

  constructor() {}


  async ngOnInit(): Promise<void> {
    await this.initializeMap();
  }

  private async initializeMap(): Promise<void> {
    const apiKey = 'AAPK03093c3ee6eb4655a56a83c5c78a227d7RlDqxpvBVf599xcEtobyqYTQ-e3v3dXJKar1HRvjpnYWgiNhWZvIp2e62iWhO2a'; // Replace with your actual API key
    const routeLayer = new RouteLayer();

    this.map = new Map({
      basemap: 'topo-vector',
      layers: [routeLayer]
    });

    this.mapView = new MapView({
      container: this.mapViewEl.nativeElement,
      map: this.map,
      center: [26.1025, 44.4268], // Bucharest coordinates
      zoom: 14
    });

    await this.mapView.when();
      this.addLibraryLayer();
      this.addLibraryPoints();

    this.mapView.when(() => {
      const directionsWidget = new Directions({
        view: this.mapView,
        layer: routeLayer,
        apiKey: apiKey
      });

      this.mapView.ui.add(directionsWidget, "top-right");

      // Placeholder for checking the lastRoute property
      // You may need to adjust where and when this check is performed
      // based on user interactions or other events in your application
      directionsWidget.watch('lastRoute', (lastRoute) => {
        if (lastRoute && lastRoute.routeInfo) {
          this.animateAlongPath(lastRoute.routeInfo.geometry, this.mapView);
        }
      });
    });
  }

  private addLibraryLayer(): void {
    const libraryLayer = new FeatureLayer({
      url: "https://services3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/Trailheads_Styled/FeatureServer/0",
      outFields: ["*"],
      popupTemplate: {
        title: "{name}",
        content: this.getPopupContent
      }
    });

    this.map.add(libraryLayer);
  }

  private addLibraryPoints(): void {

  }



  // You can keep this method to generate dynamic content based on each library's attributes if needed
  private getPopupContent(feature: __esri.Graphic): string {
    // Access feature attributes
    const attributes = feature.attributes;
    return `
      <strong>Address:</strong> ${attributes.address}<br>
      <strong>Schedule:</strong> ${attributes.schedule}<br>
      <strong>Website link:</strong> <a>  ${attributes.address}    `;
  }

  private animateAlongPath(path: Polyline, view: MapView): void {
    const carSymbol = new PictureMarkerSymbol({
      url: '../../../assets/photos/car.jpeg', // URL of the car image
      width: '30px',  // Adjust size as needed
      height: '30px'
    });

    const movingPointGraphic = new Graphic({
      symbol: carSymbol
    });

    view.graphics.add(movingPointGraphic);

    let pathIndex = 0;
    const pathLength = path.paths[0].length;
    const animationStep = () => {
      if (pathIndex < pathLength) {
        const point = new Point({
          x: path.paths[0][pathIndex][0],
          y: path.paths[0][pathIndex][1],
          spatialReference: path.spatialReference
        });
        movingPointGraphic.geometry = point;

        // Smaller increment for smoother animation
        pathIndex++;

        // Use setTimeout to control animation speed
        setTimeout(animationStep, 150); // Adjust time for speed (in milliseconds)
      }
    };

    animationStep();
  }

}
