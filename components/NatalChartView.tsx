import type { NatalChartResult } from '../lib/natalChart';

const ZODIAC_SYMBOLS = ['♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓'];
const PLANET_SYMBOLS: Record<string, string> = {
  sun: '☉', moon: '☽', mercury: '☿', venus: '♀', mars: '♂',
  jupiter: '♃', saturn: '♄', uranus: '♅', neptune: '♆', pluto: '♇',
  chiron: '⚷', lilith: '⚸', 'north-node': '☊', 'south-node': '☋',
};

function chartPoint(longitude: number, radius: number, ascendant: number) {
  const angle = (180 - (longitude - ascendant)) * Math.PI / 180;
  return { x: 180 + Math.cos(angle) * radius, y: 180 + Math.sin(angle) * radius };
}

function NatalChartWheel({ result }: { result: NatalChartResult }) {
  const ascendant = result.ascendant?.longitude ?? 0;
  const planetByLabel = new Map(result.planets.map((planet) => [planet.label, planet]));

  return (
    <div className="seenChartWheel" aria-label={`Traditional Western natal chart for ${result.name}`}>
      <svg viewBox="0 0 360 360" role="img">
        <title>{result.name}&apos;s Western natal chart</title>
        <circle cx="180" cy="180" r="174" className="seenChartRing" />
        <circle cx="180" cy="180" r="137" className="seenChartRing" />
        <circle cx="180" cy="180" r="91" className="seenChartRing" />

        {ZODIAC_SYMBOLS.map((symbol, index) => {
          const boundary = chartPoint(index * 30, 174, ascendant);
          const label = chartPoint(index * 30 + 15, 155, ascendant);
          return <g key={symbol}>
            <line x1="180" y1="180" x2={boundary.x} y2={boundary.y} className="seenChartDivision" />
            <text x={label.x} y={label.y} className="seenChartZodiac">{symbol}</text>
          </g>;
        })}

        {result.houses?.map((house) => {
          const outer = chartPoint(house.longitude, 137, ascendant);
          const label = chartPoint(house.longitude + 4, 111, ascendant);
          return <g key={house.house}>
            <line x1="180" y1="180" x2={outer.x} y2={outer.y} className="seenChartHouse" />
            <text x={label.x} y={label.y} className="seenChartHouseNumber">{house.house}</text>
          </g>;
        })}

        {result.aspects.map((aspect, index) => {
          const first = planetByLabel.get(aspect.point1);
          const second = planetByLabel.get(aspect.point2);
          if (!first || !second) return null;
          const from = chartPoint(first.longitude, 84, ascendant);
          const to = chartPoint(second.longitude, 84, ascendant);
          return <line key={index} x1={from.x} y1={from.y} x2={to.x} y2={to.y} className={`seenChartAspect seenChartAspect${aspect.aspect}`} />;
        })}

        {result.planets.map((planet, index) => {
          const point = chartPoint(planet.longitude, 112 - (index % 2) * 13, ascendant);
          return <text key={planet.key} x={point.x} y={point.y} className="seenChartPlanet">
            {PLANET_SYMBOLS[planet.key]}{planet.retrograde ? '℞' : ''}
          </text>;
        })}
      </svg>
    </div>
  );
}

export default function NatalChartView({ result }: { result: NatalChartResult }) {
  return (
    <>
      {!result.hasBirthTime && (
        <p className="seenFieldSupport">
          No birth time was given, so this uses noon as a placeholder for
          sign positions only. Ascendant, Midheaven, and houses require a
          real birth time and are not shown.
        </p>
      )}

      <NatalChartWheel result={result} />

      <div className="seenField">
        <span className="seenLabel">Planets</span>
        <ul className="seenResultList">
          {result.planets.map((planet) => (
            <li className="seenResultRow" key={planet.key}>
              <span className="seenResultName">{planet.label}</span>
              <span className="seenResultValue">
                {planet.sign} {planet.degreeInSign.toFixed(1)}°
                {planet.retrograde ? ' ℞' : ''}
                {planet.house ? ` · House ${planet.house}` : ''}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {(result.ascendant || result.midheaven) && (
        <div className="seenField">
          <span className="seenLabel">Angles</span>
          <ul className="seenResultList">
            {result.ascendant && (
              <li className="seenResultRow">
                <span className="seenResultName">Ascendant</span>
                <span className="seenResultValue">
                  {result.ascendant.sign} {result.ascendant.degreeInSign.toFixed(1)}°
                </span>
              </li>
            )}
            {result.midheaven && (
              <li className="seenResultRow">
                <span className="seenResultName">Midheaven</span>
                <span className="seenResultValue">
                  {result.midheaven.sign} {result.midheaven.degreeInSign.toFixed(1)}°
                </span>
              </li>
            )}
          </ul>
        </div>
      )}

      {result.houses && (
        <div className="seenField">
          <span className="seenLabel">Houses</span>
          <ul className="seenResultList">
            {result.houses.map((house) => (
              <li className="seenResultRow" key={house.house}>
                <span className="seenResultName">House {house.house}</span>
                <span className="seenResultValue">
                  {house.sign} {house.degreeInSign.toFixed(1)}°
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {result.aspects.length > 0 && (
        <div className="seenField">
          <span className="seenLabel">Major aspects</span>
          <ul className="seenResultList">
            {result.aspects.map((aspect, index) => (
              <li className="seenResultRow" key={index}>
                <span className="seenResultName">
                  {aspect.point1} {aspect.aspect} {aspect.point2}
                </span>
                <span className="seenResultValue">orb {aspect.orb}°</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}
