import './App.css';
import Navbar from "./components/navbar";
import Home from "./pages/home";
import { Route, Routes } from 'react-router-dom';
import UserAuthForm from './pages/userAuthForm.page';

function App() {
  return (

    <Routes>
      {/* Маршрут для реєстрації без Navbar */}
      <Route path="signup" element={<UserAuthForm type="sign-up" />} />
      <Route path="signin" element={<UserAuthForm type="sign-in" />} />

      {/* Група маршрутів з Navbar */}
      <Route path="/" element={<Navbar></Navbar>}>
        <Route index element={<Home />} /> {/* Головна сторінка */}

      </Route>
    </Routes>

  )
}

export default App
