const { Pool, Client } = require("pg");

const credentials = {
  user: "postgres",
  host: "your_url",
  //   database: "nodedemo",
  password: "your_password",
  port: 5432,
  // database: "ocr_ged_labs"
};

// Connect with a connection pool.

async function poolDemo() {
  const pool = new Pool(credentials);
  const now = await pool.query("SELECT NOW()");
  await pool.end();

  return now;
}

// Connect with a client.

async function clientDemo() {
  const client = new Client(credentials);
  await client.connect();
  const now = await client.query("SELECT NOW()");
  await client.end();

  return now;
}

// Use a self-calling function so we can use async / await.

async function registerDocumnet(document) {
  const pool = new Pool(credentials);
  const sql = "INSERT INTO documents (text) VALUES ($1) RETURNING id";
  const values = [document.text];
  const result = await pool.query(sql, values);
  return result;
}

async function createDocumentsTable() {
  const sql = "CREATE TABLE documents (id SERIAL PRIMARY KEY, text TEXT)";
  const pool = new Pool(credentials);
  const result = await pool.query(sql);
  console.log(result);
}

async function fullTextSeachDocuments(searchTerm) {
  const sql =
    "SELECT * FROM documents WHERE to_tsvector(text) @@ to_tsquery($1)";
  const pool = new Pool(credentials);
  const result = await pool.query(sql, [searchTerm]);
  pool.end();
  return result.rows;
}

const queryDocuments = async (searchTerm) => {
  const sql =
    "SELECT * FROM documents WHERE to_tsvector(text) @@ to_tsquery($1)";
  const pool = new Pool(credentials);
  const result = await pool.query(sql, [searchTerm]);
  pool.end();
  return result.rows;
};

const describeDatabase = async () => {
  const sql =
    "SELECT * FROM information_schema.tables WHERE table_schema = 'public'";
  const pool = new Pool(credentials);
  const result = await pool.query(sql);
  return result.rows;
};

async function getDocuments() {
  const sql = "SELECT * FROM documents";
  const pool = new Pool(credentials);
  const result = await pool.query(sql);
  return result.rows;
}

(async () => {
  //   const poolResult = await poolDemo();
  //   console.log("Time with pool: " + poolResult.rows[0]["now"]);

  //   const clientResult = await clientDemo();
  //   console.log("Time with client: " + clientResult.rows[0]["now"]);

  // await createDocumentsTable();
  //   const result = await registerDocumnet({
  //     text: "4. Clique FECHAR finalizar instalação. Instalação Java - Concluída - Java ORACLE instalação Java concluída êxito atualizações Java disponíveis, avisado. instale atualizações obter aperfeiçoamentos desempenho segurança. informações definições atualização clicar Fechar, browser aberto, possa verificar Java funcionando. Fechar",
  //   });
  // const documents = await getDocuments();
  //   console.log(documents);

  // const result = await fullTextSeachDocuments("fechar");
  const result = await queryDocuments("fech:*");
  console.log(result);
})();

/* ts_query operators
and - &
or - |
not - !
 */

// busca pré fixada tende a ser mais lenta que a busca por termos

// busca sem acento 
// CREATE EXTENSION IF NOT EXISTS unaccent;
