import Dictionary from "./Dictionary.js";
import { randomInt, weightedRandom } from "../utils/RandomUtils.js";

export default class QuestionSelector {
  constructor(dictionary = new Dictionary(), history = null, config = null) {
    this.dictionary = dictionary;
    this.history = history;
    this.config = config ?? {};
  }

  pickRandomFrom(pool) {
    const idx = randomInt(0, pool.length - 1);
    return pool[idx];
  }

  pickRandom() {
    const all = this.dictionary.getAllTerms();
    return this.pickRandomFrom(all);
  }

  pickWeightedFrom(pool) {
    if (!this.history || !this.history.questionWeights) {
      return this.pickRandomFrom(pool);
    }

    const weightsObj = this.history.questionWeights;
    const defaultWeight = 1;
    const maxWeight = this.config.maxWeight ?? 10;

    const weights = pool.map((term) => {
      const saved = weightsObj[term.id] ?? 0;
      const w = defaultWeight + saved;
      return Math.min(w, maxWeight);
    });

    return weightedRandom(pool, weights);
  }

  pickRandomByCategory(category) {
    const pool = this.dictionary.filterByCategory(category);
    if (pool.length === 0) {
      throw new Error(`Category '${category}' has no terms.`);
    }
    return this.pickRandomFrom(pool);
  }

  pickWeakQuestion() {
    if (!this.history || !this.history.wrongHistory) {
      return this.pickRandom();
    }

    const wrongIds = this.history.wrongHistory;
    if (wrongIds.length === 0) {
      return this.pickRandom();
    }

    const allTerms = this.dictionary.getAllTerms();
    const pool = allTerms.filter((t) => wrongIds.includes(t.id));

    if (pool.length === 0) {
      return this.pickRandom();
    }

    return this.pickWeightedFrom(pool);
  }
}
