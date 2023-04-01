import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Accounts from './screens/Accounts';
import Campaigns from './screens/Campaigns';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import { LinkContainer } from 'react-router-bootstrap';
import Assignments from './screens/Assignments';

function App() {
  return (
    <BrowserRouter>
      <div className="d-flex flex-column site-container">
        <header>
          <Navbar bg="dark" variant="dark">
            <Container>
              <LinkContainer to="/">
                <Navbar.Brand>GIM</Navbar.Brand>
              </LinkContainer>
            </Container>
          </Navbar>
        </header>
        <main>
          <Container>
            <Routes>
              <Route path="/" element={<Accounts />} />
              <Route path="/campaigns/:id" element={<Campaigns />} />
              <Route path="/assignments/:id/:slug" element={<Assignments />} />
            </Routes>
          </Container>
        </main>
        <footer>
          <div className="text-center">All rights reserved</div>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
