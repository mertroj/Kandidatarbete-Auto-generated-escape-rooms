import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import HomePage from './routes/HomePage';
import PuzzleStart from './routes/EscapeRoomPage';
import Navbar from './components/Navbar';

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage/>,
  },
  {
    path: "/escaperoom/:gameId",
    element: <PuzzleStart/>
  },
]);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <Navbar/>
    <RouterProvider router={router} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
