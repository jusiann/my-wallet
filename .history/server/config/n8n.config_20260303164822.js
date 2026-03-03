/**
 * N8N Webhook Configuration
 * Configuration for n8n integration (OCR and Exchange Rates)
 */

import dotenv from 'dotenv';

dotenv.config();

export const n8nConfig = {
  webhookUrl: process.env.N8N_WEBHOOK_URL,
  apiKey: process.env.N8N_API_KEY,
  
  // Validate configuration
  isConfigured: function() {
    return !!(this.webhookUrl && this.apiKey);
  },
  
  // Get headers for n8n requests
  getHeaders: function() {
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.apiKey}`,
    };
  },
};

export default n8nConfig;
