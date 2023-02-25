<h1 align="center">
mti 🌱
</h1>

<!-- ![NPM](https://img.shields.io/npm/l/mti?style=flat-square) -->

> mti -> mongo testdata inserter

# Summary

This package can insert prepared documents into any MongoDB instance.  
`mti` is inspired by [gcp-kit/fti](https://github.com/gcp-kit/fti).

# Basically use

## 1. install

```shell
$ npm i -D mti
```

## 2. create document data, post

```ts
import { mti, InjectableCollectionModule } from 'mti';

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

---

For more use cases, see [docs](./docs).

# License

MIT
