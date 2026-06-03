const mongoose = require('mongoose');

const CertificationPathSchema = new mongoose.Schema({
  provider: { type: String, required: true }, // AWS, Kubernetes, Terraform, Linux
  name: { type: String, required: true },
  code: { type: String },
  level: { type: String }, 
  domains: [{
    name: { type: String, required: true },
    weight: { type: String } 
  }],
  resources: [String]
}, { timestamps: true });

module.exports = mongoose.model('CertificationPath', CertificationPathSchema);
