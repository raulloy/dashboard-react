import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  properties: {
    canal_de_captacion: String,
    createdate: Date,
    desarrollo: String,
    email: String,
    notes_last_updated: Date,
    facilitador_compra_contacto: String,
    firstname: String,
    gerente_contacto: String,
    hs_analytics_first_url: String,
    hs_analytics_source: String,
    hs_content_membership_status: String,
    hs_lead_status: String,
    hs_object_id: String,
    hubspot_owner_id: String,
    hubspot_owner_assigneddate: Date,
    lastmodifieddate: Date,
    lastname: String,
    lifecyclestage: String,
    lun_contacto: String,
    segmento: String,
    sub_canal_de_captacion: String,
  },
  createdAt: Date,
  updatedAt: Date,
  archived: Boolean,
});

const Contact = mongoose.model('Contact', contactSchema);

export default Contact;
