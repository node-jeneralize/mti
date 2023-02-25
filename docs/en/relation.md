# Outside collection relation

For example, assume that there is an Entity called `User`, and that the id of `User` is entered in the key `owner` of another Entity called `Cat`.

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
  owner: ObjectId; // Each as User's id
  version: number;
  createdAt: string;
  updatedAt: string;
}
```

In this case, the relation resolution of `User.id` to be held in `Cat.owner` is as follows.

## 1. collection data construction

Overwrite the `Cat` with `Omit<Cat, 'owner'>` after erasing `owner` as shown in the following code.  
Then, passing a string in the form **`#${collectionName}-${collectionsNumber}`** to the `owner` will retrieve the id from the submitted test data and replace it.  
The `collectionName` above is resolved with `InjectableCollection.collectionName`.  
Also, `collectionsNumber` is resolved at the index of `InjectableCollection.documents`.

```ts
import { InjectableCollection } from 'mti';

interface MockedCat extends Omit<Cat, 'owner'> {
  owner: string;
}

const cats: MockedCat[] = [...new Array(10)].map((_, index) => {
  return {
    name: `catName: ${index}`,
    age: index + 3,
    owner: `#users-${index}`, // Relation ObjectId from user collection's index
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

## 2. Register insert collections

The collections are submitted in the order in which they are registered in the `insertCollections` parameter of `mti`.  
Note that if you do this in the wrong order, you will be told that the `user` document cannot be found.  
Similarly, if a collection exists but the array reference result does not exist, the same error occurs.

```ts
mti({
  uri: 'mongodb://root:password@127.0.0.1:8080',
  dbName: 'sample',
  insertCollections: [usersCollection, catsCollection], // Inject cats after users injected
});
```
