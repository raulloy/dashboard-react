import axios from 'axios';
import config from './config.js';

export const getAccountInsights = async (
  accessToken,
  accountId,
  since = '2023-02-01',
  until = '2023-02-28'
) => {
  try {
    const response = await axios({
      url: `https://graph.facebook.com/v15.0/${accountId}/insights?fields=account_id,account_name,reach,clicks,impressions,spend,cpc,ctr,conversions,frequency,actions&time_range={'since':'${since}','until':'${until}'}&access_token=${accessToken}`,
      method: 'GET',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    return error;
  }
};

export const getCampaignInsights = async (
  accessToken,
  accountId,
  since = '2023-02-01',
  until = '2023-02-28'
) => {
  try {
    const response = await axios({
      url: `https://graph.facebook.com/v15.0/${accountId}?fields=name,campaigns{name,status,objective,account_id,insights.time_range({"since":"${since}","until":"${until}"}){reach,clicks,impressions,spend,cpc,ctr,actions}}&access_token=${accessToken}`,
      method: 'GET',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    return error;
  }
};

export const getAdSetsInsights = async (
  accessToken,
  campaignID,
  since = '2023-02-01',
  until = '2023-02-28'
) => {
  try {
    const response = await axios({
      url: `https://graph.facebook.com/v15.0/${campaignID}?fields=name,objective,adsets{name,status,insights.time_range({"since":"${since}","until":"${until}"}){reach,clicks,impressions,spend,cpc,ctr,actions}}&access_token=${accessToken}`,
      method: 'GET',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    return error;
  }
};

export const getAdsInsights = async (
  accessToken,
  adSetID,
  since = '2023-02-01',
  until = '2023-02-28'
) => {
  try {
    const response = await axios({
      url: `https://graph.facebook.com/v15.0/${adSetID}?fields=name,ads{name,status,insights.time_range({"since":"${since}","until":"${until}"}){reach,clicks,impressions,spend,cpc,ctr,actions}}&access_token=${accessToken}`,
      method: 'GET',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    return error;
  }
};

export const getAllAdsInsights = async (
  accessToken,
  accountID,
  since = '2023-02-01',
  until = '2023-02-28'
) => {
  try {
    const response = await axios({
      url: `https://graph.facebook.com/v15.0/${accountID}?fields=name,ads{name,account_id,status,insights.time_range({"since":"${since}","until":"${until}"}){reach,clicks,impressions,spend,cpc,ctr,actions}}&access_token=${accessToken}`,
      method: 'GET',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    return error;
  }
};

export const getAllAdSetsInsights = async (
  accessToken,
  accountID,
  since = '2023-02-01',
  until = '2023-02-28'
) => {
  try {
    const response = await axios({
      url: `https://graph.facebook.com/v15.0/${accountID}?fields=name,campaigns{name,status,objective,adsets{name,account_id,campaign_id,status,insights.time_range({"since":"${since}","until":"${until}"}){reach,clicks,impressions,spend,cpc,ctr,actions}}}&access_token=${accessToken}`,
      method: 'GET',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    return error;
  }
};

export const getContacts = async (limit, after) => {
  try {
    const response = await axios({
      url: `https://api.hubapi.com/crm/v3/objects/contacts/search`,
      method: 'POST',
      mode: 'cors',
      headers: {
        Authorization: `Bearer ${config.HUBSPOT_API_KEY}`,
        'Content-Type': 'application/json',
      },
      data: {
        // filterGroups: [
        //   {
        //     filters: [
        //       {
        //         propertyName: 'email',
        //         operator: 'EQ',
        //         value: 'paula109@hotmail.com',
        //       },
        //     ],
        //   },
        // ],
        filterGroups: [
          {
            filters: [
              {
                propertyName: 'createdate',
                operator: 'GTE',
                value: new Date('2023-03-10').getTime(),
              },
              {
                propertyName: 'createdate',
                operator: 'LTE',
                value: new Date('2023-03-15').getTime() + 86400000, // add 1 day in milliseconds to include contacts from this day
              },
            ],
          },
        ],
        sorts: [
          {
            propertyName: 'createdate',
            direction: 'DESCENDING',
          },
        ],
        limit: limit,
        after: after,
        properties: [
          'firstname',
          'lastname',
          'email',
          'notes_last_updated',
          'hs_lead_status',
          'hubspot_owner_id',
          'hubspot_owner_assigneddate',
          'canal_de_captacion',
          'sub_canal_de_captacion',
          'desarrollo',
          'segmento',
          'gerente_contacto',
          'lun_contacto',
          'facilitador_compra_contacto',
          'hs_content_membership_status',
          'lifecyclestage',
          'hs_analytics_source',
          'hs_analytics_first_url',
        ],
      },
    });
    return response.data.results;
  } catch (error) {
    return error;
  }
};

// export const getContacts = async (amountResults) => {
//   try {
//     const limit = 100; // number of records to retrieve per page
//     const params = {
//       limit: limit,
//       properties:
//         'createdate, firstname, lastname, email, hs_lead_status, canal_de_captacion, sub_canal_de_captacion, desarrollo, segmento, gerente_contacto, lun_contacto, facilitador_compra_contacto, hs_content_membership_status',
//     };
//     const contacts = [];

//     let response = await axios({
//       url: 'https://api.hubapi.com/crm/v3/objects/contacts/search',
//       method: 'POST',
//       mode: 'cors',
//       headers: {
//         Authorization: `Bearer ${config.HUBSPOT_API_KEY}`,
//         'Content-Type': 'application/json',
//       },
//       data: {
//         sorts: [
//           {
//             propertyName: 'createdate',
//             direction: 'DESCENDING',
//           },
//         ],
//         properties: [
//           'firstname',
//           'lastname',
//           'email',
//           'hs_lead_status',
//           'canal_de_captacion',
//           'sub_canal_de_captacion',
//           'desarrollo',
//         ],
//       },
//       params,
//     });

//     contacts.push(...response.data.results);

//     while (response.data.paging.next.after) {
//       params.after = response.data.paging.next.after;
//       response = await axios({
//         url: 'https://api.hubapi.com/crm/v3/objects/contacts/search',
//         method: 'POST',
//         mode: 'cors',
//         headers: {
//           Authorization: `Bearer ${config.HUBSPOT_API_KEY}`,
//           'Content-Type': 'application/json',
//         },
//         data: {
//           sorts: [
//             {
//               propertyName: 'createdate',
//               direction: 'DESCENDING',
//             },
//           ],
//           properties: [
//             'firstname',
//             'lastname',
//             'email',
//             'hs_lead_status',
//             'canal_de_captacion',
//             'sub_canal_de_captacion',
//             'desarrollo',
//           ],
//         },
//         params,
//       });

//       contacts.push(...response.data.results);

//       // Stop pagination when we have retrieved amountResults contacts
//       if (contacts.length >= amountResults) {
//         break;
//       }
//     }

//     return contacts;
//   } catch (error) {
//     return error;
//   }
// };

export const getAllContacts = async (limit) => {
  try {
    const response = await axios({
      url: `https://api.hubapi.com/crm/v3/objects/contacts`,
      method: 'GET',
      mode: 'cors',
      headers: {
        Authorization: `Bearer ${config.HUBSPOT_API_KEY}`,
        'Content-Type': 'application/json',
      },
      params: {
        limit: limit,
        properties:
          'firstname, lastname, email, notes_last_updated, hs_lead_status, hubspot_owner_id, hubspot_owner_assigneddate, canal_de_captacion, sub_canal_de_captacion, desarrollo, segmento, gerente_contacto, lun_contacto, facilitador_compra_contacto, hs_content_membership_status, updatedAt',
      },
    });
    return response.data.results;
  } catch (error) {
    return error;
  }
};

// SEARCH MODE

// export const getContacts = async (limit) => {
//   try {
//     const response = await axios({
//       url: `https://api.hubapi.com/crm/v3/objects/contacts/search`,
//       method: 'POST',
//       headers: {
//         Authorization: `Bearer ${config.HUBSPOT_API_KEY}`,
//         'Content-Type': 'application/json',
//       },
//       data: {
//         sorts: [
//           {
//             propertyName: 'createdate',
//             direction: 'DESCENDING',
//           },
//         ],
//       },
//       params: {
//         limit: limit,
//         properties:
//           'firstname, lastname, email, hs_lead_status, canal_de_captacion, sub_canal_de_captacion, desarrollo, segmento, gerente_contacto, lun_contacto, facilitador_compra_contacto, hs_content_membership_status',
//       },
//     });
//     return response.data.results;
//   } catch (error) {
//     return error;
//   }
// };
