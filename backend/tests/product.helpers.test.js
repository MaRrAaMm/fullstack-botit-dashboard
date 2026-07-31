import { calculatePagination,buildFilter,getSortOption } from "../src/Modules/product/product.helpers.js";
describe("calculatePagination", () => {
  test("should calculate skip correctly for first page", () => {
    const result = calculatePagination(1, 6);

    expect(result).toEqual({
      page: 1,
      limit: 6,
      skip: 0,
    });
  });

  test("should calculate skip correctly for third page", () => {
    const result = calculatePagination(3, 6);

    expect(result).toEqual({
      page: 3,
      limit: 6,
      skip: 12,
    });
  });

  test("should use default values when page and limit are invalid", () => {
    const result = calculatePagination(undefined, undefined);

    expect(result).toEqual({
      page: 1,
      limit: 6,
      skip: 0,
    });
  });
});

describe("buildFilter", () => {
  test("should build search filter", () => {
    expect(buildFilter("iphone", "")).toEqual({
      name: {
        $regex: "iphone",
        $options: "i",
      },
    });
  });

  test("should build category filter", () => {
    expect(buildFilter("", "phones")).toEqual({
      category: "phones",
    });
  });

  test("should build search and category filter", () => {
    expect(buildFilter("iphone", "phones")).toEqual({
      name: {
        $regex: "iphone",
        $options: "i",
      },
      category: "phones",
    });
  });

  test("should return empty filter", () => {
    expect(buildFilter("", "")).toEqual({});
  });
});

describe("getSortOption", () => {
  test("should return ascending price sort", () => {
    expect(getSortOption("price-asc")).toEqual({
      price: 1,
    });
  });

  test("should return descending price sort", () => {
    expect(getSortOption("price-desc")).toEqual({
      price: -1,
    });
  });

  test("should return name sort", () => {
    expect(getSortOption("name")).toEqual({
      name: 1,
    });
  });

  test("should return null for default", () => {
    expect(getSortOption("default")).toBeNull();
  });
});