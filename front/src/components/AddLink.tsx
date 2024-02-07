import { FC, useState } from 'react';
import styles from '../styles/AddLink.module.scss';
import axios from 'axios';

interface IAddLink{
  token?: string,
  cb?: (arg?:any) => any,
}

export const AddLink: FC<IAddLink> = ({token, cb}) => {
  let [adding, setAdding] = useState(false);
  let [link, setLink] = useState('');
  let clickHandler = () => {
    if(!adding){
      setAdding(true);
    }else{
      setAdding(false);
      if(link){
        axios.post('/api/squeeze', {link}, {headers:{
          authorization: token,
        }})
        .then(() => {
          setLink('');
          if(cb) cb();
        })
        .catch((data) => {
          setLink('');
          console.log(data.response.data)
        });
      }
    }
  }
  return (
    <div className={styles.container}>
      <button className={link ? styles.fill : ''} onClick={clickHandler}>Добавить</button>
      {adding ?
        <input 
          placeholder='Link:' 
          type="text" 
          value={link} 
          onInput={(event) => setLink(event.currentTarget.value)}
          className={link ? styles.underline : ''}
        /> :
        null
      }
    </div>
  )
}
