const express = require('express');
const axios = require('axios');
const cors = require('cors');

require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json({ limit: '50mb' }));

app.post('/execute-workflow', async (req, res) => {
  const workflowId = "848b1ddf-817f-4d7d-a7c7-70d9f11f9492";
  const workflowVersionId = "5eb979d5-99ed-408b-b3f7-ed5822387228";
  const apiTokenSecret = process.env.API_TOKEN_SECRET;
  const apiTokenId = process.env.API_TOKEN_ID;
  const credentials = `${apiTokenId}:${apiTokenSecret}`;
  const base64Credentials = Buffer.from(credentials).toString('base64');

  try {
    const response = await axios.post(
      `https://api.vaas.live/workflows/v1/${workflowId}/versions/${workflowVersionId}/execute`,
      req.body,
      {
        headers: {
          'Authorization': `Basic ${base64Credentials}`,
        },
      },
    );

    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(error.response ? error.response.status : 500).json({ error: 'Erro ao executar o workflow' });
  }
});

const PORT = process.env.SERVER_PORT;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});