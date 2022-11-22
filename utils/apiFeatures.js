module.exports = class APIfeatures {
  constructor(findQuery, queryObj) {
    this.findQuery = findQuery;
    this.orignalQuery = { ...queryObj };

    const excludedFields = ["page", "limit", "fields", "sort"];
    excludedFields.forEach((e) => delete queryObj[e]);

    this.findParams = queryObj;
  }
  filter() {
    this.findParams = JSON.parse(
      JSON.stringify(this.findParams).replace(
        /gt|gte|lt|lte/g,
        (el) => `$${el}`
      )
    );
    this.findQuery = this.findQuery.find(this.findParams);
    return this;
  }
  limit() {
    if (this.orignalQuery.fields) {
      const fields = this.orignalQuery.fields.replace(/,/g, " ");
      this.findQuery = this.findQuery.select(fields);
    }
    return this;
  }
  sort() {
    if (this.orignalQuery.sort) {
      const sortFields = this.orignalQuery.sort.replace(",", " ");
      this.findQuery = this.findQuery.sort(sortFields);
    }
    return this;
  }
  paginate() {
    let limit = 5;
    if (this.orignalQuery.limit) {
        limit = this.orignalQuery.limit
    }
    let page = 1;
    if (this.orignalQuery.page) {
        page = this.orignalQuery.page;
    }
    this.findQuery = this.findQuery.skip((page*1-1)*limit).limit(limit*1);
    return this
  }
};
