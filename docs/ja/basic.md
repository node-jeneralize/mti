# 初歩的な使い方

## 1. パッケージ導入

```shell
$ npm i -D mti
```

## 2. ドキュメントデータを作って投入する

```ts
import { mti, InjectableCollectionModule } from '@node-jeneralize/mti';

const users: User[] = [...new Array(10)].map((_, index) => {
  return {
    name: `sampleUser: ${hoge}`,
    version: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
});

const usersCollection: InjectableCollectionModule<User> = {
  collectionName: 'users',
  documents: users,
};

mti({
  uri: 'mongodb://root:password@127.0.0.1:8080',
  dbName: 'sample',
  insertCollections: [usersCollection],
  clientOptions: {
    authSource: 'admin',
  },
}).then(() => {
  console.log('Succeed to post testdata in mongoDB!');
});
```
