const express = require("express");
const app = express();

app.get("/", (req, res) => {
  const idade = parseInt(req.query.idade);
  const sexo = req.query.sexo;
  const salarioBase = parseFloat(req.query.salario_base);
  const anoContratacao = parseInt(req.query.anoContratacao);
  const matricula = parseInt(req.query.matricula);

  if (
    isNaN(idade) || idade <= 16 ||
    isNaN(salarioBase) || salarioBase <= 0 ||
    isNaN(anoContratacao) || anoContratacao <= 1960 ||
    isNaN(matricula) || matricula <= 0 ||
    (sexo !== 'M' && sexo !== 'F')
  ) {
    return res.send(`
      <h2 style="color:red;">❌ Dados inválidos!</h2>
      <p>Use a URL no formato:</p>
      <code>?idade=25&sexo=F&salario_base=1700&anoContratacao=2014&matricula=12345</code>
    `);
  }

  const anoAtual = new Date().getFullYear();
  const tempoEmpresa = anoAtual - anoContratacao;

  let reajuste = 0;
  let descontoOuAcrescimo = 0;

  if (idade >= 18 && idade <= 39) {
    if (sexo === 'M') reajuste = 0.10;
    else reajuste = 0.08;

    if (tempoEmpresa <= 10)
      descontoOuAcrescimo = sexo === 'M' ? -10 : -11;
    else
      descontoOuAcrescimo = sexo === 'M' ? 17 : 16;
  } 
  else if (idade >= 40 && idade <= 69) {
    if (sexo === 'M') reajuste = 0.08;
    else reajuste = 0.10;

    if (tempoEmpresa <= 10)
      descontoOuAcrescimo = sexo === 'M' ? -5 : -7;
    else
      descontoOuAcrescimo = sexo === 'M' ? 15 : 14;
  } 
  else if (idade >= 70 && idade <= 99) {
    if (sexo === 'M') reajuste = 0.15;
    else reajuste = 0.17;

    if (tempoEmpresa <= 10)
      descontoOuAcrescimo = sexo === 'M' ? -15 : -17;
    else
      descontoOuAcrescimo = sexo === 'M' ? 13 : 12;
  }

  const novoSalario = (salarioBase + salarioBase * reajuste) + descontoOuAcrescimo;

  res.send(`
    <html>
      <head>
        <meta charset="UTF-8">
        <title>Reajuste Salarial</title>
        <style>
          body {
            font-family: Arial;
            background-color: #f0f0f0;
            padding: 40px;
          }
          h1 { color: #333; }
          .box {
            background: white;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
          }
          .resultado {
            color: green;
            font-size: 22px;
            font-weight: bold;
          }
        </style>
      </head>
      <body>
        <h1>💼 Cálculo de Reajuste Salarial</h1>
        <div class="box">
          <p><b>Matrícula:</b> ${matricula}</p>
          <p><b>Idade:</b> ${idade} anos</p>
          <p><b>Sexo:</b> ${sexo}</p>
          <p><b>Salário Base:</b> R$ ${salarioBase.toFixed(2)}</p>
          <p><b>Ano de Contratação:</b> ${anoContratacao}</p>
          <p><b>Tempo de Empresa:</b> ${tempoEmpresa} anos</p>
          <hr>
          <p><b>Percentual de Reajuste:</b> ${(reajuste * 100).toFixed(0)}%</p>
          <p><b>Desconto/Acrescimo:</b> R$ ${descontoOuAcrescimo.toFixed(2)}</p>
          <p class="resultado">💰 Novo Salário: R$ ${novoSalario.toFixed(2)}</p>
        </div>
      </body>
    </html>
  `);
});

module.exports = app;
