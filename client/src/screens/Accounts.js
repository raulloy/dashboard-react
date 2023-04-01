import { useEffect, useReducer, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import logger from 'use-reducer-logger';
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, accountInsights: action.payload, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

const Accounts = () => {
  const [since, setSince] = useState('2023-02-01');
  const [until, setUntil] = useState('2023-02-28');

  const [{ loading, error, accountInsights }, dispatch] = useReducer(
    logger(reducer),
    {
      accountInsights: [],
      loading: true,
      error: '',
    }
  );

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const response = await axios.get(
          `/api/account-insights?since=${since}&until=${until}`
        );
        dispatch({ type: 'FETCH_SUCCESS', payload: response.data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: err.message });
      }
    };
    fetchData();
  }, [since, until]);

  return (
    <div>
      <h2>Account Insights</h2>

      <Form>
        <Row>
          <Col sm={4} md={3} className="my-2">
            <InputGroup size="sm" className="mb-3">
              <InputGroup.Text>Since</InputGroup.Text>
              <Form.Control
                type="date"
                value={since}
                onChange={(e) => setSince(e.target.value)}
              />
            </InputGroup>
          </Col>
          <Col sm={4} md={3} className="my-2">
            <InputGroup size="sm" className="mb-3">
              <InputGroup.Text>Until</InputGroup.Text>
              <Form.Control
                type="date"
                value={until}
                onChange={(e) => setUntil(e.target.value)}
              />
            </InputGroup>
          </Col>
        </Row>
      </Form>

      <Table striped hover>
        <thead>
          <tr>
            <th>Account Name</th>
            <th>Reach</th>
            <th>Impressions</th>
            <th>Clicks</th>
            <th>CPC</th>
            <th>Spend</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="4">Loading...</td>
            </tr>
          ) : error ? (
            <tr>
              <td colSpan="4">{error}</td>
            </tr>
          ) : (
            accountInsights.map((element) => (
              <tr key={element.account_id}>
                <td>
                  <Link to={`/campaigns/${element.account_id}`}>
                    {element.account_name}
                  </Link>
                </td>
                <td>{element.reach}</td>
                <td>{element.impressions}</td>
                <td>{element.clicks}</td>
                <td>{element.cpc}</td>
                <td>{element.spend}</td>
              </tr>
            ))
          )}
        </tbody>
      </Table>
    </div>
  );
};

export default Accounts;
