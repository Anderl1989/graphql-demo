import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GraphQLFileLoader } from '@graphql-tools/graphql-file-loader';
import { loadSchemaSync } from '@graphql-tools/load';
import { createHandler } from 'graphql-http/lib/use/express';
import { ruruHTML } from 'ruru/server';

import db from './db.js';
import resolver from './resolver/index.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const schema = loadSchemaSync(path.join(__dirname, 'schema/index.gql'), {
  loaders: [new GraphQLFileLoader()],
});

const app = express();
const port = 3000;

// logging middleware
app.use((req, res, next) => {
  console.log(`\n${req.method} - ${req.path}`);
  next();
});

// GraphQL Playground
app.get('/api/graphql', (_req, res) => {
  res.type('html');
  res.end(ruruHTML({ endpoint: '/api/graphql' }));
})

// GraphQL API
app.all('/api/graphql', createHandler({
  schema: schema,
  rootValue: resolver,
}));

// static file hosting for frontend
app.use('/', express.static('./frontend/dist/'));
app.use(function(req, res) {
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});