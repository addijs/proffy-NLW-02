import { createConnection, getConnection, getConnectionOptions } from 'typeorm';
import dotenv from 'dotenv';

dotenv.config();

const connection = {
  async create(){
		const connectionOption = await getConnectionOptions(process.env.NODE_ENV);
		const connection = await createConnection({ ...connectionOption, name: "default" });
		
		if(process.env.NODE_ENV !== 'production') {
			await connection.query('PRAGMA foreign_keys = ON');
		}
  },

  async close(){
    await getConnection().close(); 
	},
	
	async migrate() {
		await getConnection().runMigrations();
	},

	async dropDatabase() {
		await getConnection().dropDatabase();
	},

  async truncateAll(){
    const connection = getConnection();
    const entities = connection.entityMetadatas;

    entities.forEach(async (entity) => {
      const repository = connection.getRepository(entity.name);
      await repository.query(`DELETE FROM ${entity.tableName}`);
    });
	},
};

export default connection;