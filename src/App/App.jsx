import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AppContextProvider } from "../Context/AppContext";

import ParentApp from "../Components/ParentApp/ParentApp";
import Home from "../Components/Home/Home";
import CurrentProject from "../Components/CuurentProject/CuurentProject";
import UploadToProject from "../Components/UploadToProject/UploadToProject";
import UploadProject from "../Components/UploadProject/UploadProject";
import Auth from "../Components/Auth/Auth";

Route;
function App() {
  return (
    <AppContextProvider>
      <Router>
        <Routes>
          <Route path="Suuru-Portfolio" element={<ParentApp />}>
            <Route path="" element={<Home />} />
            <Route path="project/:name" element={<CurrentProject />} />
            <Route path="uploadToProject/:name" element={<UploadToProject />} />
            <Route path="uploadProject" element={<UploadProject />} />
            <Route path="login" element={<Auth />} />
          </Route>
        </Routes>
      </Router>
    </AppContextProvider>
  );
}

export default App;
