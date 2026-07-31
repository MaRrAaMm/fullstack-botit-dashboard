export const calculatePagination = (page, limit) => {
  const currentPage = Number(page) || 1;
  const currentLimit = Number(limit) || 6;

  return {
    page: currentPage,
    limit: currentLimit,
    skip: (currentPage - 1) * currentLimit,
  };
};

export const buildFilter = (search, category) => {
  const filter = {};
  if (search) {
    filter.name = {
      $regex: search,
      $options: "i",
    };
  }

  if (category && category !== "all") {
    filter.category = category;
  }
  return filter;
};

export const getSortOption = (sort) => {
  switch (sort) {
    case "price-asc":
      return { price: 1 };
    case "price-desc":
      return { price: -1 };
    case "name":
      return { name: 1 };
    default:
      return null;
  }
};