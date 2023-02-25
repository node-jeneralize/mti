declare module 'mti' {
  import { MongoClientOptions } from 'mongodb';
  // テストデータを入れるときのコレクション名、それから実体の定義
  interface InjectableCollectionModule<T> {
    collectionName: string;
    documents: T[];
  }

  // テストデータ入れたあとの ids を保管する空間
  // ref の形で参照する用途で使用
  interface CollectionIds {
    collectionName: string;
    ids: string[];
  }

  // Runner の引数オプション設定
  interface RunnerParams<O = object> {
    uri: string;
    dbName: string;
    insertCollections: InjectableCollectionModule<O>[];
    options?: MongoClientOptions;
  }
}
