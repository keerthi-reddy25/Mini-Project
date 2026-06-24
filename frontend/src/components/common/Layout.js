import React from 'react';
import Sidebar from './Sidebar';
import '../../App.css';

export default function Layout({ title, children }) {
  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <div className="topbar">
          <h1>{title}</h1>
        </div>
        <div className="page-body">{children}</div>
      </div>
    </div>
  );
}
