import "./App.css";

// Hooks
import { useAuth } from "./hooks/useAuth";

// router
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// pages
import Home from "./pages/Home/Home";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import RegisterAssistente from "./pages/Auth/RegisterAssistente";
import About from "./pages/About/About";
import Calendario from "./pages/Calendario/Calendario";
import MeusPacientes from "./pages/Pacientes/MeusPacientes";
import Paciente from "./pages/Pacientes/Paciente";
import ListaEventos from "./pages/Calendario/ListaEventos";
import Medicos from "./pages/Medicos/Medicos";
import ListEventosAssistente from "./pages/Calendario/ListEventosAssistente";
import AssistentePacienteList from "./pages/Pacientes/AssistentePacienteList";
import CalendarioAssistente from "./pages/Calendario/CalendarioAssistente";

function App() {
  const { auth, loading } = useAuth();

  if (loading) {
    return <p>Carregando...</p>;
  }
  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
        <div className="container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/login"
              element={!auth ? <Login /> : <Navigate to="/" />}
            />
            <Route
              path="/register"
              element={!auth ? <Register /> : <Navigate to="/" />}
            />
            <Route
              path="/registerAssistente"
              element={!auth ? <RegisterAssistente /> : <Navigate to="/" />}
            />
            <Route path="/about" element={<About />} />
            <Route
              path="/calendario"
              element={auth ? <Calendario /> : <Navigate to="/login" />}
            />
            <Route
              path="/calendarioAssistente/:medicoId"
              element={
                auth ? <CalendarioAssistente /> : <Navigate to="/login" />
              }
            />
            <Route
              path="/lista"
              element={auth ? <ListaEventos /> : <Navigate to="/login" />}
            />
            <Route
              path="/listaAssistente/:medicoId"
              element={
                auth ? <ListEventosAssistente /> : <Navigate to="/login" />
              }
            />
            <Route
              path="/pacientes"
              element={auth ? <MeusPacientes /> : <Navigate to="/login" />}
            />
            <Route
              path="/listaPacienteAssistente/:medicoId"
              element={
                auth ? <AssistentePacienteList /> : <Navigate to="/login" />
              }
            />
            <Route
              path="/paciente/:id"
              element={auth ? <Paciente /> : <Navigate to="/login" />}
            />
            <Route
              path="/medicos"
              element={auth ? <Medicos /> : <Navigate to="/login" />}
            />
          </Routes>
        </div>
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;
