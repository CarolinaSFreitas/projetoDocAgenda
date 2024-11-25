import "./Home.css";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";


const Home = () => {
  const { auth } = useAuth();
  const user = localStorage.getItem("user");
  const userData = user ? JSON.parse(user) : null;
  const isAssistente = userData?.isAssistente;
  return (
    <div className="home">
      <h1>Bem Vindo a DocAgenda!</h1>

      {auth &&
          userData &&
          userData.isAssistente !== null &&
          !userData.isAssistente ? (
            <div>
              <p>
                A DocAgenda busca melhorar a organização e a eficácia do trabalho dos
                profissionais de saúde, promovendo o acesso às informações do paciente
                de forma centralizada, rápida e completa.
                <br />
                <br />O que você deseja fazer?
              </p>
              <div className="opcoes">
                <Link to="/calendario" className="btn btn-dark">
                  Ver Calendario
                </Link>
                <Link to="/pacientes" className="btn btn-dark">
                  Meus Pacientes
                </Link>
              </div>
            </div>

        ) : userData &&
        userData.isAssistente !== null &&
        userData.isAssistente ? (
            <div>
              <p>
              Para começar, selecione o médico que deseja gerenciar. Após a seleção, você poderá visualizar e atualizar a agenda de compromissos, garantir que os horários estejam organizados e ajudar a otimizar o tempo do médico e dos pacientes.
              <br />
              <br />
              Como funciona?
              </p>
              <ol>
                <li>Vá para a lista de médicos.</li>
                <li>Envie uma solicitação para ter acesso à agenda e dados dos pacientes.</li>
                <li>Após a autorização, você poderá gerenciar compromissos e realizar atualizações necessárias.</li>
              </ol>
              <div className="opcoes">
                <Link to="/medicos" className="btn btn-dark">
                  Ver Médicos
                </Link>
              </div>
            </div>

      ) : (
            <div>
              <p>
                A DocAgenda busca melhorar a organização e a eficácia do trabalho dos
                profissionais de saúde, promovendo o acesso às informações do paciente
                de forma centralizada, rápida e completa.
                <br />
                <br />O que você deseja fazer?
              </p>
              
              <div className="opcoes">
                <Link to="/register" className="btn btn-dark">
                  Cadastrar como Médico
                </Link>
                <Link to="/registerAssistente" className="btn btn-dark">
                  Cadastrar como Assistente
                </Link>
              </div>
            </div>
      )}
    </div>
  );
};

export default Home;
