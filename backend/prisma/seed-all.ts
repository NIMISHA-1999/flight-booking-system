import { execSync } from "child_process";

console.log("Running main seed...");
execSync("tsx prisma/seed.ts", {
  stdio: "inherit",
});

console.log("Running admin seed...");
execSync("tsx prisma/seed-admin.ts", {
  stdio: "inherit",
});

console.log("All seeds completed successfully.");