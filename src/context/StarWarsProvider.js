import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import StarWarsContext from './StarWarsContext';

function filterPlanetName(nameFilter, planets) {
  const regex = new RegExp(nameFilter, 'i');
  const result = planets.filter(({ name }) => regex.test(name));
  return result;
}
function sortUnknownLast(arg1, arg2, order) {
  const negativeNumber = -1;
  if (arg1[order] === 'unknown' && arg2[order]) {
    return 0;
  }
  if (arg1[order] === 'unknown') {
    return 1;
  }
  if (arg2[order] === 'unknown') {
    return negativeNumber;
  }
}

function sortByNameAux(arg1, arg2, order) {
  const negativeNumber = -1;

  if (arg1[order] > arg2[order]) {
    return 1;
  }
  if (arg1[order] < arg2[order]) {
    return negativeNumber;
  }
  return 0;
}

export default function StarWarsProvider(props) {
  const { children } = props;
  const [planetsDefault, setPlanetsDefault] = useState([]);
  const [planetscolunmFiltered, setPlanetscolunmFiltered] = useState([]);
  const [sortedPlanetes, setSorteddPlanets] = useState([]);
  const [planets, setPlanets] = useState([]);
  const [nameFilter, setNameFilter] = useState('');
  const [filters, setFilters] = useState([]);
  const [orderOfPlanets, setOrderOfPlanets] = useState({
    column: 'name',
    sort: 'ASC',
  });

  useEffect(() => {
    async function getPlanets() {
      const url = 'https://swapi-trybe.herokuapp.com/api/planets/';
      const data = await fetch(url).then((response) => response.json());
      const { results } = data;
      setPlanetsDefault(results);
    }
    getPlanets();
    console.log(planets);
  }, []);

  useEffect(() => {
    const result = filterPlanetName(nameFilter, sortedPlanetes);
    setPlanets(result);
  }, [sortedPlanetes, nameFilter]);

  useEffect(() => {
    if (filters.length === 0) {
      setPlanetscolunmFiltered(planetsDefault);
    } else {
      const result = filters.reduce((acc, item) => {
        const accFiltered = acc.filter((value) => {
          if (item.operator === 'igual a') {
            return Number(value[item.column]) === item.value;
          }
          if (item.operator === 'maior que') {
            return Number(value[item.column]) > item.value;
          }
          return Number(value[item.column]) < item.value;
        });
        return accFiltered;
      }, planetsDefault);
      setPlanetscolunmFiltered(result);
    }
  }, [filters, planetsDefault]);

  useEffect(() => {
    const result = [...planetscolunmFiltered];
    if (orderOfPlanets.column === 'name') {
      if (orderOfPlanets.sort === 'ASC') {
        result.sort((a, b) => sortByNameAux(a, b, orderOfPlanets.column));
      } else {
        result.sort((a, b) => sortByNameAux(b, a, orderOfPlanets.column));
      }
      setSorteddPlanets(result);
    } else if (orderOfPlanets.sort === 'ASC') {
      result
        .sort(((a, b) => {
          if (a[orderOfPlanets.column] === 'unknown'
          || b[orderOfPlanets.column] === 'unknown') {
            return sortUnknownLast(a, b, orderOfPlanets.column);
          }
          return Number(a[orderOfPlanets.column]) - Number(b[orderOfPlanets.column]);
        }));
      setSorteddPlanets(result);
    } else {
      result
        .sort(((a, b) => {
          if (a[orderOfPlanets.column] === 'unknown'
          || b[orderOfPlanets.column] === 'unknown') {
            return sortUnknownLast(a, b, orderOfPlanets.column);
          }
          return Number(b[orderOfPlanets.column]) - Number(a[orderOfPlanets.column]);
        }));
      setSorteddPlanets(result);
    }
  }, [planetscolunmFiltered, orderOfPlanets]);

  function changeNameFilter(value) {
    setNameFilter(value);
  }

  function addFilter(filter) {
    setFilters((prev) => [...prev, filter]);
  }

  function removeFilter(filter) {
    const result = filters.filter((item) => item.column !== filter.column);
    setFilters(result);
  }

  function removeAllFilters() {
    setFilters([]);
  }

  function sortPlanets(column, sort) {
    setOrderOfPlanets({ column, sort });
  }

  return (
    <div>
      <StarWarsContext.Provider
        value={ { planets,
          changeNameFilter,
          nameFilter,
          addFilter,
          filters,
          removeFilter,
          removeAllFilters,
          sortPlanets } }
      >
        {children}
      </StarWarsContext.Provider>
    </div>
  );
}

StarWarsProvider.propTypes = {
  children: PropTypes.objectOf(PropTypes.any).isRequired,
}.isRequired;
