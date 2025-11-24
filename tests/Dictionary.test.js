// tests/Dictionary.test.js
import Dictionary from "../src/logic/Dictionary.js";

describe("Dictionary 테스트", () => {
  const dictionary = new Dictionary(); // 실제 src/data/terms.json 사용

  test("Terms()는 모든 용어 배열을 반환해야 한다.", () => {
    const terms = dictionary.Terms();

    expect(Array.isArray(terms)).toBe(true);
    expect(terms.length).toBeGreaterThan(0);

    // 첫 번째 항목에 기본 필드들이 있는지 정도만 확인
    const first = terms[0];
    expect(first).toHaveProperty("id");
    expect(first).toHaveProperty("term");
    expect(first).toHaveProperty("category");
  });

  test("filterByCategory()는 해당 category만 남겨야 한다.", () => {
    const all = dictionary.Terms();
    const firstCategory = all[0].category;

    const filtered = dictionary.filterByCategory(firstCategory);

    expect(filtered.length).toBeGreaterThan(0);
    filtered.forEach((t) => {
      expect(t.category).toBe(firstCategory);
    });
  });

  test("findById()는 해당 id의 항목을 찾아야 한다.", () => {
    const all = dictionary.Terms();
    const firstId = all[0].id;

    const found = dictionary.findById(firstId);

    expect(found).toBeDefined();
    expect(found.id).toBe(firstId);
  });

  test("findById()는 존재하지 않는 id면 undefined를 반환해야 한다.", () => {
    const found = dictionary.findById(999999999);
    expect(found).toBeUndefined();
  });
});
