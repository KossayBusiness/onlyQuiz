import { Pool } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import * as schema from "../shared/schema";
import ws from 'ws';

// Configuration pour Neon Serverless
if (typeof global.WebSocket === "undefined") {
  // @ts-ignore
  global.WebSocket = ws;
}

// Vérifier si la variable d'environnement DATABASE_URL est définie
if (!process.env.DATABASE_URL) {
  console.warn('DATABASE_URL not found. Using local PostgreSQL connection.');
}

// Créer le pool de connexion
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Initialiser la connexion Drizzle avec le schéma
export const db = drizzle(pool, { schema });