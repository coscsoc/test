import { MockData } from "./store";

export function getMockByUrl(url: string, mockData: MockData[]) {
  const pp = url.split("/").filter(Boolean);
  return mockData
    .filter(
      ({ router }) =>
        // user/1 -> user/[id].ts
        // role/1/permission -> role/[id]/permission/index.ts
        // a -> a.ts || a/index.ts
        router.length - pp.length >= 0 && router.length - pp.length <= 1
    )
    .find(
      ({ router }) =>
        pp.filter(
          (p, index) => p === router[index] || router[index].endsWith("]")
        ).length === pp.length
    );
    /* console.log(pp)

    mockData.filter(({router})=>router.length-) */
}

/*思路
case:
/api/role/1/permission
*/