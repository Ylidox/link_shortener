import { FC, memo } from 'react';
import {useTable, Column} from 'react-table';
import styles from '../styles/Table.module.scss'

export interface IRecord{
  icon: React.ReactElement,
  target_link: string,
  short_link: React.ReactElement | string,
  click_counter: number,
}

const columns: Column<IRecord>[] = [
  {
    Header: 'Icon',
    accessor: 'icon',
  },
  {
    Header: 'Target',
    accessor: 'target_link',
  },
  {
    Header: 'Short',
    accessor: 'short_link',
  },
  {
    Header: 'Click Count',
    accessor: 'click_counter',
  },
];

export interface ITableProp{
  data: IRecord[],
}

export const Table: FC<ITableProp> = memo(({data}) => {
  let {
    getTableProps, 
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({
    columns,
    data,
  });

  return (
    <table {...getTableProps()} className={styles.table}>
      <thead>
        {headerGroups.map(group => (
          <tr {...group.getHeaderGroupProps()}>
            {group.headers.map(column => (
              <th {...column.getHeaderProps()}>{column.render('Header')}</th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map(row => {
          prepareRow(row);
          return (
            <tr {...row.getRowProps()} >
              {row.cells.map(cell => (
                <td {...cell.getCellProps()}>
                  {cell.render('Cell')}
                </td>
              ))}
            </tr>
          );
        })}
      </tbody>
    </table>
  )
})

