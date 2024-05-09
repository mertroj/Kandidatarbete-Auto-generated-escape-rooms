import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import reportWebVitals from './reportWebVitals';
import './index.css';
import HomePage from './routes/HomePage';
import PuzzleStart from './routes/EscapeRoomPage';
import ResultScreenPage from "./routes/ResultScreenPage";
import StartPage from './routes/StartPage';

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage/>,
  },
  {
    path: "/escaperoom/:gameId",
    element: <PuzzleStart/>
  },
  {
    path: "/escaperoom/:gameId/start",
    element: <StartPage/>
  },
  {
    path: "/escaperoom/:gameId/result",
    element: <ResultScreenPage/>
  }
]);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
    <RouterProvider router={router} />
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
