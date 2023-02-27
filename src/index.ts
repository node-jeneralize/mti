import { MongoClient } from 'mongodb';
import {
  InjectableCollection,
  CollectionIds,
  RunnerParams,
} from '../@types/index';
import { parseValueToId } from '@/libs/parseValueToId';
import { logMessage } from '@/libs/logMessage';

const run = async (
  client: MongoClient,
  dbName: string,
  insertCollections: InjectableCollection[]
) => {
  const pushedCollectionIds: CollectionIds[] = [];

  for (let i = 0; i < insertCollections.length; i++) {
    const { collectionName, documents } = insertCollections[i];

    const database = client.db(dbName);

    const parsedDocuments = documents.map((doc) =>
      parseValueToId(doc, pushedCollectionIds)
    );
    const collection = database.collection(collectionName);
    const { insertedCount, insertedIds } = await collection.insertMany(
      parsedDocuments
    );

    pushedCollectionIds.push({
      collectionName,
      ids: Object.values(insertedIds).map((id) => String(id)),
    });

    logMessage(`Created ${insertedCount} documents in ${collectionName}.`);
  }
  await client.close();
};

/**
 * DB に対してデータを投入する
 * @param params
 * @param params.uri 投入先の mongodb のURI
 * @param params.dbName 投入先の dbName
 * @param params.insertCollections 投入するデータ情報の Array
 * @param params.options クライアントとして渡す MongoClientOptions
 */
export const mti = (params: RunnerParams): Promise<void> => {
  const client = new MongoClient(params.uri, params.clientOptions);

  return run(client, params.dbName, []).catch((...param) =>
    console.dir(...param)
  );
};

export { InjectableCollection, RunnerParams } from '../@types';
