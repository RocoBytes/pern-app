import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import UsersNew from './pages/UsersNew';
import UsersEdit from './pages/UsersEdit';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="users/new" element={<UsersNew />} />
          <Route path="users/:id/edit" element={<UsersEdit />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;