# 外部コレクションとのリレーション

例えば、`User` という Entity が存在したと仮定して `Cat` という別の Entity の `owner` というキーで `User` の id が入るようなケースを想定する

```ts
export interface User {
  name: string;
  version: number;
  createdAt: string;
  updatedAt: string;
}

export interface Cat {
  name: string;
  age: number;
  owner: ObjectId; // User の id を指す
  version: number;
  createdAt: string;
  updatedAt: string;
}
```

この場合 `Cat.owner` に持たせる `User.id` のリレーション解決は以下の手順で行う

## 1. コレクション情報構築

以下のコードに示すように、`Cat` の interface を `Omit<Cat, 'owner'>` で `owner` を消してから上書きしてやる。  
そして `owner` に **`#{collectionName}-${collectionsNumber}`** の形式で文字列を渡すと投入済みのテストデータから id を検索して置き換える。
上記の `collectionName` は `InjectableCollection.collectionName` で解決される。  
また `collectionsNumber` は `InjectableCollection.documents` のインデックスで解決される

```ts
import { InjectableCollection } from 'mti';

interface MockedCat extends Omit<Cat, 'owner'> {
  owner: string;
}

const cats: MockedCat[] = [...new Array(10)].map((_, index) => {
  return {
    name: `catName: ${index}`,
    age: index + 3,
    owner: `#users-${index}`, // user コレクションの index で得られた ObjectId でリレーションされる
    version: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
});

const catsCollection: InjectableCollection<MockedCat> = {
  collectionName: 'cats',
  documents: cats,
};
```

## 2. 投入コレクションに登録

`mti` のパラメータの `insertCollections` に登録した順番に投入される。  
この際順番を間違えると `user` のドキュメントが見つからないと言われるので注意。
同様にコレクションが存在しても配列の参照結果が存在しなかった場合も同様にエラーになる。

```ts
mti({
  uri: 'mongodb://root:password@127.0.0.1:8080',
  dbName: 'sample',
  insertCollections: [usersCollection, catsCollection], // user を登録してから cats を inject する
});
```
