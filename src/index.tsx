import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from './pages/HomePage';
import VotingPage from './pages/VotingPage';
import ResultsPage from './pages/ResultsPage';
import AdminPanel from './pages/AdminPanel';

const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(
  <BrowserRouter>
    <Routes>
  <Route path="/" element={<HomePage />} />
  <Route path="/vote" element={<VotingPage />} />
  <Route path="/results" element={<ResultsPage />} />
  <Route path="/admin" element={<AdminPanel />} />
</Routes>
  </BrowserRouter>
);

