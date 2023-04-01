import { useParams } from 'react-router-dom';
import { useEffect, useReducer, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
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
      return { ...state, contacts: action.payload, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

const Assignments = () => {
  const params = useParams();
  const { id, slug } = params;

  const [since, setSince] = useState('2023-01-01');
  const [until, setUntil] = useState('2023-03-27');

  const [{ loading, error, contacts }, dispatch] = useReducer(reducer, {
    contacts: [],
    loading: true,
    error: '',
  });

  const [campaignInsights, setCampaigns] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const response = await axios.get(
          `/api/contacts-by-time-range?since=${since}&until=${until}`
        );

        // Fetch Campaign Insights
        const campaignsResponse = await axios.get(
          `/api/campaign-insights/act_${id}?since=${since}&until=${until}`
        );
        setCampaigns(campaignsResponse.data);

        dispatch({ type: 'FETCH_SUCCESS', payload: response.data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: err.message });
      }
    };
    fetchData();
  }, [id, since, until]);

  const assignments = contacts.filter((contact) => {
    return (
      contact.properties.hs_analytics_first_url &&
      contact.properties.hs_analytics_first_url.includes(`hsa_cam=${slug}`)
    );
  });

  //   const campaigns = campaignInsights;
  //   console.log(campaigns);

  console.log(assignments);

  return (
    <div>
      <h2>Assignments</h2>

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
            <th>Email</th>
            <th>Canal de captación</th>
            <th>Lifecyclestage</th>
            <th>Canal de Captación</th>
            <th>Fecha de Creación</th>
            <th>Fecha de Asignación</th>
            <th>Desarrollo</th>
            <th>Estado del Lead</th>
            <th>Campaña</th>
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
            assignments.map((element) => (
              <tr key={element.id}>
                <td>{element.properties.email}</td>
                <td>{element.properties.canal_de_captacion}</td>
                <td>{element.properties.lifecyclestage}</td>
                <td>{element.properties.canal_de_captacion}</td>
                <td>{element.createdAt}</td>
                <td>{element.properties.hubspot_owner_assigneddate}</td>
                <td>{element.properties.desarrollo}</td>
                <td>{element.properties.hs_lead_status}</td>
                <td>
                  {element.properties.hs_analytics_first_url &&
                  element.properties.hs_analytics_first_url.startsWith(
                    'https://www.facebook.com/'
                  )
                    ? (
                        campaignInsights.campaigns.data.filter(
                          (obj) =>
                            obj.id ===
                            element.properties.hs_analytics_first_url.match(
                              /hsa_cam=(\d+)/
                            )[1]
                        )[0] || {}
                      ).name
                    : 'Google Campaign'}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>
    </div>
  );
};

export default Assignments;
