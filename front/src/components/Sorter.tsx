import { FC, useEffect, useState } from "react";
import styles from '../styles/Sorter.module.scss'

const orders = {
  asc_target:   'asc_target',
  asc_short:    'asc_short',
  asc_counter:  'asc_counter',
  desc_short:   'desc_short' ,
  desc_target:  'desc_target',
  desc_counter: 'desc_counter',
};

interface ISorter{
  cb?: (arg?: any) => any
}

export const Sorter: FC<ISorter> = ({cb}) => {
  let [order, setOrder] = useState<keyof typeof orders | 'void'>('void');
  let [first, setFirst] = useState(true);

  useEffect(() => {
    if(!first && cb) cb(order);
  }, [order]);

  return (
    <div className={styles.container}>
      <div>Sort by: {order}</div>
      <div>
        {Object.keys(orders).map(key => {
          return (
            <button 
              key={key}
              onClick={() => {
                setOrder(key as keyof typeof orders);
                setFirst(false);
              }}
              className={order == key ? styles.fill : ''}
            >
              {key}
            </button>
          );
        })}
        <button
          onClick={() => {
            setOrder('void');
            setFirst(false);
          }}
          className={order == 'void' ? styles.fill : ''}
        >
          Пропустить
        </button>
      </div>
    </div>
  )
}
