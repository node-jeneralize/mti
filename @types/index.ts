import { MongoClientOptions } from 'mongodb';

export interface CollectionIds {
  collectionName: string;
  ids: string[];
}

export interface InjectableCollection<T = object> {
  collectionName: string;
  documents: T[];
}

export interface RunnerParams<O = object> {
  uri: string;
  dbName: string;
  insertCollections: InjectableCollection<O>[];
  clientOptions?: MongoClientOptions;
}
