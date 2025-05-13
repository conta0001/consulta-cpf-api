const axios = require('axios');

exports.handler = async (event, context) => {
  const cpf = event.queryStringParameters.cpf;

  if (!cpf) {
    return {
      statusCode: 400,
      body: JSON.stringify({ status: 400, erro: 'CPF não informado' }),
    };
  }

  try {
    const response = await axios.post(
      'https://consultacorreios.shop/api.php',
      new URLSearchParams({ cpf: cpf.replace(/\D/g, '') }),
      {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      }
    );

    const data = response.data;

    let dados = {};

    if (data.status === 200 && data.dados) {
      dados = data.dados;
    } else if (data.debug && data.debug.dados) {
      dados = data.debug.dados;
    } else {
      return {
        statusCode: 500,
        body: JSON.stringify({ status: 500, erro: 'Resposta inesperada da API', debug: data }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        status: 200,
        cpf: dados.CPF || '',
        nome: dados.NOME || '',
        mae: dados.MAE || '',
        nascimento: dados.NASCIMENTO || '',
      }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ status: 500, erro: 'Erro ao consultar API', debug: err.message }),
    };
  }
};
