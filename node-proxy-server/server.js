const express = require('express');
const axios = require('axios');
const cors = require('cors');

require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json({ limit: '50mb' }));

app.post('/execute-workflow', async (req, res) => {
  const workflowId = "2ef78a56-8634-41dc-8433-209e34dca4da";
  const workflowVersionId = "b7b043be-2b7c-4a3f-bc4a-891a64b15467";
  const apiTokenSecret = process.env.API_TOKEN_SECRET;
  const apiTokenId = process.env.API_TOKEN_ID;
  const credentials = `${apiTokenId}:${apiTokenSecret}`;
  const base64Credentials = Buffer.from(credentials).toString('base64');

  try {
    const response = await axios.post(
      `https://api.vaas.live/workflows/v1/${workflowId}/execute`,
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