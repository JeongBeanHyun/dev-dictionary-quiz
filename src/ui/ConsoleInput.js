import readline from "readline";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

export function ask(query) {
  return new Promise((resolve) => {
    rl.question(query, (answer) => resolve(answer.trim()));
  });
}

function validateNumberInput(answer, range) {
  const num = Number(answer);

  if (Number.isNaN(num)) {
    return { valid: false, message: "⚠️ 숫자로 입력해주세요." };
  }

  if (range && typeof range.min === "number" && typeof range.max === "number") {
    const { min, max } = range;
    if (num < min || num > max) {
      return {
        valid: false,
        message: `⚠️ ${min} ~ ${max} 사이의 숫자를 입력해주세요.`,
      };
    }
  }

  return { valid: true, value: num };
}

export async function getNumber(query, range = null) {
  while (true) {
    const answer = await ask(query);

    const result = validateNumberInput(answer, range);

    if (!result.valid) {
      console.log(result.message);
      continue;
    }

    return result.value;
  }
}

export async function getMenuNumber(query, range = null) {
  return getNumber(query, range);
}

export function closeInput() {
  rl.close();
}
