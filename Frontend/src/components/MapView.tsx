import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MARKET_LOCATIONS, DELHI_CENTER } from '../utils/marketLocations';
import { formatCurrency } from '../utils/formatters';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface MarketData {
  marketName: string;
  actualAvgPrice: number;
  predictedAvgPrice: number;
  deviation: number;
  isAnomaly: boolean;
}

interface MapViewProps {
  data: MarketData[];
}

const MapView = ({ data }: MapViewProps) => {
  const getMarkerColor = (deviation: number): string => {
    const absDeviation = Math.abs(deviation);
    if (absDeviation <= 5) return '#22c55e';
    if (absDeviation <= 15) return '#eab308';
    return '#ef4444';
  };

  const createCustomIcon = (color: string) => {
    return L.divIcon({
      className: 'custom-marker',
      html: `
        <div style="
          background-color: ${color};
          width: 25px;
          height: 25px;
          border-radius: 50%;
          border: 3px solid white;
          box-shadow: 0 2px 5px rgba(0,0,0,0.3);
        "></div>
      `,
      iconSize: [25, 25],
      iconAnchor: [12, 12],
    });
  };

  return (
    <MapContainer
      center={[DELHI_CENTER.lat, DELHI_CENTER.lng]}
      zoom={11}
      style={{ height: '600px', width: '100%', borderRadius: '12px' }}
      maxBounds={[
        [28.40, 76.84],
        [28.88, 77.35]
      ]}
      maxBoundsViscosity={1.0}
      minZoom={10}
      maxZoom={15}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {data.map((market) => {
        const location = MARKET_LOCATIONS[market.marketName];
        if (!location) return null;

        const markerColor = getMarkerColor(market.deviation);

        return (
          <Marker
            key={market.marketName}
            position={[location.lat, location.lng]}
            icon={createCustomIcon(markerColor)}
          >
            <Popup>
              <div className="p-2">
                <h3 className="font-bold text-lg mb-2">{market.marketName}</h3>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Actual Avg Price:</span>
                    <span className="font-semibold">{formatCurrency(market.actualAvgPrice)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">AI Predicted:</span>
                    <span className="font-semibold text-blue-600">
                      {formatCurrency(market.predictedAvgPrice)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Deviation:</span>
                    <span
                      className={`font-semibold ${
                        market.deviation > 0 ? 'text-red-600' : 'text-green-600'
                      }`}
                    >
                      {market.deviation > 0 ? '+' : ''}
                      {market.deviation.toFixed(2)}%
                    </span>
                  </div>
                  <div className="mt-2 pt-2 border-t">
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${
                        market.isAnomaly
                          ? 'bg-red-100 text-red-800'
                          : 'bg-green-100 text-green-800'
                      }`}
                    >
                      {market.isAnomaly ? 'Anomalous' : 'Normal'}
                    </span>
                  </div>
                </div>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
};

export default MapView;