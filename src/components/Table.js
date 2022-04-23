import React, { useContext, useEffect, useState } from 'react';
import StarWarsContext from '../context/StarWarsContext';

function BodyTdContent(value) {
  if (Array.isArray(value)) {
    const result = value.reduce((acc, item) => (`${acc}
${item}`), '');
    return result;
  }
  return value;
}

export default function Table() {
  const { planets } = useContext(StarWarsContext);
  const [head, setHead] = useState([]);
  useEffect(() => {
    if (planets.length > 0) {
      const result = Object.keys(planets[0])
        .filter((item) => item !== 'residents');
      setHead(result);
    }
  }, [planets]);
  return (
    <table>
      {planets.length > 0 && (
        <>
          <thead>
            <tr>
              {head.map((item) => <th key={ item }>{item}</th>)}
            </tr>
          </thead>
          <tbody>
            {planets.map((item, index) => (
              <tr key={ item.url }>
                {head.map((value) => (
                  <td
                    key={ value }
                    data-testid={ value === 'name' ? 'planet-name' : null }
                  >
                    {BodyTdContent(planets[index][value])}
                  </td>))}
              </tr>))}
          </tbody>
        </>
      )}
    </table>
  );
}
