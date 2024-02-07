import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import styles from '../styles/Home.module.scss';
import axios from "axios";
import { IRecord, ITableProp, Table } from "../components/Table";
import { useEffect, useState } from "react";
import { Clipboard } from "../components/Clipboard";
import { AddLink } from "../components/AddLink";
import { Pagination } from "../components/Pagination";
import { Sorter } from "../components/Sorter";

interface ILink{
  click_counter: number,
  customer_id: number,
  id: number,
  short_link: string,
  target_link: string,
}


export const Home = () => {
  let {user,signOut} = useAuth();
  let [data, setData] = useState<ILink[]>([]);
  let [countRows, setCountRows] = useState(0);
  let [order, setOrder] = useState('void');
  let [pagination, setPagination] = useState({
    limit: 10,
    offset: 0,
  });


  let navigate = useNavigate();
  const url = 'http://45.153.69.13:3005';

  const getCountRows = () => {
    axios.get('/api/count', {headers:{
      authorization: user?.token,
    }})
    .then(data => setCountRows(+data.data.total_rows))
  }

  const convertLinksToTableProp = (): ITableProp => {
    let out: IRecord[] = data.map(item => {
      return {
        icon: <img src={`${new URL(item.target_link).origin}/favicon.ico`}/>,
        target_link: item.target_link,
        short_link: <Clipboard text={`${url}/s/${item.short_link}`}/>,
        click_counter: item.click_counter,
      }
    })
    return {
      data: out,
    };
  }

  const exitHandler = () => {
    if(signOut) signOut(() => navigate('/login', {replace: true}));
  }

  const getData = () => {
    axios.get<ILink[]>(`/api/statistics?order=${order}&limit=${pagination.limit}&offset=${pagination.offset}`, {headers:{
      authorization: user?.token,
    }}).then(data => setData(data.data))
  }
  
  useEffect(() => {
    getCountRows();
  }, []);

  useEffect(() => {
    getData();
  }, [pagination]);

  useEffect(() => {
    setPagination({...pagination});
  }, [order]);

  return (
    <div className={styles.container}>
      <div className={styles.user}>
        <h1>{user?.username}</h1>
        <p 
          className={styles.exit}
          onClick={exitHandler}
        >
          Выйти
        </p>
      </div>
      <AddLink token={user?.token} cb={getData}/>
      <Sorter cb={(order: string) => {
        setOrder(order);
      }}/>
      <Table {...convertLinksToTableProp()}/>
      <Pagination count={countRows} cb={(pag) => {
        setPagination(pag)
      }} />
    </div>
  )
}
