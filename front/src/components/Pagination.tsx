import { FC, useEffect, useState } from 'react'
import styles from '../styles/Pagination.module.scss';
import { VscDebugRestart } from "react-icons/vsc";

interface IPaginationProp{
  count: number,
  cb?: (arg?: any) => any,
}

export const Pagination: FC<IPaginationProp> = ({count, cb}) => {
  const page_size = 10;
  let [page, setPage] = useState(0);
  let [buttons, setButtons] = useState<JSX.Element[]>([]);

  let initButtons = (count: number, page_size: number) => {
    let out:JSX.Element[] = [];
    for(let i = 0; i < Math.ceil(count / page_size); i++){
      out.push(
        <button
          onClick={() => setPage(i)}
          className={page == i ? styles.fill : ''}
          key={i}
        >
          {i+1}
        </button>
      );
    }

    out.push(
      <button
        key={out.length}
        onClick={() => {
          if(cb) cb({
            limit: page_size,
            offset: page_size * page,
          });
        }}
        className={styles.refresh}
      >
        <VscDebugRestart/>
      </button>
    );
    
    return out;
  }
  

  useEffect(() => {
    setButtons(initButtons(count, page_size))
  }, [count])

  useEffect(() => {
    if(cb) cb({
      limit: page_size,
      offset: page_size * page,
    });
    setButtons(initButtons(count, page_size));
  }, [page])

  return (
    <div className={styles.container}>
      {buttons}
    </div>
  )
}
