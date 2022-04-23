import React, { useContext, useEffect, useState } from 'react';
import StarWarsContext from '../context/StarWarsContext';

const columnList = ['population', 'orbital_period', 'diameter',
  'rotation_period', 'surface_water'];

function filterColumnOptions(options, removeItems) {
  const result = options
    .filter((item) => item !== removeItems);
  return result;
}
export default function Filter() {
  const { changeNameFilter, nameFilter, addFilter, filters, removeFilter,
    removeAllFilters, sortPlanets } = useContext(StarWarsContext);
  const [columnFilter, setColumnFilter] = useState(columnList[0]);
  const [columnOptions, setColumnOptions] = useState(columnList);
  const [operator, setOperator] = useState('maior que');
  const [valueFilter, setValueFilter] = useState(0);
  const [columnOrder, setColumnOrder] = useState(columnList[0]);
  const [sortOrder, setSortOrder] = useState('ASC');

  useEffect(() => {
    setColumnFilter(columnOptions[0]);
  }, [columnOptions]);

  function handleAddFilter() {
    const filter = {
      column: columnFilter,
      operator,
      value: Number(valueFilter),
    };
    addFilter(filter);
    setColumnOptions(() => filterColumnOptions(columnOptions, columnFilter));
  }

  return (
    <div>
      <div>
        <label htmlFor="filter__name">
          Projeto Star Wars-Trybe
          <br />
          <input
            data-testid="name-filter"
            id="filter__name"
            value={ nameFilter }
            onChange={ ({ target: { value } }) => changeNameFilter(value) }
          />
        </label>
      </div>
      <div>
        <label htmlFor="filter__column">
          <p>Coluna</p>
          <select
            data-testid="column-filter"
            id="filter__column"
            value={ columnFilter }
            onChange={ ({ target: { value } }) => setColumnFilter(value) }
          >
            {columnOptions.map((item) => (
              <option
                key={ item }
                value={ item }
              >
                {item}
              </option>))}
          </select>
        </label>
        <label htmlFor="filter__comparison">
          <p>Operador</p>
          <select
            data-testid="comparison-filter"
            id="filter__comparison"
            value={ operator }
            onChange={ ({ target: { value } }) => setOperator(value) }
          >
            <option value="maior que">maior que</option>
            <option value="igual a">igual a</option>
            <option value="menor que">menor que</option>
          </select>
        </label>
        <label htmlFor="filter__value-filter">
          <input
            data-testid="value-filter"
            type="number"
            id="filter__value-filter"
            value={ valueFilter }
            onChange={ ({ target: { value } }) => setValueFilter(value) }
          />
        </label>
        <button
          data-testid="button-filter"
          type="button"
          onClick={ handleAddFilter }
        >
          Filtrar

        </button>
        <button
          data-testid="button-remove-filters"
          type="button"
          onClick={ () => removeAllFilters() }
        >
          Remover todas filtragens
        </button>
      </div>
      <div>
        <label htmlFor="sort__column">
          <p>ordenar</p>
          <select
            data-testid="column-sort"
            id="sort__column"
            value={ columnOrder }
            onChange={ ({ target: { value } }) => setColumnOrder(value) }
          >
            {columnList.map((item) => (
              <option
                value={ item }
                key={ item }
              >
                {item}
              </option>))}
          </select>
        </label>
        <label htmlFor="sort__asc">
          <input
            data-testid="column-sort-input-asc"
            type="checkbox"
            id="sort__asc"
            value="ASC"
            checked={ sortOrder === 'ASC' }
            onChange={ () => setSortOrder('ASC') }
          />
          Ascendente
        </label>
        <label htmlFor="sort__desc">
          <input
            data-testid="column-sort-input-desc"
            type="checkbox"
            id="sort__desc"
            value="DESC"
            checked={ sortOrder === 'DESC' }
            onChange={ () => setSortOrder('DESC') }
          />
          Descendente
        </label>
        <button
          type="button"
          data-testid="column-sort-button"
          onClick={ () => sortPlanets(columnOrder, sortOrder) }
        >
          Ordenar
        </button>
      </div>
      <div />
      {filters.map((item) => (
        <div key={ item.column } data-testid="filter">
          <span>
            {`${item.column} ${item.operator} ${item.value} `}
          </span>
          <button
            type="button"
            onClick={ () => removeFilter(item) }
          >
            X
          </button>
        </div>
      ))}
      <div />
    </div>
  );
}
