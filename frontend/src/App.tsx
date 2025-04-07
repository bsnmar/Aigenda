import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ProjectPage from "./pages/project";
import TaskCategories from "./pages/TaskCategories";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/category/:category" element={<TaskCategories />} />
        <Route path="/projects/:id" element={<ProjectPage />} />
      </Routes>
    </Router>
  );
}

export default App;
