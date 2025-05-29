import { Injectable } from "@nestjs/common";
import { InsertionDTO } from "../dto/InsertionDTO";
import { UpdateDTO } from "../dto/UpdateDTO";
import { UtilService } from "../util/util.service";
//import * as mysql from "mysql2";
import { Pool } from 'pg';

@Injectable()
export class DbService {
private pool: Pool;
  constructor(private utilService: UtilService) {
    this.createConnectionPool();
  }
 private createConnectionPool() {
  try {
    this.pool = new Pool({
      host: this.utilService.DB_HOST,
      user: this.utilService.DB_USER,
      port: this.utilService.DB_PORT,
      password: this.utilService.DB_PASSWORD,
      database: this.utilService.DB_DATABASE,
      max: 30, // Maximum number of connections in the pool
    });

    this.pool.on('connect', () => {
      console.log('PostgreSQL pool connected');
    });

    this.pool.on('error', (err) => {
      console.error('PostgreSQL Pool Error:', err);
    });

  } catch (error) {
    console.error('Error creating PostgreSQL pool:', error);
  }
}


private async runQuery(query: string, values: any[] = []): Promise<any> {
  try {
    const res = await this.pool.query(query, values);
    return res.rows;
  } catch (error) {
    console.error("DB Error:", error);
    throw error;
  }
}

  private prepareQuery(query: string): { query: string; values: any[] } {
    const values: string[] = [];
    const prepared = query
      .replace(/='([^']*)'/g, (_, val) => {
        values.push(val);
        return "= ?";
      })
      .replace(/IN\s?\(([^)]+)\)/g, (_, group) => {
        const items = group.split(",").map((v) => v.trim().replace(/^'|'$/g, ""));
        values.push(...items);
        return `IN (${items.map(() => "?").join(", ")})`;
      })
      .replace(/BETWEEN\s?'([^']+)'\s?AND\s?'([^']+)'/g, (_, from, to) => {
        values.push(from, to);
        return "BETWEEN ? AND ?";
      });

    return { query: prepared, values };
  }

 async execute(queryStr: string): Promise<any> {
  const values: string[] = [];
  const preparedStatement = queryStr.replace(/='([^']*)'/g, (_, val) => {
    values.push(val);
    return `= $${values.length}`;
  });

  try {
    const result = await this.pool.query(preparedStatement, values);
    return result.rows;
  } catch (error) {
    console.error("Error executing query:", error);
    throw error;
  }
}


  async getById(queryStr: string): Promise<any> {
    const result = await this.execute(queryStr);
    return result?.[0] ?? null;
  }

async insertData(tableName: string, data: { set: string; value: string }[]): Promise<InsertionDTO> {
  const columns = data.map((d) => `"${d.set}"`);
  const placeholders = data.map((_, i) => `$${i + 1}`);
  const values = data.map((d) => d.value);

  const query = `INSERT INTO "${tableName}" (${columns.join(", ")}) VALUES (${placeholders.join(", ")}) RETURNING *`;

  try {
    const result = await this.pool.query(query, values);
    return result.rows[0];
  } catch (error) {
    console.error("Insert Error:", error);
    throw error;
  }
}
  getInsertQuery(tableName: string, data: { set: string; value: string }[]): string {
    const columns = data.map((d) => `\`${d.set}\``).join(", ");
    const values = data.map((d) => `'${d.value}'`).join(", ");
    return `INSERT INTO \`${tableName}\` (${columns}) VALUES (${values})`;
  }

  updateQuery(tableName: string, set: string[], where: string[]): string {
    const setClause = set.join(", ");
    const whereClause = where.join(" AND ");
    return `UPDATE \`${tableName}\` SET ${setClause} WHERE ${whereClause}`;
  }

  updateData(tableName: string, set: string[], where: string[]): Promise<UpdateDTO> {
    const query = this.updateQuery(tableName, set, where);
    return new Promise((resolve) => {
      this.pool.query(query, (error, results: UpdateDTO) => {
        if (error) {
          resolve({
            fieldCount: 0,
            affectedRows: 0,
            insertId: 0,
            serverStatus: 0,
            warningCount: 0,
            message: error.message,
            protocol41: true,
            changedRows: 0,
            code: error.code,
          });
        } else {
          resolve(results);
        }
      });
    });
  }

  updateOcrData(tableName: string, set: { set: string; value: string }[], where: { set: string; value: string }[]): Promise<UpdateDTO> {
    const setClause = set.map((s) => `\`${s.set}\` = '${s.value}'`).join(", ");
    const whereClause = where.map((w) => `\`${w.set}\` = '${w.value}'`).join(" AND ");
    const query = `UPDATE \`${tableName}\` SET ${setClause} WHERE ${whereClause}`;

    return this.updateData(tableName, [setClause], [whereClause]);
  }
}