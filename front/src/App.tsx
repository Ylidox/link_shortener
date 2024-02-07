import { Route, Routes } from 'react-router-dom';
import './App.css'
import { Login } from './pages/Login';
import { Registration } from './pages/Registration';
import { AuthProvider } from './contexts/AuthContext';
import { Layout } from './hoc/Layout';
import { Home } from './pages/Home';

function App() {

  return (
    <AuthProvider>
      <Routes>
        <Route path='/' element={<Layout/>}>
          <Route index element={<Home/>}/>
        </Route>
        <Route path='/login' element={<Login/>}/>
        <Route path='/register' element={<Registration/>}/>
      </Routes>
    </AuthProvider>
  );
}

export default App
