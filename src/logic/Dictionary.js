import path from "path";
import { readJSON } from "../utils/FileUtils.js";

export default class Dictionary {
  constructor(termsPath = path.resolve("src/data/terms.json")) {
    this.terms = readJSON(termsPath);
  }

  Terms() {
    return this.terms;
  }

  filterByCategory(category) {
    return this.terms.filter((t) => t.category === category);
  }

  findById(id) {
    return this.terms.find((t) => t.id === id);
  }

  getAllTerms() {
    return this.terms;
  }
}
