import { ensureBakeryBootstrap, getBootstrapCredentials } from "../modules/bootstrap/application/ensure-bakery-bootstrap";

async function main() {
  await ensureBakeryBootstrap();

  const credentials = getBootstrapCredentials();

  console.log("Bakery bootstrap completed.");
  console.log(`Admin user: ${credentials.email}`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : "Bakery bootstrap failed.");
  process.exit(1);
});
