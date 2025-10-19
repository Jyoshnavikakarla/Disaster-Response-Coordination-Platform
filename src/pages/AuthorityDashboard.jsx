import React, { useState, useEffect, useRef } from "react";
import "./authority-dashboard.css";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
} from "chart.js";
import { Doughnut } from "react-chartjs-2";
import * as THREE from "three";

// --- 3D Cube ---
const DashboardCube = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    if (!mountRef.current) return;
    const width = mountRef.current.clientWidth / 2;
    const height = 200;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.z = 3;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    mountRef.current.appendChild(renderer.domElement);

    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshStandardMaterial({ color: 0x4aa96c, roughness: 0.4, metalness: 0.3 });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.7);
    dirLight.position.set(5, 5, 5);
    scene.add(dirLight);

    const animate = () => {
      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };
    animate();

    return () => {
      if (mountRef.current) mountRef.current.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} style={{ width: "50%", height: "200px" }} />;
};

// --- 3D Torus (Donut) ---
const DashboardTorus = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    if (!mountRef.current) return;
    const width = mountRef.current.clientWidth / 2;
    const height = 200;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.z = 3;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    mountRef.current.appendChild(renderer.domElement);

    const geometry = new THREE.TorusGeometry(0.8, 0.25, 16, 100);
    const material = new THREE.MeshStandardMaterial({
      color: 0x1e90ff,
      roughness: 0.5,
      metalness: 0.4,
    });
    const torus = new THREE.Mesh(geometry, material);
    scene.add(torus);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.7);
    dirLight.position.set(5, 5, 5);
    scene.add(dirLight);

    const animate = () => {
      torus.rotation.x += 0.01;
      torus.rotation.y += 0.01;
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };
    animate();

    return () => {
      if (mountRef.current) mountRef.current.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} style={{ width: "50%", height: "200px" }} />;
};

// --- Chart.js registration ---
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

// --- Doughnut chart setup ---
const initDonutData = [25, 30, 20, 15, 10];
const donutColors = ["#d9e7ebff", "#b7dfb6", "#fceabb", "#fbc9cf", "#c7d6eb"];
function getRandomData(base) {
  return base.map(val => Math.max(5, Math.min(50, val + Math.floor((Math.random() - 0.5) * 12))));
}

const AuthorityDashboard = () => {
  const [activePage, setActivePage] = useState("Overview");
  const [donutData, setDonutData] = useState(initDonutData);

  const [incidents, setIncidents] = useState([
    { id: 1, type: "Fire at Warehouse", status: "Pending" },
    { id: 2, type: "Flood at Shelter 3", status: "Pending" },
    { id: 3, type: "Accident on Highway", status: "Pending" },
    { id: 4, type: "Medical Emergency at Aid Center", status: "Pending" }
  ]);

  const updateIncidentStatus = (id, status) => {
    setIncidents(prev => prev.map(inc => (inc.id === id ? { ...inc, status } : inc)));
  };

  const [resources, setResources] = useState([
    { id: 1, type: "Vehicles", total: 10, deployed: 6 },
    { id: 2, type: "Responders", total: 42, deployed: 30 },
    { id: 3, type: "Supplies", total: 200, deployed: 120 },
    { id: 4, type: "Shelters", total: 8, deployed: 5 }
  ]);

  const [reports, setReports] = useState([
    { id: 1, date: "2025-10-19", type: "Fire", status: "Resolved", resolvedBy: "Team Alpha" },
    { id: 2, date: "2025-10-18", type: "Flood", status: "Pending", resolvedBy: "-" },
    { id: 3, date: "2025-10-17", type: "Accident", status: "Resolved", resolvedBy: "Team Bravo" },
    { id: 4, date: "2025-10-16", type: "Medical", status: "Resolved", resolvedBy: "Team Charlie" }
  ]);

  useEffect(() => {
    const timer = setInterval(() => {
      setDonutData(data => getRandomData(data));
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const donutChartData = {
    labels: ["Responders", "Victims", "Supplies", "Shelters", "Vehicles"],
    datasets: [{ data: donutData, backgroundColor: donutColors, borderWidth: 2, borderColor: "#f5f8fa" }]
  };

  return (
    <div className="authority-dashboard-container">
      {/* Navbar */}
      <nav className="dashboard-header-bar">
        <div className="db-header-left">
          <div className="logo">Authority Dashboard</div>
          <ul className="db-nav-list">
            {["Overview", "Incidents", "Resources", "Reports"].map(page => (
              <li key={page} className={`db-nav-item ${activePage === page ? "active" : ""}`} onClick={() => setActivePage(page)}>{page}</li>
            ))}
          </ul>
        </div>
        <div className="db-header-right">
          <span className="icon notif"><i className="fa fa-envelope"></i><span className="notif-badge red">2</span></span>
          <span className="icon notif"><i className="fa fa-bell"></i><span className="notif-badge green">3</span></span>
          <span className="user-info"><img src="https://via.placeholder.com/32" className="user-avatar" alt="authority user" />Authority User</span>
        </div>
      </nav>

      {/* Header & actions */}
      <div className="dashboard-page-header-utility">
        <h2><i className="fa fa-shield-alt"></i> Authority Control</h2>
        <div className="dashboard-actions">
          <button>New Incident</button>
          <button>Allocate Resources</button>
          <select><option>Today</option><option>This Week</option><option>This Month</option></select>
        </div>
      </div>

      {/* Dashboard content */}
      <div className="dashboard-content">
        {activePage === "Overview" && (
          <>
            {/* 3D Stats Cube */}
            <div className="stats-cube-container">
              <div className="stats-cube">
                <div className="cube-face front">
                  <div className="dashboard-stat-title">Active Incidents</div>
                  <div className="dashboard-stat-value">{incidents.filter(i => i.status==="Pending").length}</div>
                </div>
                <div className="cube-face back">
                  <div className="dashboard-stat-title">Resources Dispatched</div>
                  <div className="dashboard-stat-value">{resources.reduce((a,b)=>a+b.deployed,0)}</div>
                </div>
                <div className="cube-face left">
                  <div className="dashboard-stat-title">Responders Active</div>
                  <div className="dashboard-stat-value">{resources.find(r=>r.type==="Responders")?.deployed||0}</div>
                </div>
                <div className="cube-face right">
                  <div className="dashboard-stat-title">Critical Alerts</div>
                  <div className="dashboard-stat-value">1</div>
                </div>
              </div>
            </div>

            

            {/* Charts */}
            <section className="dashboard-charts-row">
              <div className="chart-card">
                <div className="chart-header">Incident/Resource Breakdown <i className="fa fa-chevron-down"></i></div>
                <Doughnut data={donutChartData} />
              </div>
              <div className="chart-card">
                <div className="chart-header">Live Communications <i className="fa fa-chevron-down"></i></div>
                <div className="communication-feed">
                  <div className="message authority"><span className="role">Authority:</span> All teams, confirm status ASAP.<button className="action-btn">Acknowledge</button></div>
                  <div className="message volunteer"><span className="role">Volunteer:</span> Team Alpha reporting, at Shelter 1, awaiting further orders.<button className="action-btn">Reply</button></div>
                </div>
              </div>
            </section>
          </>
        )}

        {/* Incidents Page */}
        {activePage === "Incidents" && (
          <div className="incidents-container">
            <h2>Incidents List</h2>
            {incidents.map(inc => (
              <div key={inc.id} className={`incident-card ${inc.status==="Resolved"?"resolved":"pending"}`}>
                <div className="incident-left">
                  <div className="incident-type">{inc.type}</div>
                  <div className="incident-id">ID: {inc.id}</div>
                </div>
                <div className="incident-right">
                  <select value={inc.status} onChange={e=>updateIncidentStatus(inc.id,e.target.value)}>
                    <option>Pending</option>
                    <option>Resolved</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Resources Page */}
        {activePage === "Resources" && (
          <div className="resources-container">
            <h2>Resources Overview</h2>
            <div className="resources-grid">
              {resources.map(r => (
                <div key={r.id} className="resource-card">
                  <div className="resource-header">
                    <div className="resource-type">{r.type}</div>
                    <div className="resource-count">{r.deployed}/{r.total}</div>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width:`${(r.deployed/r.total)*100}%` }}></div>
                  </div>
                  <button className="action-btn">Allocate</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Reports Page */}
        {activePage === "Reports" && (
          <div className="reports-container">
            <h2>Incident Reports</h2>
            <table className="reports-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Resolved By</th>
                </tr>
              </thead>
              <tbody>
                {reports.map(r => (
                  <tr key={r.id}>
                    <td>{r.date}</td>
                    <td>{r.type}</td>
                    <td>{r.status}</td>
                    <td>{r.resolvedBy}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthorityDashboard;
