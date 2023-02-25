import { ObjectId } from 'mongodb';
import { CollectionIds } from 'mti';

interface Ref {
  collectionName: string;
  refNumber: number;
}

/**
 * `#{collectionName}-${number}` の形態の値を取るかどうかを検証、返却する
 * @param inspector 検査対象の string
 * @returns もし Ref のオブジェクト体系として考えられる場合 Ref を示すオブジェクト
 * @returns そうでなければ null
 */
const predictToRef = (inspector: string): Ref | null => {
  // ref の形式の場合 `#{collectionName}` の体系で入ってくる
  const collectionName = inspector.match(/^(?<!#).*(?=-)/);
  // ref の形式の場合 `${refNumber}` の体系で入ってくる
  const refNumber = inspector.match(/(?<=-).*(\d)/);

  // 正規表現で解析失敗した場合は null が返るのでこれを検知したら早期 return
  if (collectionName === null || refNumber === null) {
    return null;
  }

  // refNumber が数値として扱えない場合も早期 return
  if (isNaN(Number(refNumber[0]))) {
    return null;
  }

  return {
    collectionName: collectionName[0],
    refNumber: Number(refNumber[0]),
  };
};

/**
 * ドキュメント情報の値を見て Ref のものは書き換えて返却する
 * @param value 解析対象のドキュメントオブジェクト
 * @param searchIds このドキュメントの解析段階での CollectionIds
 * @returns 解析、パースしたあとのドキュメントオブジェクト
 */
export const parseValueToId = (
  value: object,
  searchIds: CollectionIds[]
): { [key: string]: unknown } => {
  return Object.fromEntries(
    Object.entries(value).map(([key, value]) => {
      // string でないものはそのまま返却
      if (typeof value !== 'string') {
        return [key, value];
      }

      const predictedValue = predictToRef(value);
      // 文字列が `#hoge-${number}` の形式でなければ素通り
      if (!predictedValue) {
        return [key, value];
      }

      ////////////////////////////////////////////////////////////////////////////////
      /// ここから Ref であると断定して値の加工をする
      ////////////////////////////////////////////////////////////////////////////////
      const targetCollection: CollectionIds | undefined = searchIds.find(
        (collection) =>
          `#${collection.collectionName}` === predictedValue.collectionName
      );

      if (!targetCollection) {
        throw new Error(`Ref ${value} does not exist in pushed documents!`);
      }

      // ids の index から id の実体を入手
      const parsedId: string | undefined =
        targetCollection.ids[predictedValue.refNumber];

      if (!parsedId) {
        throw new Error(
          `Ref #${predictedValue.refNumber} does not exist in ${predictedValue.collectionName} index!`
        );
      }

      return [key, new ObjectId(parsedId)];
    })
  );
};
