import { runApp } from "./src/runApp.js";

runApp().catch((err) => {
  console.error("예기치 못한 오류가 발생했습니다:", err);
});
