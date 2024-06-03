import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AppContextProvider } from "../Context/AppContext";

import {
  ParentApp,
  Home,
  CurrentProject,
  UploadToProject,
  UploadProject,
  Auth,
  PageNotFound,
} from "./index";

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
            <Route path="*" element={<PageNotFound />} />
          </Route>
        </Routes>
      </Router>
    </AppContextProvider>
  );
}

export default App;
