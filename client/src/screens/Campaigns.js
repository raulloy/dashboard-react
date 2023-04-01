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
      return { ...state, campaignInsights: action.payload, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

const Campaigns = () => {
  const params = useParams();
  const { id } = params;

  const [since, setSince] = useState('2023-01-01');
  const [until, setUntil] = useState('2023-03-27');

  const [{ loading, error, campaignInsights }, dispatch] = useReducer(reducer, {
    campaignInsights: [],
    loading: true,
    error: '',
  });

  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        // Fetch Campaign Insights
        const response = await axios.get(
          `/api/campaign-insights/act_${id}?since=${since}&until=${until}`
        );
        dispatch({ type: 'FETCH_SUCCESS', payload: response.data });

        // Fetch Contacts
        const contactsResponse = await axios.get(
          `/api/contacts-by-time-range?since=${since}&until=${until}`
        );
        setContacts(contactsResponse.data);
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: err.message });
      }
    };
    fetchData();
  }, [id, since, until]);

  const contactsbyCampaign = contacts.map(({ id, properties }) => ({
    id,
    hs_analytics_first_url: properties.hs_analytics_first_url
      ? properties.hs_analytics_first_url.match(/hsa_cam=(\d+)/)?.[1]
      : null,
  }));

  console.log('contactsbyCampaign', contactsbyCampaign);

  const contactCountsByCampaign = contactsbyCampaign.reduce((acc, contact) => {
    const campaign = campaignInsights.campaigns.data.find(
      (c) => c.id === contact.hs_analytics_first_url
    );
    const campaignId = campaign ? campaign.id : 'unknown';
    acc[campaignId] = (acc[campaignId] || 0) + 1;
    return acc;
  }, {});

  console.log(contactCountsByCampaign);

  return loading ? (
    <div>Loading...</div>
  ) : error ? (
    <div>{error}</div>
  ) : (
    <div>
      <h2>Campaign Insights</h2>

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

      <Table striped hover responsive>
        <thead>
          <tr>
            <th>Campaign Name</th>
            <th>Objective</th>
            <th>Status</th>
            <th>Assignments</th>
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
            campaignInsights.campaigns.data.map((element) => (
              <tr key={element.id}>
                <td>{element.name}</td>
                <td>{element.objective}</td>
                <td>{element.status}</td>
                <td>
                  <Link to={`/assignments/${id}/${element.id}`}>
                    {[contactCountsByCampaign].reduce(
                      (acc, obj) => (element.id in obj ? obj[element.id] : acc),
                      0
                    )}
                  </Link>
                </td>
                <td>{element.insights ? element.insights.data[0].spend : 0}</td>
              </tr>
            ))
          )}
        </tbody>
      </Table>
    </div>
  );
};

export default Campaigns;
