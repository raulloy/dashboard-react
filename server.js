import express from 'express';
import { getAccountInsights, getCampaignInsights } from './api.js';
import config from './config.js';
import mongoose from 'mongoose';
import Contact from './models/contactModel.js';
import path from 'path';

mongoose
  .connect(config.MONGODB_URL)
  .then(() => {
    console.log('Connected to mongodb');
  })
  .catch((error) => {
    console.log(error.reason);
  });

const app = express();

const accessToken = config.FB_API_TOKEN;

const accounts = [
  {
    name: 'HU LOMAS DE LA PLATA',
    id: 'act_930432200705578',
  },
  {
    name: 'TRES LAGOS LIFESTYLE',
    id: 'act_177341126950476',
  },
  {
    name: 'HU AQUASOL',
    id: 'act_562909907769407',
  },
  {
    name: 'VILLAS DEL CAMPO LIFESTYLE',
    id: 'act_225593191779506',
  },
  {
    name: 'SANTA FE LIFESTYLE',
    id: 'act_2480551222261700',
  },
  {
    name: 'ADARA LIFESTYLE',
    id: 'act_159175185508724',
  },
  {
    name: 'CENTRAL PARK',
    id: 'act_265576294404103',
  },
  {
    name: 'HU PALMAS TURQUESA',
    id: 'act_1087088964961886',
  },
  {
    name: 'MERIDEN',
    id: 'act_2499601070366586',
  },
  {
    name: 'HU LAS TROJES',
    id: 'act_1256683497854234',
  },
  {
    name: 'BALI LIFESTYLE',
    id: 'act_2190256254410586',
  },
  {
    name: 'HU PALMAS YUCATÁN',
    id: 'act_195882471564062',
  },
  {
    name: 'COSMOPOL LIFESTYLE',
    id: 'act_268790700756542',
  },
  // {
  //   name: 'HU PASEOS DE LA LAGUNA',
  //   id: 'act_3642982019076030',
  // },
  {
    name: 'SUMMIT PARK LIFESTYLE',
    id: 'act_2573491999594759',
  },
  {
    name: 'HU CIUDAD NATURA',
    id: 'act_176055110376237',
  },
  {
    name: 'HU CASCOS AZULES',
    id: 'act_175324893748729',
  },
  {
    name: 'HU MARINA TURQUESA',
    id: 'act_3671037146254618',
  },
  {
    name: 'HU JARDINES DE LA LAGUNA',
    id: 'act_1116629645809089',
  },
  {
    name: 'HU PASEOS DE LOS VIRREYES',
    id: 'act_3064079737176705',
  },
  // {
  //   name: 'HU BDI',
  //   id: 'act_793700688385551',
  // },
];

app.get('/api/account-insights', (req, res) => {
  const AccountInsights = accounts.map(async (account) => {
    const { since, until } = req.query;

    const data = await getAccountInsights(
      accessToken,
      account.id,
      since,
      until
    );

    return data.data[0];
  });

  Promise.all(AccountInsights)
    .then((results) => {
      res.send(results);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Something went wrong');
    });
});

app.get('/api/campaign-insights/:id', async (req, res) => {
  const { since, until } = req.query;
  const CampaignInsightsObj = await getCampaignInsights(
    accessToken,
    req.params.id,
    since,
    until
  );

  res.send(CampaignInsightsObj);
});

app.get('/api/contacts-by-time-range', async (req, res) => {
  const { since, until } = req.query;

  try {
    const contacts = await Contact.find({
      'properties.hubspot_owner_assigneddate': {
        $gte: new Date(since),
        $lte: new Date(until),
      },
    });

    res.send(contacts);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.get('/api/assignments-by-campaign/:id', async (req, res) => {
  const { since, until } = req.query;

  const [contacts, CampaignInsightsObj] = await Promise.all([
    Contact.find({
      'properties.hubspot_owner_assigneddate': {
        $gte: new Date(since),
        $lte: new Date(until),
      },
    }),
    getCampaignInsights(accessToken, req.params.id, since, until),
  ]);

  const campaignsByObjective = CampaignInsightsObj.campaigns.data.filter(
    (campaign) => campaign.insights !== undefined
  );
  // .map((campaign) => {
  //   const objective = {
  //     OUTCOME_LEADS: 'leads',
  //     LEAD_GENERATION: 'leads',
  //     MESSAGES: 'messages',
  //     LINK_CLICKS: 'traffic',
  //     OUTCOME_TRAFFIC: 'traffic',
  //     POST_ENGAGEMENT: 'interaction',
  //     OUTCOME_ENGAGEMENT: 'likes',
  //   }[campaign.objective];
  //   return objective ? { id: campaign.id, objective } : null;
  // })
  // .filter(Boolean);

  const assignmentsByCampaign = contacts.reduce((acc, contact) => {
    const url = contact.properties.hs_analytics_first_url || '';
    const campaignId = url.match(/hsa_cam=(\d+)/)?.[1];
    const campaign = campaignsByObjective.find(
      (c) => c.id === campaignId && c.objective
    );
    if (campaign) {
      acc[campaign.id] = (acc[campaign.id] || 0) + 1;
    }
    return acc;
  }, {});

  res.send(assignmentsByCampaign);
});

const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, '/client/build')));
app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, '/client/build/index.html'))
);

app.listen(config.PORT, () => {
  console.log('Server running at http://localhost:5000');
});
