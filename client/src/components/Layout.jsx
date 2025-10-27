import { Outlet, Link } from 'react-router-dom';

function Layout() {
  return (
    <div className="app">
      <nav className="navbar">
        <h1>PERN App</h1>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/users/new">New User</Link></li>
        </ul>
      </nav>
      <main className="container">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;