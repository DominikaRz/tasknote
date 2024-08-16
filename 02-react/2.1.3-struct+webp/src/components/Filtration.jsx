import { useState, useEffect } from 'react';
import categoryData from '../assets/categories.json';

const statuses = [
  { status: 'TODO', tooltip: 'Undone', iconStyle: { border: '1px #01a5f7 solid', color: 'transparent' } },
  { status: 'IN_PROGRESS', tooltip: 'In progress', iconStyle: { border: '1px #01a5f7 solid' } },
  { status: 'DONE', tooltip: 'Done', iconStyle: { border: '1px #01a5f7 solid', backgroundColor: '#01a5f7' } }
];

const priorities = [
  { priority: 'LOW', style: { backgroundColor: 'white', boxShadow: 'rgb(0, 0, 0) -7px 0px 5px -2px' }, tooltip: 'Low' },
  { priority: 'MEDIUM', style: { backgroundColor: '#dbdbdb', boxShadow: 'rgb(0, 0, 0) -7px 0px 5px -2px' }, tooltip: 'Medium' },
  { priority: 'HIGH', style: { backgroundColor: '#a3a3a3', boxShadow: 'rgb(0, 0, 0) -7px 0px 5px -2px' }, tooltip: 'High' },
  { priority: 'URGENT', style: { backgroundColor: 'rgb(115, 115, 115)', boxShadow: 'rgb(0, 0, 0) -7px 0px 5px -2px' }, tooltip: 'Urgent' }
];

function Filtration() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    if(categories.length === 0 )
      setCategories(categoryData.results);
  }, []);

  return (
    <div className="uk-grid-small uk-flex-middle uk-margin-large-right" uk-grid="true">
      <div className="uk-width-expand">
        <div className="uk-grid-small uk-grid-divider" uk-grid="true">
          <FiltrationTable categories={categories} />
        </div>
      </div>
    </div>
  );
}

const FiltrationTable = ({ categories }) => (
  <table className="uk-table uk-table-responsive">
    <caption>Filtration</caption>
    <thead>
      <tr>
        <th className="uk-table-shrink"></th>
        <th className="uk-table-small">Status</th>
        <th className="uk-table-small">Priority</th>
        <th className="uk-table-expand">Category</th>
        <th className="uk-table-small">Due date</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>
          <ul className="uk-subnav uk-subnav-pill" uk-margin="true">
            <li uk-filter-control='' className='uk-active'><a className="uk-badge">All</a></li>
          </ul>
        </td>
        <td className="divide">
          <StatusFilter />
        </td>
        <td className="divide">
          <PriorityFilter />
        </td>
        <td className="divide">
          <CategoryFilter categories={categories} />
        </td>
        <td className="divide">
          <DueDateFilter />
        </td>
      </tr>
    </tbody>
  </table>
);

const StatusFilter = () => (
  <ul className="uk-subnav uk-subnav-pill" uk-margin="true">
    {statuses.map((status, index) => (
      <li key={index} uk-filter-control={`[data-done='${status.status}']`}>
        <a href="#" style={{ padding: '5px' }} uk-tooltip={status.tooltip}>
          <span uk-icon="icon: check" style={status.iconStyle}></span>
        </a>
      </li>
    ))}
  </ul>
);

const PriorityFilter = () => (
  <ul className="uk-subnav uk-subnav-pill" uk-margin="true">
    {priorities.map((priority, index) => (
      <li key={index} uk-filter-control={`[data-priority='${priority.priority}']`}>
        <a
          href="#"
          className="dot-priority"
          style={priority.style}
          uk-tooltip={priority.tooltip}
        ></a>
      </li>
    ))}
  </ul>
);

const CategoryFilter = ({ categories }) => (
  <ul className="uk-subnav uk-subnav-pill" uk-margin="true">
    {categories.map((category) => (
      <li key={category.id} uk-filter-control={`[data-cat='${category.id}']`}>
        <a href="#" className="uk-badge" style={{ backgroundColor: category.color }} uk-tooltip={category.name}></a>
      </li>
    ))}
  </ul>
);

const DueDateFilter = () => (
  <>
    <span className="uk-active" uk-filter-control="sort: data-due">
      <a className="uk-icon-link" href="#" uk-icon="icon: arrow-down" aria-label="Sort ascending"></a>
    </span>
    <span uk-filter-control="sort: data-due; order: desc">
      <a className="uk-icon-link" href="#" uk-icon="icon: arrow-up" aria-label="Sort descending"></a>
    </span>
  </>
);

export default Filtration;
