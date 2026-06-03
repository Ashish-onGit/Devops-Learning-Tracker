const dotenv = require('dotenv');
const path = require('path');
dotenv.config();

const providerType = process.env.AI_PROVIDER || 'openai';

const generateChatResponse = async (prompt, context = '') => {
  const systemPrompt = `You are a Senior DevOps Tutor in the DevOps Compass application. 
Help users learn DevOps, troubleshoot container logs, orchestrate Kubernetes nodes, write bash scripts, and build Terraform state files.
Provide expert architectural summaries, best practices, step-by-step console commands, and markdown-styled logs. Keep explanations clear, detailed, and professional.
${context ? `Active Lesson Page Context: ${context}` : ''}`;

  const hasKeys = process.env.OPENAI_API_KEY || process.env.ANTHROPIC_API_KEY || process.env.GOOGLE_API_KEY || process.env.GROQ_API_KEY;
  if (!hasKeys) {
    return simulateTutorResponse(prompt, context);
  }

  try {
    if (providerType === 'groq' && process.env.GROQ_API_KEY) {
      return await callGroq(systemPrompt, prompt);
    } else if (providerType === 'openai' && process.env.OPENAI_API_KEY) {
      return await callOpenAI(systemPrompt, prompt);
    } else if (providerType === 'anthropic' && process.env.ANTHROPIC_API_KEY) {
      return await callAnthropic(systemPrompt, prompt);
    } else if (providerType === 'gemini' && process.env.GOOGLE_API_KEY) {
      return await callGemini(systemPrompt, prompt);
    } else {
      return simulateTutorResponse(prompt, context);
    }
  } catch (error) {
    console.error(`AI Provider error (${providerType}):`, error.message);
    throw new Error(`AI Tutor connection failed: ${error.message}`);
  }
};

const callOpenAI = async (systemPrompt, prompt) => {
  const { OpenAI } = require('openai');
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const model = process.env.OPENAI_MODEL || 'gpt-4o-mini';
  
  const completion = await openai.chat.completions.create({
    model: model,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: prompt }
    ],
    temperature: parseFloat(process.env.TEMPERATURE || '0.7'),
    max_tokens: parseInt(process.env.MAX_TOKENS || '4000')
  });

  return completion.choices[0].message.content;
};

const callGroq = async (systemPrompt, prompt) => {
  const apiKey = process.env.GROQ_API_KEY;
  const model = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile';
  
  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt }
      ],
      temperature: parseFloat(process.env.TEMPERATURE || '0.7'),
      max_tokens: parseInt(process.env.MAX_TOKENS || '4500')
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Groq API error (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
};

const callAnthropic = async (systemPrompt, prompt) => {
  const Anthropic = require('@anthropic-ai/sdk');
  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const message = await anthropic.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: parseInt(process.env.MAX_TOKENS || '4000'),
    temperature: parseFloat(process.env.TEMPERATURE || '0.7'),
    system: systemPrompt,
    messages: [
      { role: 'user', content: prompt }
    ]
  });

  return message.content[0].text;
};

const callGemini = async (systemPrompt, prompt) => {
  const { GoogleGenAI } = require('@google/genai');
  const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: `${systemPrompt}\n\nUser Question: ${prompt}`,
    config: {
      temperature: parseFloat(process.env.TEMPERATURE || '0.7'),
      maxOutputTokens: parseInt(process.env.MAX_TOKENS || '4000')
    }
  });

  return response.text;
};

const simulateTutorResponse = (prompt, context) => {
  const p = prompt.toLowerCase();
  
  if (p.includes('ingress')) {
    return `### Kubernetes Ingress Tutorial\n\nAn **Ingress** is an API object that manages external access to the services in a cluster, typically HTTP/HTTPS. Ingress can provide load balancing, SSL termination, and name-based virtual hosting.\n\n#### 1. Ingress Architecture Flow\n\`\`\`\n[Client Request] ──> [Ingress Controller (e.g. Nginx)] ──> [Kubernetes Service] ──> [Pods]\n\`\`\`\n\n#### 2. Declarative Ingress Resource YAML\n\`\`\`yaml\napiVersion: networking.k8s.io/v1\nkind: Ingress\nmetadata:\n  name: myapp-ingress\n  annotations:\n    nginx.ingress.kubernetes.io/ssl-redirect: "false"\nspec:\n  ingressClassName: nginx\n  rules:\n  - host: myapp.local\n    http:\n      paths:\n      - path: /\n        pathType: Prefix\n        backend:\n          service:\n            name: myapp-ui-service\n            port:\n              number: 80\n\`\`\`\n\n#### Best Practices\n* Always use an explicit **ingressClassName** (like \`nginx\` or \`traefik\`).\n* Configure TLS certificates securely using secret names pointing to cert managers.`;
  }
  
  if (p.includes('statefulset') || p.includes('deployment')) {
    return `### Deployments vs. StatefulSets\n\nHere is a direct architectural comparison of these workload controllers:\n\n| Feature | Deployment | StatefulSet |\n| :--- | :--- | :--- |\n| **Pod Identity** | Ephemeral, random hashes (e.g., \`web-7df46b\`) | Stable, ordinal index (e.g., \`web-0\`, \`web-1\`) |\n| **Storage Link** | Shared volume claim templates | Dedicated VolumeClaimTemplates per replica |\n| **Scaling Order** | Parallel startup and shutdown | Ordered, index-based (starts 0 first, shuts down highest first) |\n| **Use Case** | Stateless API containers, Nginx frontends | Stateful databases (PostgreSQL, MongoDB, Elasticsearch) |\n\n#### Key Takeaway\nUse **StatefulSet** when your containers require stable network DNS hostnames or persistent storage volumes that must bind to the same pod instance across restarts.`;
  }

  if (p.includes('terraform state')) {
    return `### How Terraform State Works\n\nTerraform state is the single source of truth that maps your declarative HCL configuration to real-world cloud resources. By default, it is saved in a local file called \`terraform.tfstate\`.\n\n#### Core Functions:\n1. **Mapping**: Tracks which cloud resource ID corresponds to which Terraform resource declaration.\n2. **Metadata**: Caches resource dependencies and ordering info.\n3. **Drift Detection**: Compares code vs current state to identify if console updates occurred.\n\n#### Best Practices in Production:\n* **Configure Remote Backends**: Store state in remote storage (e.g., AWS S3 or HashiCorp Cloud) with state locking (via DynamoDB) to prevent concurrent writes.\n* **Avoid State Version Control**: Never commit state files to GitHub, as they contain raw API keys, passwords, and database credentials in plaintext.`;
  }

  return `### DevOps Tutor Response\n\nYou asked: *"${prompt}"*\n\nHere is a summary response on this DevOps topic:\n\n1. **Concept Summary**: Master this framework to establish reliable CI/CD pipelines, container instances, and cloud architecture targets.\n2. **Common CLI Command**:\n\`\`\`bash\n# Check configurations and system status logs\nkubectl get events --sort-by='.metadata.creationTimestamp'\n\`\`\`\n3. **Recommendation**: Implement logging telemetry, monitoring tools, and DevSecOps validations early in your development pipeline.\n\n*Note: Set up your AI API keys (like OPENAI_API_KEY) in the backend \`.env\` file to enable live responses from GPT-4o or Claude.*`;
};

module.exports = {
  generateChatResponse
};
