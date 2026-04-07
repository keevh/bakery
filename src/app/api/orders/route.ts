import { NextResponse } from "next/server";

import { createPublicOrder, parseCreatePublicOrderPayload } from "@/modules/orders/application/create-public-order";
import { PublicOrderValidationError } from "@/modules/orders/domain/public-order";
import { revalidateBakeryPaths } from "@/modules/shared/application/revalidate-bakery-paths";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const command = parseCreatePublicOrderPayload(payload);
    const order = await createPublicOrder(command);

    revalidateBakeryPaths();

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    if (error instanceof PublicOrderValidationError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ error: "Unable to create order." }, { status: 500 });
  }
}
